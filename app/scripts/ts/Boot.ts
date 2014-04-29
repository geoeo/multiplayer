///<reference path='../libs/jquery.d.ts'/>
///<reference path='../libs/lib.d.ts'/>
///<reference path='../libs/phaser.d.ts'/>


export class Boot extends Phaser.State {

    preload() {

        this.load.image("preloadBar","/assets/images/loader.png");
        console.log("Boot.preload");

    }

    create() {

        console.log("Boot.create");

        // Only use > 1 for multitouch
        this.input.maxPointers = 1;

        //  Phaser will automatically pause if the browser tab the game is in loses focus. You can disable that here:
        this.stage.disableVisibilityChange = true;

        if(this.game.device.desktop){
            this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
            this.scale.pageAlignHorizontally = true;
            this.scale.pageAlignVertically = true;
//            this.scale.scaleMode = Phaser.ScaleManager.EXACT_FIT;
            // force a screen resize
            this.scale.setScreenSize(true);

        }
        else {
            // mobile setup here
            //  In this case we're saying "scale the game, no lower than 480x260 and no higher than 1024x768"
            this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
            this.scale.minWidth = 480;
            this.scale.minHeight = 260;
            this.scale.maxWidth = 1024;
            this.scale.maxHeight = 768;
            this.scale.forceLandscape = true;
            this.scale.pageAlignHorizontally = true;
            this.scale.setScreenSize(true);
        }

        // clear world true, clear cache no. (Would make loaded assets useless)
        this.game.state.start("Preloader",true,false);

    }

}
