
// create a new scene
let gameScene = new Phaser.Scene('Game');

// initiate scene parameters
gameScene.init = function() {
  // player speed
  window.state = "idle"
  this.playerSpeed = 3;
  window.lastState = "idle"
};

// load assets
gameScene.preload = function(){
  // load images
  this.load.image('background', 'assets/background.png');
  this.load.spritesheet("ship", "assets/spritesheets/total.png",{
    frameWidth: 16,
    frameHeight: 16
  });
  this.load.image("bubble","assets/spritesheets/bubble.png")
  this.load.image("player","assets/player.png")
  this.load.image("street","assets/maps/tiles/street.png")
  this.load.image("city_carolina","assets/tiles/city_carolina.png")
  this.load.image("city_generic","assets/tiles/city_generic.png")
  this.load.image("special32","assets/maps/tiles/special32.png")
  this.load.tilemapTiledJSON("map","assets/maps/map.json")
  this.load.atlas("atlas", "/assets/atlas/atlas.png", "/assets/atlas/atlas.json");
 

};

// called once after the preload ends
gameScene.create = function() {

  const map = this.make.tilemap({ key: "map" });
  const tileset1 = map.addTilesetImage("street", "street");
  const tileset2 = map.addTilesetImage("special32", "special32");
  const tileset3 = map.addTilesetImage("city_carolina", "city_carolina");
  const tileset4 = map.addTilesetImage("city_generic", "city_generic");
  const belowLayer = map.createStaticLayer("groundLayer", tileset1, 0, 0);
  const midLayer = map.createStaticLayer("groundLayer1", tileset1, 0, 0);
  const aboveLayer = map.createStaticLayer("groundLayer2", tileset1, 0, 0);
  // const aboveLayer2 = map.createStaticLayer("groundLayer2", tileset2, 0, 0);
  const groundLayerH = map.createStaticLayer("houseLayer", tileset3, 0, 0);
  const groundLayerS = map.createStaticLayer("shopLayer", tileset4, 0, 0);
  const playerLayer = map.createStaticLayer("collissionLayer", tileset2, 0, 0);
  const playerLayer1 = map.createStaticLayer("aboveLayer", tileset2, 0, 0);
  
  playerLayer.setCollisionByProperty({ "collides": true });
  aboveLayer.setCollisionByProperty({ "collides": true });
  groundLayerH.setCollisionByProperty({ "collides": true });
  groundLayerS.setCollisionByProperty({"collides":true});

  playerLayer1.setDepth(10);
  const spawnPoint = map.findObject("Objects", obj => obj.name === "Spawn Point");
  console.log(spawnPoint.x,spawnPoint.y)
  player = this.physics.add
    .sprite(spawnPoint.x, spawnPoint.y, "atlas", "misa-front")
    .setSize(30, 40)
    .setScale(0.5)
    .setOffset(0, 24);
  this.physics.add.collider(player, playerLayer);
  this.physics.add.collider(player, aboveLayer);
  this.physics.add.collider(player, groundLayerH);
  this.physics.add.collider(player, groundLayerS);
  const camera = this.cameras.main;
  camera.startFollow(player);
  camera.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
  cursors = this.input.keyboard.createCursorKeys();
  // this.map.setBounds(map.widthInPixels, map.heightInPixels);

  // const worldLayer = map.createStaticLayer("worldLayer", tileset2, 0, 0);
  // console.log(worldLayer)
  // aboveLayer.setDepth(10);
  // worldLayer.setCollisionByProperty({ collides: true });
  // window.character = this.physics.add.sprite(50,50, "player");
  // window.character.setScale(0.5)
  const anims = this.anims;
  anims.create({
    key: "misa-left-walk",
    frames: anims.generateFrameNames("atlas", {
      prefix: "misa-left-walk.",
      start: 0,
      end: 3,
      zeroPad: 3
    }),
    frameRate: 10,
    repeat: -1
  });
  anims.create({
    key: "misa-right-walk",
    frames: anims.generateFrameNames("atlas", {
      prefix: "misa-right-walk.",
      start: 0,
      end: 3,
      zeroPad: 3
    }),
    frameRate: 10,
    repeat: -1
  });
  anims.create({
    key: "misa-front-walk",
    frames: anims.generateFrameNames("atlas", {
      prefix: "misa-front-walk.",
      start: 0,
      end: 3,
      zeroPad: 3
    }),
    frameRate: 10,
    repeat: -1
  });
  anims.create({
    key: "misa-back-walk",
    frames: anims.generateFrameNames("atlas", {
      prefix: "misa-back-walk.",
      start: 0,
      end: 3,
      zeroPad: 3
    }),
    frameRate: 10,
    repeat: -1
  });

  this.input.keyboard.once("keydown_D", event => {
    // Turn on physics debugging to show player's hitbox
    this.physics.world.createDebugGraphic();

    // Create worldLayer collision graphic above the player, but below the help text
    const graphics = this.add
      .graphics()
      .setAlpha(0.75)
      .setDepth(20);
      playerLayer.renderDebug(graphics, {
      tileColor: null, // Color of non-colliding tiles
      collidingTileColor: new Phaser.Display.Color(243, 134, 48, 255), // Color of colliding tiles
      faceColor: new Phaser.Display.Color(40, 39, 37, 255) // Color of colliding face edges
    });
  });

};

