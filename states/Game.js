var Game = function(game) {};

Game.prototype = {
  loadScripts: function () {
    
    

    
  },
  loadImages: function () {
    
  },

  preload: function () {
    this.optionCount = 1;


  },



  create: function () {
    
    music.stop();
    this.stage.disableVisibilityChange = false;
    
    
    
    
    game.add.tileSprite(0,0,game.width,game.height,'game-bg');

    var rows = 16;
    var columns = 20;
    
    game.matrix = new Array(rows);

    for(var i = 0; i < rows; i++) {
        game.matrix[i] = new Array(columns);
    }

    for(var i = 0; i < rows; i++) {
        for(var j = 0; j < columns; j++) {
            game.matrix[i][j] = 0;
        }
    }


    
    game.time.events.loop(Phaser.Timer.SECOND , this.units_act, this);




    this.create_units();

    // //  An explosion pool
    explosions = game.add.group();
    explosions.createMultiple(30, 'kaboom');
    explosions.forEach(this.setupExplosion, this);














    
    
  },


  create_units : function  () {

        TeamA = game.add.group();
        TeamB = game.add.group();


        for (var i = 5; i < 12; i++) {
            var row = 11;

            unit = new Unit(game, i, row, 'a', 'o');
            game.matrix[row][i] = unit;

            TeamA.add(unit);
        }

        for (var i = 0; i < 20; i++) {
            var row = 10;

            unit = new Unit(game, i, row, 'a', 'x');
            game.matrix[row][i] = unit;

            TeamA.add(unit);
        }

        for (var i = 0; i < 20; i++) {
            var row = 5;

            unit = new Unit(game, i, row, 'b', 'x');
            game.matrix[row][i] = unit;

            TeamB.add(unit);
        }

        TeamB.setAll('angle', 180);
    },

  setupExplosion : function (explosion_sp) {
        explosion_sp.anchor.x = 0.5;
        explosion_sp.anchor.y = 0.5;
        explosion_sp.scale.set(0.3,0.3);
        explosion_sp.animations.add('kaboom');
    },
  units_act : function () {
        /// They act by order of "who was created first"
        /// A more sophisticated approach would be better
        TeamA.forEachExists(function (unit) {
            unit.act();
        });

        if (TeamA.countLiving() === 0 && TeamB.countLiving() === 0){
          this.game.state.start("GameOver");

        }

    }



};