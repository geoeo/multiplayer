var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define(["require", "exports"], function(require, exports) {
    var GameOverW = (function (_super) {
        __extends(GameOverW, _super);
        function GameOverW(game_over_sound) {
            _super.call(this);
            this.game_over_sound = game_over_sound;
        }
        GameOverW.prototype.preload = function () {
            this.game_over_sound = this.add.audio("game_over_sound", 1.0, false);
        };

        GameOverW.prototype.create = function () {
            this.game_over_sound.play();
            alert("GameOver - You Win");
        };
        return GameOverW;
    })(Phaser.State);
    exports.GameOverW = GameOverW;
});
