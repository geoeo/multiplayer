///<reference path='../libs/jquery.d.ts'/>
///<reference path='../libs/lib.d.ts'/>
///<reference path='../libs/phaser.d.ts'/>

import Player = require('Player');

export class Arena extends Phaser.State {

    // global vars
    constructor(public map : Phaser.Tilemap ,
                public groundLayer : Phaser.TilemapLayer,
                public arenaLayer : Phaser.TilemapLayer,
                public player : Player.Player,
                public player2 : Player.Player,
                public cursors : Phaser.CursorKeys,
                public currentSpeed : number,
                public deathTimer : Phaser.Timer,
                public websocket){
        super();


    }

    preload() {
        this.websocket = new WebSocket("ws://localhost:9000/testSocket");

        this.websocket.onopen = function(evt) {

            console.log(evt.data);

        };

        this.websocket.onclose = function() {
            console.log("connections was closed");
        };

    }

    create() {

        console.log("arena.create");

        // don't auto destory
        this.deathTimer = new Phaser.Timer(this.game,false);

        this.map = this.game.add.tilemap('map');
        // add tiles to the tileset
        // @arg1 : name of tileset in .json , @arg2 tileset key in phaser
        this.map.addTilesetImage('tileset','tiles');

        //  Creates a groundLayer from the World1 groundLayer in the map data.
        //  A Layer is effectively like a Phaser.Sprite, so is added to the display list.
        this.groundLayer = this.map.createLayer('Ground');
        this.arenaLayer = this.map.createLayer('Arena');

        //  This resizes the game world to match the groundLayer dimensions
        this.groundLayer.resizeWorld();
        this.arenaLayer.resizeWorld();

        var groundTiles : Phaser.Tile[]  = this.groundLayer.getTiles(0,0,this.game.world.width,this.game.world.height);

        for(var i : number = 0; i < groundTiles.length; i++ ){
                groundTiles[i].setCollisionCallback(this.groundTileCollisionHandler,this);
        }
        var arenaTiles : Phaser.Tile[]  = this.arenaLayer.getTiles(0,0,this.game.world.width,this.game.world.height);

        for(var i : number = 0; i < arenaTiles.length; i++ ){
                arenaTiles[i].setCollisionCallback(this.arenaTileCollisionHandler,this);
        }

        //// PLAYER STUFF //////

        this.game.physics.startSystem(Phaser.Physics.ARCADE);

        this.player = new Player.Player(this.game,this.game.world.centerX,this.game.world.centerY,"player1",3,false,false);
        this.player2 = new Player.Player(this.game,this.game.world.centerX+50,this.game.world.centerY+30,"player2",3,false,false);

        this.cursors = this.game.input.keyboard.createCursorKeys();

        this.currentSpeed = 0;

        // rotate so that key controls match up
        this.player.angle -= 90;
//        this.playerOneShouldDie = false;


        if(this.websocket.readyState === 1 )
            this.websocket.send("multiplayer - ready to receive player positions")


    }

    update(){

        if(this.websocket.readyState === 1 )
            this.websocket.send("multiplayer - update");

        //  Collide the player with the platforms
        this.game.physics.arcade.collide(this.player, this.player2);
        this.game.physics.arcade.overlap(this.player, this.groundLayer);
        this.game.physics.arcade.overlap(this.player, this.arenaLayer);

        this.handleUserInput();
    }

    private handleUserInput(){

        // TODO yoyo tween not working
        if(this.game.input.keyboard.justPressed(Phaser.Keyboard.SPACEBAR)){
            this.player.toggleJumping();

            this.game.add.tween(this.player.scale).to({x : 2.0, y : 2.0},300,Phaser.Easing.Linear.None,true,0,0,false)
                .to({x : 1.0, y : 1.0},300,Phaser.Easing.Linear.None,true,0,0,false)
                .start();
        } else if (this.game.input.keyboard.justReleased(Phaser.Keyboard.SPACEBAR)){
            this.player.toggleJumping();
        }

        if (this.cursors.left.isDown)
        {
            this.player.angle -= 4;
        }
        else if (this.cursors.right.isDown)
        {
            this.player.angle += 4;
        }

        if (this.cursors.up.isDown)
        {
            //  The speed we'll travel at
            this.currentSpeed = 90;
        }

        else if (this.cursors.down.isDown){
            if(this.currentSpeed > -90)
                this.currentSpeed -= 10;
        }

        else
        {
            if (this.currentSpeed > 0)
            {
                this.currentSpeed -= 5;
            }

            else if (this.currentSpeed < 0) {
                this.currentSpeed += 5;
            }
        }

        if (this.currentSpeed != 0)
        {
            this.player.body.velocity = this.game.physics.arcade.velocityFromRotation(this.player.rotation, this.currentSpeed);
        }
    }

    private groundTileCollisionHandler(){

        if(!this.player.isJumping) {

            console.log("ground collision");

            this.game.time.events.add(1000,function(player){
                player.decreaseFuel();
            },this,this.player);

            this.game.time.events.start();

            if(this.player.isDead()){
                console.log("dead");

                var tween = this.game.add.tween(this.player.scale).to({x : 0, y : 0},800,Phaser.Easing.Linear.None,true,0,0,false);
                tween.onStart.add(this.continuallyRotate,this);
                tween.onComplete.add(this.playerOneDies,this);

            }

        }
    }

    private arenaTileCollisionHandler(){

        if(!this.player.isJumping){

            console.log("arena collision");
            this.game.time.events.stop();
            this.player.resetFuel();

        }
    }

    private playerOneDies(){

            this.player.kill();
            this.websocket.close();
            this.game.state.start("GameOver",true,false);
    }

    private continuallyRotate(){

        this.player.angle += 4;

    }




}



