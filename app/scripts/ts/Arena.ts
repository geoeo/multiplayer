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
                public websocket,
                public jump_sound : Phaser.Sound,
                public splash_sound : Phaser.Sound,
                public jump_tween : Phaser.Tween,
                public enemyObject : any,
                private game_id : number){
        super();
    }

    //TODO integration test with server and multiple clients
    private createWebSocket(url,isLobby){

        this.websocket = new WebSocket(url);

        this.websocket.onopen = function() {
            console.log("connection was opened");
        };
        if(isLobby){
            console.log("lobby");
            this.websocket.onmessage = this.onLobbyMessage.bind(this);
        } else {
            console.log("arena");
            this.websocket.onmessage = this.onDataMessage.bind(this);
        }

        this.websocket.onclose = function() {
            console.log("connections was closed");
        };

    }

    private onDataMessage(message){

        var data = $.parseJSON(message.data);
        console.log(data.body);
        if(data.header === "error"){
            console.log("error");
        } else {
            this.enemyObject = data.body;
        }

    }

    private onLobbyMessage(message){

        var data = $.parseJSON(message.data);
        console.log("Game is Ready: " + message.data);

        if(data.body){
            console.log("switch socket");
            this.game_id = data.game_id;
            console.log("game_id: "+ this.game_id);
            this.createWebSocket.apply(this,["ws://localhost:9000/dataSocket",false]);
        }

    }

    preload() {

        // TODO investigate physics failure when websocket server is offline
        // TODO upgrade play framework to add wss support
        this.createWebSocket.apply(this,["ws://localhost:9000/lobbySocket",true]);


        this.jump_sound = this.add.audio("jump_sound",1.0,false);
        this.splash_sound = this.add.audio("splash_sound",1.0,false);

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

        this.player = new Player.Player(this.game,this.game.world.centerX,this.game.world.centerY,"player1",3,150,0,600,false,false);
        this.player2 = new Player.Player(this.game,this.game.world.centerX+50,this.game.world.centerY+30,"player2",3,150,0,600,false,false);

        // Set player's sprite to be rendered on top of player2's sprite
        this.player.bringToTop();

        this.enemyObject =
            {
                "x" : 0,
                "y" : 0,
                "angle" : 0,
                "isJumping" : false,
                "shouldDie" : false

            };

        this.currentSpeed = 0;

        // rotate so that key controls match up
        this.player.angle -= 90;

        // CONTROLL STUFF //

        this.cursors = this.game.input.keyboard.createCursorKeys();

        // ANIMATION STUFF ///

        this.jump_tween = this.game.add.tween(this.player.scale);

    }

    update(){

        this.updateEnemy();

        //  Collide the player with the platforms
        this.handleCollisions();
        this.handleOverlaps();

        this.handleUserInput();
        this.sendPlayerData();
    }

    render() {


//        this.game.debug.bodyInfo(this.player, 16, 24);
//
//
//        this.game.debug.body(this.player);
//        this.game.debug.body(this.player2);
    }

    ///////////// UTILITY METHODS /////////////////////

    private handleCollisions() {
        if (this.player.isJumping === this.player2.isJumping)
            this.game.physics.arcade.collide(this.player, this.player2);
    }

    private handleOverlaps() {

        this.game.physics.arcade.overlap(this.player, this.groundLayer);
        this.game.physics.arcade.overlap(this.player, this.arenaLayer);

    }

    // TODO possible error in player state transfer since state is only transfered at the end of the
    // TODO update loop. Thus, jumping state may be outdated.
    private handleUserInput(){

        if(this.game.input.keyboard.justPressed(Phaser.Keyboard.SPACEBAR)){
            console.log("jump");

            if(this.player.timeToJump()){

                this.player.setJumpingTo(true);
                this.player.last_jump = this.game.time.now;

                //TODO tween size on cont. jump still buggy
                this.game.add.tween(this.player.scale)
                    .to({x : 2.0, y : 2.0},this.player.jump_duration/2,Phaser.Easing.Linear.None,true,0,1,true)
                    .start().onComplete.add(function(){
                        this.setJumpingTo(false);
                    },this.player);

                if(!this.jump_sound.isPlaying){
                    this.jump_sound.play();
                }
            }

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

    private sendPlayerData(){
        if(this.websocket.readyState === 1){
            this.websocket.send(JSON.stringify({ "header"    : "player",
                                                 "game_id"   : this.game_id,
                                                 "body"      : {

                                                     "x"         : this.player.body.x ,
                                                     "y"         : this.player.body.y ,
                                                     "angle"     : this.player.angle,
                                                     "isJumping" : this.player.isJumping,
                                                     "shouldDie" : this.player.isDead()

                                                 }
                                                }));
        }
    }


    // read out the most recent data stored in the enemy json object
    private updateEnemy(){

        var x : any = this.enemyObject.x;
        var y : any = this.enemyObject.y;
        var angle : any = this.enemyObject.angle;
        var isJumping : any = this.enemyObject.isJumping;
        var shouldDie : any = this.enemyObject.shouldDie;

        this.player2.body.velocity = new Phaser.Point(x,y);
        this.player2.angle = angle;
        this.player2.shouldDie = shouldDie;

        if(isJumping && this.player2.timeToJump()){
            this.player2.setJumpingTo(true);
            this.player2.last_jump = this.game.time.now;
            this.game.add.tween(this.player2.scale)
                .to({x : 2.0, y : 2.0},this.player2.jump_duration/2,Phaser.Easing.Linear.None,true,0,1,true)
                .start().onComplete.add(function(){
                    this.setJumpingTo(false);
                },this.player2);
        }

        if(this.player2.isDead()){
            this.playerTwoDies();
        }

    }

    private groundTileCollisionHandler(){

        if(!this.player.isJumping) {

            if(!this.game.time.events.running){

                this.game.time.events.repeat(1000,3,
                    function(player){
                        player.decreaseFuel();
                    },
                this,this.player);

                this.game.time.events.start();
            }

            if(this.player.isDead()){
                if(!this.splash_sound.isPlaying)
                    this.splash_sound.play();
                this.playerOneDies();
            }

        }
    }

    private arenaTileCollisionHandler(){

        if(!this.player.isJumping){

            // stops timer evens and clears timer list
            this.game.time.events.stop();
            this.player.resetFuel();

        }
    }

    // TODO Refactor player death

    private playerOneDies(){

        var tween = this.game.add.tween(this.player.scale)
            .to({x : 0, y : 0},800,Phaser.Easing.Linear.None,true,0,0,false);
        tween.onStart.add(this.continuallyRotatePlayerOne,this);
        tween.onComplete.add(this.shutDownGameWithLoss,this);
    }

    private playerTwoDies(){
        var tween = this.game.add.tween(this.player2.scale)
            .to({x : 0, y : 0},800,Phaser.Easing.Linear.None,true,0,0,false);
        tween.onStart.add(this.continuallyRotatePlayerTwo,this);
        tween.onComplete.add(this.shutDownGameWithWin,this);
    }

    private cleanUp(){
        this.player.kill();
        this.player2.kill();
        this.websocket.close();
    }

    private shutDownGameWithLoss() {
        this.cleanUp();
        this.game.state.start("GameOverL",true,false);
    }

    private shutDownGameWithWin() {
        this.cleanUp();
        this.game.state.start("GameOverW",true,false);
    }

    private continuallyRotatePlayerOne(){
        this.player.angle += 4;
    }

    private continuallyRotatePlayerTwo(){
        this.player2.angle += 4;
    }

}



