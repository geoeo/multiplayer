///<reference path='../libs/jquery.d.ts'/>
///<reference path='../libs/lib.d.ts'/>
///<reference path='../libs/phaser.d.ts'/>

export class GameOverL extends Phaser.State {

    constructor(public game_over_sound : Phaser.Sound){
        super();
    }

    preload(){
        this.game_over_sound = this.add.audio("game_over_sound",1.0,false);
    }

    create(){
        this.game_over_sound.play();
        alert("GameOver - You Lost");
    }
}
