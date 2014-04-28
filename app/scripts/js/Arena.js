var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define(["require", "exports"], function(require, exports) {
    var Arena = (function (_super) {
        __extends(Arena, _super);
        function Arena(map, layer, layer2) {
            _super.call(this);
            this.map = map;
            this.layer = layer;
            this.layer2 = layer2;
        }
        Arena.prototype.create = function () {
            console.log("arena.create");

            this.map = this.game.add.tilemap('map');

            this.map.addTilesetImage('level', 'tiles');

            this.layer = this.map.createLayer('Ground');
            this.layer2 = this.map.createLayer('Arena');

            this.layer.resizeWorld();
            this.layer2.resizeWorld();
        };
        return Arena;
    })(Phaser.State);
    exports.Arena = Arena;
});
