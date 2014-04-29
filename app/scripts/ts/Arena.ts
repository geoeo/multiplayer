///<reference path='../libs/jquery.d.ts'/>
///<reference path='../libs/lib.d.ts'/>
///<reference path='../libs/phaser.d.ts'/>

import Player = require('Player');

export class Arena extends Phaser.State {

    // global vars
    constructor(public map : Phaser.Tilemap ,
                public layer : Phaser.TilemapLayer,
                public layer2 : Phaser.TilemapLayer,
                public player : Phaser.Sprite){
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

        this.player = new Player.Player(this.game,this.game.world.centerX,this.game.world.centerY);

    }

    update(){

        this.handleUserInput();

    }

    private handleUserInput() {
        if (this.game.input.keyboard.isDown(Phaser.Keyboard.LEFT)) {
            console.log("left key press");

            this.player.body.velocity.x = -150;
        }

        else if (this.game.input.keyboard.isDown(Phaser.Keyboard.RIGHT)) {

            console.log("right key press");

            this.player.body.velocity.x = 150;

        }
        else {
            this.player.body.velocity.x = 0;
        }

    }


}



