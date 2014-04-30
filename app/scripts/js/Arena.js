var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define(["require", "exports", 'Player'], function(require, exports, Player) {
    var Arena = (function (_super) {
        __extends(Arena, _super);
        function Arena(map, layer, layer2, player, player2, cursors, currentSpeed) {
            _super.call(this);
            this.map = map;
            this.layer = layer;
            this.layer2 = layer2;
            this.player = player;
            this.player2 = player2;
            this.cursors = cursors;
            this.currentSpeed = currentSpeed;
        }
        Arena.prototype.create = function () {
            console.log("arena.create");

            this.map = this.game.add.tilemap('map');

            this.map.addTilesetImage('tileset', 'tiles');

            this.layer = this.map.createLayer('Ground');
            this.layer2 = this.map.createLayer('Arena');

            this.layer.resizeWorld();
            this.layer2.resizeWorld();

            this.game.physics.startSystem(Phaser.Physics.ARCADE);

            this.player = new Player.Player(this.game, this.game.world.centerX, this.game.world.centerY, "player1");
            this.player2 = new Player.Player(this.game, this.game.world.centerX + 50, this.game.world.centerY + 30, "player2");

            this.cursors = this.game.input.keyboard.createCursorKeys();

            this.currentSpeed = 0;

            this.player.angle -= 90;
        };

        Arena.prototype.update = function () {
            this.game.physics.arcade.collide(this.player, this.player2);

            this.handleUserInput();
        };

        Arena.prototype.handleUserInput = function () {
            if (this.cursors.left.isDown) {
                this.player.angle -= 4;
            } else if (this.cursors.right.isDown) {
                this.player.angle += 4;
            }

            if (this.cursors.up.isDown) {
                this.currentSpeed = 90;
            } else if (this.cursors.down.isDown) {
                if (this.currentSpeed > -90)
                    this.currentSpeed -= 10;
            } else {
                if (this.currentSpeed > 0) {
                    this.currentSpeed -= 5;
                } else if (this.currentSpeed < 0) {
                    this.currentSpeed += 5;
                }
            }

            if (this.currentSpeed != 0) {
                this.player.body.velocity = this.game.physics.arcade.velocityFromRotation(this.player.rotation, this.currentSpeed);
            }
        };
        return Arena;
    })(Phaser.State);
    exports.Arena = Arena;
});
