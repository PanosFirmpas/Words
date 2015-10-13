var game = new Phaser.Game(20*40, 16*40, Phaser.AUTO, 'game'), Main = function () {};

Main.prototype = {

  preload: function () {
    game.load.image('background',    'assets/images/stars.jpg');
    game.load.image('loading_bar',  'assets/images/loading.png');
    game.load.image('logo',    'assets/images/logo.png');
    // game.load.script('polyfill',   'lib/polyfill.js');
    game.load.script('utils',   'lib/utils.js');
    game.load.script('splash',  'states/Splash.js');
    game.load.script('Units', 'lib/units.js');
  },

  create: function () {
    game.state.add('Splash', Splash);
    game.state.start('Splash');
  }

};

game.state.add('Main', Main);
game.state.start('Main');