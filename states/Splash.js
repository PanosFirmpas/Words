var Splash = function () {},
    playSound = true,
    playMusic = true,
    music;

Splash.prototype = {

  loadScripts: function () {
    game.load.script('style', 'lib/style.js');
    game.load.script('WebFont', 'vendor/webfontloader.js');
    game.load.script('gamemenu','states/gamemenu.js');
    game.load.script('game', 'states/Game.js');
    game.load.script('gameover','states/gameover.js');
    game.load.script('credits', 'states/credits.js');
    game.load.script('options', 'states/options.js');
  },

  loadBgm: function () {
    // thanks Kevin Macleod at http://incompetech.com/
    game.load.audio('dangerous', 'assets/bgm/Dangerous.mp3');
    game.load.audio('exit', 'assets/bgm/Exit the Premises.mp3');
  },
  // varios freebies found from google image search
  loadImages: function () {
    game.load.image('menu-bg', 'assets/images/menu-bg.jpg');
    game.load.image('options-bg', 'assets/images/options-bg.jpg');
    game.load.image('gameover-bg', 'assets/images/gameover-bg.jpg');
    game.load.image('game-bg', 'assets/images/bg_tile.png');

    game.load.image('ship','assets/images/ship.png');
    game.load.spritesheet('invader', 'assets/images/invader32x32x4.png', 32, 32);
    game.load.spritesheet('kaboom', 'assets/images/explode.png', 128, 128);

    game.load.spritesheet('sprsh_input', 'assets/images/input_spritesheet.png', 40, 40);
    game.load.spritesheet('freeserif', 'assets/images/FreeSerif.svg',40,40);
    
  },

  loadFonts: function () {
    WebFontConfig = {
      custom: {
        families: ['TheMinion'],
        urls: ['assets/style/theminion.css']
      }
    };
  },

  init: function () {
    this.loadingBar = game.make.sprite(game.world.centerX, 400, "loading_bar");
    this.logo       = game.make.sprite(game.world.centerX, 200, 'logo');
    this.status     = game.make.text(game.world.centerX, 380, 'Loading...', {fill: 'white'});
    utils.centerGameObjects([this.logo, this.status, this.loadingBar]);
  },

  preload: function () {
    game.add.sprite(0, 0, 'background');
    game.add.existing(this.logo).scale.setTo(0.5);
    game.add.existing(this.loadingBar);
    game.add.existing(this.status);
    this.load.setPreloadSprite(this.loadingBar);

    this.loadScripts();
    this.loadImages();
    this.loadFonts();
    this.loadBgm();

  },

  addGameStates: function () {

    game.state.add("GameMenu",GameMenu);
    game.state.add("Game",Game);
    game.state.add("GameOver",GameOver);
    game.state.add("Credits",Credits);
    game.state.add("Options",Options);
  },

  addGameMusic: function () {
    music = game.add.audio('dangerous');
    music.loop = true;
    music.play();
  },

  create: function() {
    this.status.setText('Ready!');
    this.addGameStates();
    this.addGameMusic();

    // setTimeout(function () {
    //   
    // }, 1000);
    game.state.start("GameMenu");
  }
};