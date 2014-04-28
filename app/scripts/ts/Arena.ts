///<reference path='../libs/jquery.d.ts'/>
///<reference path='../libs/lib.d.ts'/>
///<reference path='../libs/phaser.d.ts'/>

export class Arena extends Phaser.State {


    constructor(public map : Phaser.Tilemap ,
                public layer : Phaser.TilemapLayer,
                public layer2 : Phaser.TilemapLayer){
        super();
    }

    create() {

        console.log("arena.create");

        this.map = this.game.add.tilemap('map');
        // add tiles to the tileset
        this.map.addTilesetImage('level','tiles');

        //  Creates a layer from the World1 layer in the map data.
        //  A Layer is effectively like a Phaser.Sprite, so is added to the display list.
        this.layer = this.map.createLayer('Ground');
        this.layer2 = this.map.createLayer('Arena');

        //  This resizes the game world to match the layer dimensions
        this.layer.resizeWorld();
        this.layer2.resizeWorld();





    }

}



