var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define(["require", "exports"], function(require, exports) {
    var GameOverL = (function (_super) {
        __extends(GameOverL, _super);
        function GameOverL(game_over_sound) {
            _super.call(this);
            this.game_over_sound = game_over_sound;
        }
        GameOverL.prototype.preload = function () {
            this.game_over_sound = this.add.audio("game_over_sound", 1.0, false);
        };

        GameOverL.prototype.create = function () {
            this.game_over_sound.play();
            alert("GameOver - You Lost");
        };
        return GameOverL;
    })(Phaser.State);
    exports.GameOverL = GameOverL;
});
