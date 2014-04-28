///<reference path='../libs/jquery.d.ts'/>
///<reference path='../libs/lib.d.ts'/>
///<reference path='../libs/phaser.d.ts'/>

export class Preloader extends Phaser.State {

    constructor(public  preloadBar : Phaser.Sprite){
        super();
    }

    preload() {
        // loaded it into cache during Boot.ts execution
        console.log("Preloader.preload");
        this.preloadBar = this.add.sprite(200,250,"preloadBar");
        this.load.setPreloadSprite(this.preloadBar);

        // load game assets
        this.load.image("player1","/assets/images/player1.png",false);
        this.load.image("player2","/assets/images/player2.png",false);
        // Load the 'map.json' file using the TILDED_JSON special flag
        this.game.load.tilemap('map', 'assets/moba.json', null, Phaser.Tilemap.TILED_JSON);
        // Load the tileset
        this.game.load.image('tiles', 'assets/tileset.png');

    }

    create() {

        console.log("Preloader.ts - create");

        var tween = this.add.tween(this.preloadBar).to({ alpha: 0 }, 1000, Phaser.Easing.Linear.None, true);
        tween.onComplete.add(this.startMainMenu,this);
    }

    startMainMenu(){
        console.log("switching to Arena");

        this.game.state.start("Arena",true,false);

    }



}
