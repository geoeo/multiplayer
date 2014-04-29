var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define(["require", "exports", 'Player'], function(require, exports, Player) {
    var Arena = (function (_super) {
        __extends(Arena, _super);
        function Arena(map, layer, layer2, player) {
            _super.call(this);
            this.map = map;
            this.layer = layer;
            this.layer2 = layer2;
            this.player = player;
        }
        Arena.prototype.create = function () {
            console.log("arena.create");

            this.map = this.game.add.tilemap('map');

            this.map.addTilesetImage('tileset', 'tiles');

            this.layer = this.map.createLayer('Ground');
            this.layer2 = this.map.createLayer('Arena');

            this.layer.resizeWorld();
            this.layer2.resizeWorld();

            this.player = new Player.Player(this.game, this.game.world.centerX, this.game.world.centerY);
        };

        Arena.prototype.update = function () {
            this.handleUserInput();
        };

        Arena.prototype.handleUserInput = function () {
            if (this.game.input.keyboard.isDown(Phaser.Keyboard.LEFT)) {
                console.log("left key press");

                this.player.body.velocity.x = -150;
            } else if (this.game.input.keyboard.isDown(Phaser.Keyboard.RIGHT)) {
                console.log("right key press");

                this.player.body.velocity.x = 150;
            } else {
                this.player.body.velocity.x = 0;
            }
        };
        return Arena;
    })(Phaser.State);
    exports.Arena = Arena;
});
