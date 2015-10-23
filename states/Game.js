var Game = function(game) {};

Game.prototype = {
  //Properties
  actions : {
    'put' : function (command) {

        var unit = new Unit(game, command.where_x , command.where_y, command.team , command.letter);
        TeamA.add(unit);// should be removed at soe point
        game.get_unit[command.ui] = unit;
        return 0;
    },
    'move' : function (command) {
        var unit = game.get_unit[command.ui];        
        unit.move(command.positions_y, command.positions_x);
        return 0;
        
    },
    'attack' : function (command) {
        var unit = game.get_unit[command.ui];
        var target = game.get_unit[command.target];
        unit.hit(0,0);
        target.get_hit(0);
        return 0;
    },
    'die' : function (command) {
        var unit = game.get_unit[command.ui];
        unit.die_gracefully();
        return 0;
    },

  },

  //Methods
  loadScripts: function () {
  },
  loadImages: function () {
  },

  preload: function () {
    this.optionCount = 1; //Dont know what this is
  },



  create: function () {
    music.stop();
    this.stage.disableVisibilityChange = false; // dont kno what this is 

    //key is a unique identifier 'a0' , 'a1' etc that is shared between server and client
    // The value is the sprite object so it can be accessed directly
    game.get_unit = {};

    this.ask_initial_configuration();

    //
    // this.receive_commands();

    //Generator for the commands instead
    game.parsed_commands = this.parse_server_side_commands('tbd');
    // Call it every 2 seconds
    game.time.events.loop(Phaser.Timer.SECOND *2 , this.consume_command, this);

    //Useful code for looping events
    // game.time.events.loop(Phaser.Timer.SECOND , this.receive_commands, this);
    
  },

  consume_command : function(){
    var command = game.parsed_commands.next().value;
    if (command === undefined){
      return 1;
    }
    var do_this = this.actions[command.action];
    var command_test = do_this(command);
  },
  
  receive_commands : function (server_thing) {
    
    
    // for (var ci in parsed_commands) {
    //     var command = parsed_commands[ci];
    //     var do_this = this.actions[command.action];
    //     //confirm success ?
    //     var command_test = do_this(command);
    

        
        
    

  },
//   function* idMaker(){
//   var index = 0;
//   while(index < 3)
//     yield index++;
// }
  parse_server_side_commands : function* (server_thing) {

    //placeholder/example input from server or right after translating what th server sent
    
    yield {
        'action' : 'put',
        'letter' : 'o',
        'where_x' : 6,
        'where_y' : 7,
        'ui' : 'a0',
        'team' : 'a'
        
    };
    yield {
        'action' : 'put',
        'letter' : 'o',
        'where_x' : 7,
        'where_y' : 8,
        'ui' : 'a1',
        'team' : 'a'
        
    };
    yield {
        'action' : 'put',
        'letter' : 'o',
        'where_x' : 8,
        'where_y' : 9,
        'ui' : 'a2',
        'team' : 'a'
        
    };
    yield {
        'action' : 'move',
        'ui' : 'a1',
        'positions_y' : -1,
        'positions_x': 0
    };
    yield {
        'action' : 'attack',
        'ui' : 'a1',
        'target': 'a0',
        'damage' : 20,

    };
    yield {
        'action' : 'die',
        'ui' : 'a2',
        'flair': 'gracefully'
    };

    
  },

  ask_initial_configuration : function  () {
    //Configure Background
    game.add.tileSprite(0,0,game.width,game.height,'game-bg');

    //Make matrix
    //
    //Should probably be removed, but lets keep it for now
    //
    // var rows = 16;
    // var columns = 20;
    
    // game.matrix = new Array(rows);

    // for(var i = 0; i < rows; i++) {
    //     game.matrix[i] = new Array(columns);
    // }

    // for(var i = 0; i < rows; i++) {
    //     for(var j = 0; j < columns; j++) {
    //         game.matrix[i][j] = 0;
    //     }
    // }

    //add initial units
    TeamA = game.add.group();
    TeamB = game.add.group();

    //init explosions
    explosions = game.add.group();
    explosions.createMultiple(30, 'kaboom');
    explosions.forEach(this.setupExplosion, this);


  },


  setupExplosion : function (explosion_sp) {
        explosion_sp.anchor.x = 0.5;
        explosion_sp.anchor.y = 0.5;
        explosion_sp.scale.set(0.3,0.3);
        explosion_sp.animations.add('kaboom');
    },
  // units_act : function () {
  //       /// They act by order of "who was created first"
  //       /// A more sophisticated approach would be better
  //       TeamA.forEachExists(function (unit) {
  //           unit.act();
  //       });

  //       if (TeamA.countLiving() === 0 && TeamB.countLiving() === 0){
  //         this.game.state.start("GameOver");

  //       }

  //   }



};