///<reference path='../libs/jquery.d.ts'/>
///<reference path='../libs/lib.d.ts'/>
///<reference path='../libs/phaser.d.ts'/>


export class Game extends Phaser.Game{

    constructor(){

        super(800,600,Phaser.AUTO,'content',null);

    }
}

$('document').ready(function(){
    // start
    console.log("start game");
    new Game();
});