// this is called up to 60 times per second
gameScene.update = function(){
  const speed = 105;
  const prevVelocity = player.body.velocity.clone();

  // Stop any previous movement from the last frame
  player.body.setVelocity(0);

  // Horizontal movement
  if (cursors.left.isDown) {
    player.body.setVelocityX(-speed);
  } else if (cursors.right.isDown) {
    player.body.setVelocityX(speed);
  }

  // Vertical movement
  if (cursors.up.isDown) {
    player.body.setVelocityY(-speed);
  } else if (cursors.down.isDown) {
    player.body.setVelocityY(speed);
  }

  // Normalize and scale the velocity so that player can't move faster along a diagonal
  player.body.velocity.normalize().scale(speed);

  // this.gameScene.physics.arcade.collide(window.character, this.layer2);
  if (cursors.left.isDown) {
    player.anims.play("misa-left-walk", true);
  } else if (cursors.right.isDown) {
    player.anims.play("misa-right-walk", true);
  } else if (cursors.up.isDown) {
    player.anims.play("misa-back-walk", true);
  } else if (cursors.down.isDown) {
    player.anims.play("misa-front-walk", true);
  } else {
    player.anims.stop();

    // If we were moving, pick and idle frame to use
    if (prevVelocity.x < 0) player.setTexture("atlas", "misa-left");
    else if (prevVelocity.x > 0) player.setTexture("atlas", "misa-right");
    else if (prevVelocity.y < 0) player.setTexture("atlas", "misa-back");
    else if (prevVelocity.y > 0) player.setTexture("atlas", "misa-front");
  }


};

// set the configuration of the game
// let config = {
//   type: Phaser.AUTO, // Phaser will use WebGL if available, if not it will use Canvas
//   width: 640,
//   height: 400,
//   scene: gameScene,
//   parent: document.getElementById("phaser-demo"),
//   physics: {
//     default: "arcade",
//     arcade: {
//         debug: true
//     }
// }
// };
const config = {
  type: Phaser.AUTO,
  width: 640,
  height: 400,
  parent:document.getElementById("phaser-demo"),
  pixelArt: true,
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 0 },
      debug:false
    }
  },
  scene: gameScene
};

// create a new game, pass the configuration
let game = new Phaser.Game(config);





function task(steps,str) { 
  setTimeout(function() { 
      // Add tasks to do
      eval(str) 
  }, 2000 * steps/2); 
} 


$( "#run" ).click(function() {
  // $('#run').hide();
  var str = $("#prog_field"). val();
  console.log(str.split("\n"))
  steps = str.split("\n")
  $.each(steps, function(index, value){
    task(index,value)
  });
  
});
// game functions

