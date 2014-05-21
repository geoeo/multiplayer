///<reference path='../libs/jquery.d.ts'/>
///<reference path='../libs/lib.d.ts'/>
///<reference path='../libs/phaser.d.ts'/>


import Boot = require('Boot');
import Preloader = require('Preloader');
import Arena = require('Arena');
import GameOverL = require('GameOverL');
import GameOverW = require('GameOverW');


export class Game extends Phaser.Game{

    constructor(){

        super(960,960,Phaser.AUTO,'content',null);

        this.state.add('Boot',Boot.Boot,false);
        this.state.add('Preloader',Preloader.Preloader,false);
        this.state.add('Arena',Arena.Arena,false);
        this.state.add('GameOverL',GameOverL.GameOverL,false);
        this.state.add('GameOverW',GameOverW.GameOverW,false);

        this.state.start('Boot');

    }
}

//TODO trigger game on server signal
$('document').ready(function(){
    console.log("start game");
    new Game();
});



