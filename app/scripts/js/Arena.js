var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define(["require", "exports", 'Player'], function(require, exports, Player) {
    var Arena = (function (_super) {
        __extends(Arena, _super);
        function Arena(map, groundLayer, arenaLayer, player, player2, cursors, currentSpeed, deathTimer, websocket) {
            _super.call(this);
            this.map = map;
            this.groundLayer = groundLayer;
            this.arenaLayer = arenaLayer;
            this.player = player;
            this.player2 = player2;
            this.cursors = cursors;
            this.currentSpeed = currentSpeed;
            this.deathTimer = deathTimer;
            this.websocket = websocket;
        }
        Arena.prototype.preload = function () {
            this.websocket = new WebSocket("ws://localhost:9000/testSocket");

            this.websocket.onopen = function (evt) {
                console.log(evt.data);
            };

            this.websocket.onclose = function () {
                console.log("connections was closed");
            };
        };

        Arena.prototype.create = function () {
            console.log("arena.create");

            this.deathTimer = new Phaser.Timer(this.game, false);

            this.map = this.game.add.tilemap('map');

            this.map.addTilesetImage('tileset', 'tiles');

            this.groundLayer = this.map.createLayer('Ground');
            this.arenaLayer = this.map.createLayer('Arena');

            this.groundLayer.resizeWorld();
            this.arenaLayer.resizeWorld();

            var groundTiles = this.groundLayer.getTiles(0, 0, this.game.world.width, this.game.world.height);

            for (var i = 0; i < groundTiles.length; i++) {
                groundTiles[i].setCollisionCallback(this.groundTileCollisionHandler, this);
            }
            var arenaTiles = this.arenaLayer.getTiles(0, 0, this.game.world.width, this.game.world.height);

            for (var i = 0; i < arenaTiles.length; i++) {
                arenaTiles[i].setCollisionCallback(this.arenaTileCollisionHandler, this);
            }

            this.game.physics.startSystem(Phaser.Physics.ARCADE);

            this.player = new Player.Player(this.game, this.game.world.centerX, this.game.world.centerY, "player1", 3, false, false);
            this.player2 = new Player.Player(this.game, this.game.world.centerX + 50, this.game.world.centerY + 30, "player2", 3, false, false);

            this.cursors = this.game.input.keyboard.createCursorKeys();

            this.currentSpeed = 0;

            this.player.angle -= 90;

            if (this.websocket.readyState === 1)
                this.websocket.send("multiplayer - ready to receive player positions");
        };

        Arena.prototype.update = function () {
            if (this.websocket.readyState === 1)
                this.websocket.send("multiplayer - update");

            this.game.physics.arcade.collide(this.player, this.player2);
            this.game.physics.arcade.overlap(this.player, this.groundLayer);
            this.game.physics.arcade.overlap(this.player, this.arenaLayer);

            this.handleUserInput();
        };

        Arena.prototype.handleUserInput = function () {
            if (this.game.input.keyboard.justPressed(Phaser.Keyboard.SPACEBAR)) {
                this.player.toggleJumping();

                this.game.add.tween(this.player.scale).to({ x: 2.0, y: 2.0 }, 300, Phaser.Easing.Linear.None, true, 0, 0, false).to({ x: 1.0, y: 1.0 }, 300, Phaser.Easing.Linear.None, true, 0, 0, false).start();
            } else if (this.game.input.keyboard.justReleased(Phaser.Keyboard.SPACEBAR)) {
                this.player.toggleJumping();
            }

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

        Arena.prototype.groundTileCollisionHandler = function () {
            if (!this.player.isJumping) {
                console.log("ground collision");

                this.game.time.events.add(1000, function (player) {
                    player.decreaseFuel();
                }, this, this.player);

                this.game.time.events.start();

                if (this.player.isDead()) {
                    console.log("dead");

                    var tween = this.game.add.tween(this.player.scale).to({ x: 0, y: 0 }, 800, Phaser.Easing.Linear.None, true, 0, 0, false);
                    tween.onStart.add(this.continuallyRotate, this);
                    tween.onComplete.add(this.playerOneDies, this);
                }
            }
        };

        Arena.prototype.arenaTileCollisionHandler = function () {
            if (!this.player.isJumping) {
                console.log("arena collision");
                this.game.time.events.stop();
                this.player.resetFuel();
            }
        };

        Arena.prototype.playerOneDies = function () {
            this.player.kill();
            this.websocket.close();
            this.game.state.start("GameOver", true, false);
        };

        Arena.prototype.continuallyRotate = function () {
            this.player.angle += 4;
        };
        return Arena;
    })(Phaser.State);
    exports.Arena = Arena;
});
