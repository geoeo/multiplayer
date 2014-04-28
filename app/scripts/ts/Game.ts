///<reference path='../libs/jquery.d.ts'/>
///<reference path='../libs/lib.d.ts'/>
///<reference path='../libs/phaser.d.ts'/>


import Boot = require('Boot');
import Preloader = require('Preloader');
import Arena = require('Arena');


export class Game extends Phaser.Game{

    constructor(){

        super(960,960,Phaser.AUTO,'content',null);

        this.state.add('Boot',Boot.Boot,false);
        this.state.add('Preloader',Preloader.Preloader,false);
        this.state.add('Arena',Arena.Arena,false);


        this.state.start('Boot');

    }
}

$('document').ready(function(){
    // start
    console.log("start game");
    new Game();
});


