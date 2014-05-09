///<reference path='../libs/jquery.d.ts'/>
///<reference path='../libs/lib.d.ts'/>
///<reference path='../libs/phaser.d.ts'/>


export class Player extends Phaser.Sprite {

    constructor(public game : Phaser.Game,
                public x : number,
                public y : number,
                public name : string,
                public fuel : number,
                public max_fuel_width : number, /* css3 width of fuel image */
                public last_jump : number,
                public jump_duration : number,
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

    setJumpingTo(jumping){
        this.isJumping = jumping;
    }

    timeToJump(){
        var now : number = this.game.time.now;

        return this.last_jump + this.jump_duration < now;
    }

    decreaseFuel(){
        console.log("Player - decrease fuel");

        var decrease_fuel_by : number = this.max_fuel_width/3;
        var new_width = $("#player_fuel_image").width() - decrease_fuel_by;

        $('#player_fuel_image').css("width" , new_width);

        if(this.fuel > 0){

            this.fuel--;

            if(this.fuel === 0)
                this.shouldDie = true;
        }

    }

    resetFuel(){
        $("#player_fuel_image").css("width" , this.max_fuel_width);
        this.fuel = 3;
    }

    isDead() {
        return this.shouldDie;
    }



}
