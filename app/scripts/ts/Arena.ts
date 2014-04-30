///<reference path='../libs/jquery.d.ts'/>
///<reference path='../libs/lib.d.ts'/>
///<reference path='../libs/phaser.d.ts'/>

import Player = require('Player');

export class Arena extends Phaser.State {

    // global vars
    constructor(public map : Phaser.Tilemap ,
                public layer : Phaser.TilemapLayer,
                public layer2 : Phaser.TilemapLayer,
                public player : Phaser.Sprite,
                public player2 : Phaser.Sprite,
                public cursors : Phaser.CursorKeys,
                public currentSpeed : number){
        super();
    }

    create() {

        console.log("arena.create");

        this.map = this.game.add.tilemap('map');
        // add tiles to the tileset
        // @arg1 : name of tileset in .json , @arg2 tileset key in phaser
        this.map.addTilesetImage('tileset','tiles');

        //  Creates a layer from the World1 layer in the map data.
        //  A Layer is effectively like a Phaser.Sprite, so is added to the display list.
        this.layer = this.map.createLayer('Ground');
        this.layer2 = this.map.createLayer('Arena');

        //  This resizes the game world to match the layer dimensions
        this.layer.resizeWorld();
        this.layer2.resizeWorld();

        this.game.physics.startSystem(Phaser.Physics.ARCADE);


        this.player = new Player.Player(this.game,this.game.world.centerX,this.game.world.centerY,"player1");
        this.player2 = new Player.Player(this.game,this.game.world.centerX+50,this.game.world.centerY+30,"player2");

        this.cursors = this.game.input.keyboard.createCursorKeys();

        this.currentSpeed = 0;

        // rotate so that key controls match up
        this.player.angle -= 90;

    }

    update(){

        //  Collide the player with the platforms
        this.game.physics.arcade.collide(this.player, this.player2);

        this.handleUserInput();
    }

    private handleUserInput(){

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


}



