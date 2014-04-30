///<reference path='../libs/jquery.d.ts'/>
///<reference path='../libs/lib.d.ts'/>
///<reference path='../libs/phaser.d.ts'/>


export class Player extends Phaser.Sprite {

    constructor(public game : Phaser.Game, public x : number, public y : number, public name : string){
        // last arg is animation frame start - no animations at the moment
        super(game,x,y,name,0);

        console.log("Player.constructor");

        // rotation anchor
        this.anchor.setTo(0.5,0.5);
        game.physics.enable(this,Phaser.Physics.ARCADE);

        //setup physics
//        this.body.gravity.y = 6;
        this.body.collideWorldBounds = true;

        game.add.existing(this);


    }



}
