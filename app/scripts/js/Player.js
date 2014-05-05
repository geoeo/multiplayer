var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define(["require", "exports"], function(require, exports) {
    var Player = (function (_super) {
        __extends(Player, _super);
        function Player(game, x, y, name, isJumping) {
            _super.call(this, game, x, y, name, 0);
            this.game = game;
            this.x = x;
            this.y = y;
            this.name = name;
            this.isJumping = isJumping;

            console.log("Player.constructor");

            this.anchor.setTo(0.5, 0.5);
            game.physics.enable(this, Phaser.Physics.ARCADE);

            this.body.collideWorldBounds = true;

            game.add.existing(this);
        }
        Player.prototype.toggleJumping = function () {
            this.isJumping = !this.isJumping;
        };
        return Player;
    })(Phaser.Sprite);
    exports.Player = Player;
});
