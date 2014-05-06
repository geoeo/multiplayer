///<reference path='../libs/jquery.d.ts'/>
///<reference path='../libs/lib.d.ts'/>
///<reference path='../libs/phaser.d.ts'/>


export class Player extends Phaser.Sprite {

    constructor(public game : Phaser.Game,
                public x : number,
                public y : number,
                public name : string,
                public fuel : number,
                public isJumping : boolean,
                public shouldDie : boolean){
        // last arg is animation frame start - no animations at the moment
        super(game,x,y,name,0);

        console.log("Player.constructor");

        // rotation anchor
        this.anchor.setTo(0.5,0.5);
        game.physics.enable(this,Phaser.Physics.ARCADE);

        //setup physics
        this.body.collideWorldBounds = true;

        game.add.existing(this);

    }

    toggleJumping(){
        this.isJumping = !this.isJumping;
    }

    decreaseFuel(){
        console.log("Player - decrease fuel");

        if(this.fuel > 0)
            this.fuel--;
        else if(this.fuel === 0)
            this.shouldDie = true;

    }

    resetFuel(){
        console.log("Player - reset fuel");
        this.fuel = 3;
    }

    isDead() {
        return this.shouldDie;
    }



}
