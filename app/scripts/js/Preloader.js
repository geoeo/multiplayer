var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define(["require", "exports"], function(require, exports) {
    var Preloader = (function (_super) {
        __extends(Preloader, _super);
        function Preloader(preloadBar) {
            _super.call(this);
            this.preloadBar = preloadBar;
        }
        Preloader.prototype.preload = function () {
            console.log("Preloader.preload");
            this.preloadBar = this.add.sprite(this.game.world.centerX - 170, this.game.world.centerY, "preloadBar");
            this.load.setPreloadSprite(this.preloadBar);

            this.load.image("player1", "/assets/images/player1.png", false);
            this.load.image("player2", "/assets/images/player2.png", false);

            this.game.load.tilemap('map', 'assets/moba.json', null, Phaser.Tilemap.TILED_JSON);

            this.game.load.image('tiles', 'assets/tileset.png');
        };

        Preloader.prototype.create = function () {
            console.log("Preloader.ts - create");

            var tween = this.add.tween(this.preloadBar).to({ alpha: 0 }, 1000, Phaser.Easing.Linear.None, true);
            tween.onComplete.add(this.startMainMenu, this);
        };

        Preloader.prototype.startMainMenu = function () {
            console.log("switching to Arena");

            this.game.state.start("Arena", true, false);
        };
        return Preloader;
    })(Phaser.State);
    exports.Preloader = Preloader;
});
