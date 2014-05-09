var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define(["require", "exports", 'Player'], function(require, exports, Player) {
    var Arena = (function (_super) {
        __extends(Arena, _super);
        function Arena(map, groundLayer, arenaLayer, player, player2, cursors, currentSpeed, deathTimer, websocket, jump_sound, splash_sound, jump_tween, enemyObject) {
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
            this.jump_sound = jump_sound;
            this.splash_sound = splash_sound;
            this.jump_tween = jump_tween;
            this.enemyObject = enemyObject;
        }
        Arena.prototype.preload = function () {
            this.websocket = new WebSocket("ws://localhost:9000/testSocket");

            this.websocket.onopen = function (evt) {
                console.log("connection was opened");
            };
            this.websocket.onmessage = this.onMessage.bind(this);
            this.websocket.onclose = function () {
                console.log("connections was closed");
            };

            this.jump_sound = this.add.audio("jump_sound", 1.0, false);
            this.splash_sound = this.add.audio("splash_sound", 1.0, false);
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

            this.player = new Player.Player(this.game, this.game.world.centerX, this.game.world.centerY, "player1", 3, 150, 0, 600, false, false);
            this.player2 = new Player.Player(this.game, this.game.world.centerX + 50, this.game.world.centerY + 30, "player2", 3, 150, 0, 600, false, false);

            this.player.bringToTop();

            this.enemyObject = {
                "x": 0,
                "y": 0,
                "angle": 0,
                "isJumping": false
            };

            this.currentSpeed = 0;

            this.player.angle -= 90;

            this.cursors = this.game.input.keyboard.createCursorKeys();

            this.jump_tween = this.game.add.tween(this.player.scale);
        };

        Arena.prototype.update = function () {
            this.handleCollisions();
            this.handleOverlaps();

            this.handleUserInput();
            this.updateEnemy();
            this.sendPlayerData();
        };

        Arena.prototype.render = function () {
        };

        Arena.prototype.handleCollisions = function () {
            if (this.player.isJumping === this.player2.isJumping)
                this.game.physics.arcade.collide(this.player, this.player2);
        };

        Arena.prototype.handleOverlaps = function () {
            this.game.physics.arcade.overlap(this.player, this.groundLayer);
            this.game.physics.arcade.overlap(this.player, this.arenaLayer);
        };

        Arena.prototype.handleUserInput = function () {
            if (this.game.input.keyboard.justPressed(Phaser.Keyboard.SPACEBAR)) {
                console.log("jump");

                if (this.player.timeToJump()) {
                    this.player.setJumpingTo(true);

                    this.player.last_jump = this.game.time.now;

                    this.game.add.tween(this.player.scale).to({ x: 2.0, y: 2.0 }, this.player.jump_duration / 2, Phaser.Easing.Linear.None, true, 0, 1, true).start().onComplete.add(function () {
                        this.setJumpingTo(false);
                    }, this.player);

                    if (!this.jump_sound.isPlaying) {
                        this.jump_sound.play();
                    }
                }
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

        Arena.prototype.sendPlayerData = function () {
            if (this.websocket.readyState === 1)
                this.websocket.send(JSON.stringify({
                    "x": this.player.body.x,
                    "y": this.player.body.y,
                    "angle": this.player.angle,
                    "isJumping": this.player.isJumping }));
        };

        Arena.prototype.updateEnemy = function () {
            var x = this.enemyObject.x;
            var y = this.enemyObject.y;
            var angle = this.enemyObject.angle;
            var isJumping = this.enemyObject.isJumping;

            this.player2.body.velocity = new Phaser.Point(x, y);
            this.player2.angle = angle;

            if (isJumping && this.player2.timeToJump()) {
                this.player2.setJumpingTo(true);
                this.player2.last_jump = this.game.time.now;
                this.game.add.tween(this.player2.scale).to({ x: 2.0, y: 2.0 }, this.player2.jump_duration / 2, Phaser.Easing.Linear.None, true, 0, 1, true).start();
            }

            this.player2.setJumpingTo(false);
        };

        Arena.prototype.groundTileCollisionHandler = function () {
            if (!this.player.isJumping) {
                if (!this.game.time.events.running) {
                    this.game.time.events.repeat(1000, 3, function (player) {
                        player.decreaseFuel();
                    }, this, this.player);

                    this.game.time.events.start();
                }

                if (this.player.isDead()) {
                    if (!this.splash_sound.isPlaying)
                        this.splash_sound.play();
                    this.playerOneDies();
                }
            }
        };

        Arena.prototype.arenaTileCollisionHandler = function () {
            if (!this.player.isJumping) {
                this.game.time.events.stop();
                this.player.resetFuel();
            }
        };

        Arena.prototype.playerOneDies = function () {
            var tween = this.game.add.tween(this.player.scale).to({ x: 0, y: 0 }, 800, Phaser.Easing.Linear.None, true, 0, 0, false);
            tween.onStart.add(this.continuallyRotatePlayerOne, this);
            tween.onComplete.add(this.shutDownGameWithLoss, this);
        };

        Arena.prototype.playerTwoDies = function () {
            var tween = this.game.add.tween(this.player2.scale).to({ x: 0, y: 0 }, 800, Phaser.Easing.Linear.None, true, 0, 0, false);
            tween.onStart.add(this.continuallyRotatePlayerTwo, this);
            tween.onComplete.add(this.shutDownGameWithWin, this);
        };

        Arena.prototype.cleanUp = function () {
            this.player.kill();
            this.player2.kill();
            this.websocket.close();
        };

        Arena.prototype.shutDownGameWithLoss = function () {
            this.cleanUp();
            this.game.state.start("GameOverL", true, false);
        };

        Arena.prototype.shutDownGameWithWin = function () {
            this.cleanUp();
            this.game.state.start("GameOverW", true, false);
        };

        Arena.prototype.continuallyRotatePlayerOne = function () {
            this.player.angle += 4;
        };

        Arena.prototype.continuallyRotatePlayerTwo = function () {
            this.player2.angle += 4;
        };

        Arena.prototype.onMessage = function (message) {
            this.enemyObject = $.parseJSON(message.data);
        };
        return Arena;
    })(Phaser.State);
    exports.Arena = Arena;
});
