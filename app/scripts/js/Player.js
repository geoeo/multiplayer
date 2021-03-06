var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define(["require", "exports"], function(require, exports) {
    var Player = (function (_super) {
        __extends(Player, _super);
        function Player(game, x, y, name, fuel, max_fuel_width, last_jump, jump_duration, isJumping, shouldDie) {
            _super.call(this, game, x, y, name, 0);
            this.game = game;
            this.x = x;
            this.y = y;
            this.name = name;
            this.fuel = fuel;
            this.max_fuel_width = max_fuel_width;
            this.last_jump = last_jump;
            this.jump_duration = jump_duration;
            this.isJumping = isJumping;
            this.shouldDie = shouldDie;

            console.log("Player.constructor");

            this.anchor.setTo(0.5, 0.5);
            game.physics.enable(this, Phaser.Physics.ARCADE);

            this.body.collideWorldBounds = true;

            game.add.existing(this);
        }
        Player.prototype.setJumpingTo = function (jumping) {
            this.isJumping = jumping;
        };

        Player.prototype.timeToJump = function () {
            var now = this.game.time.now;

            return this.last_jump + this.jump_duration < now;
        };

        Player.prototype.decreaseFuel = function () {
            console.log("Player - decrease fuel");

            var decrease_fuel_by = this.max_fuel_width / 3;
            var new_width = $("#player_fuel_image").width() - decrease_fuel_by;

            $('#player_fuel_image').css("width", new_width);

            if (this.fuel > 0) {
                this.fuel--;

                if (this.fuel === 0)
                    this.shouldDie = true;
            }
        };

        Player.prototype.resetFuel = function () {
            $("#player_fuel_image").css("width", this.max_fuel_width);
            this.fuel = 3;
        };

        Player.prototype.isDead = function () {
            return this.shouldDie;
        };
        return Player;
    })(Phaser.Sprite);
    exports.Player = Player;
});
