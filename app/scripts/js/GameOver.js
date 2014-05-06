var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define(["require", "exports"], function(require, exports) {
    var GameOver = (function (_super) {
        __extends(GameOver, _super);
        function GameOver(game_over_sound) {
            _super.call(this);
            this.game_over_sound = game_over_sound;
        }
        GameOver.prototype.preload = function () {
            this.game_over_sound = this.add.audio("game_over_sound", 1.0, false);
        };

        GameOver.prototype.create = function () {
            this.game_over_sound.play();
            alert("GameOver");
        };
        return GameOver;
    })(Phaser.State);
    exports.GameOver = GameOver;
});
