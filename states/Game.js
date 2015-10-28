var Game = function(game) {};

Game.prototype = {
  //Properties
  actions : {
    'put' : function (command) {

        var unit = new Unit(game, command.where_x , command.where_y, command.team , command.letter, 'freeserif');
        TeamA.add(unit);// should be removed at soe point
        game.level.get_unit[command.ui] = unit;
        if (command.ui > game.level.guid_max){
          game.level.guid_max = command.ui;
        }
        return 0;
    },
    'move' : function (command) {
        var unit = game.level.get_unit[command.ui];        
        unit.move(command.positions_y, command.positions_x);
        return 0;
        
    },
    'attack' : function (command) {
        var unit = game.level.get_unit[command.ui];
        var target = game.level.get_unit[command.target];
        unit.hit(0,0);
        target.get_hit(0);
        return 0;
    },
    'die' : function (command) {
        var unit = game.level.get_unit[command.ui];
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
    game.level= {};

    music.stop();
    this.stage.disableVisibilityChange = false; // dont kno what this is 

    //key is a unique identifier 'a0' , 'a1' etc that is shared between server and client
    // The value is the sprite object so it can be accessed directly
    game.level.get_unit = {};
    game.level.guid_max = 0;
    game.level.get_input_field = {};

    this.ask_initial_configuration();



    //
    // this.receive_commands();

    //Generator for the commands instead
    game.level.parsed_commands = this.parse_server_side_commands('tbd');
    // Call it every 2 seconds
    game.time.events.loop(Phaser.Timer.SECOND *2 , this.consume_command, this);

    game.time.events.loop(Phaser.Timer.SECOND /3 , this.move_teamA, this);

    //Useful code for looping events
    // game.time.events.loop(Phaser.Timer.SECOND , this.receive_commands, this);
    
  },

  consume_command : function(){
    var command = game.level.parsed_commands.next().value;
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
    


    //Grid stuff
    game.level.tile_size = 20;

    //How many grip points?
    game.level.gp_x = 64;
    game.level.gp_y = 32;

    //How many pixels do I need?
    game.level.i_need_x = game.level.tile_size * game.level.gp_x;
    game.level.i_need_y = game.level.tile_size * game.level.gp_y;

    game.level.grid_offset_x = 4;
    game.level.grid_offset_y = 10;

        //Configure Background
    tilesprite = game.add.tileSprite(game.level.grid_offset_x, game.level.grid_offset_y, game.level.i_need_x, game.level.i_need_y,'game-bg');
    tilesprite.tileScale.y = 0.5;
    tilesprite.tileScale.x = 0.5;

    game.level.ship_scale = 0.5;

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
    InputFields = game.add.group();

    InputFields.collect_input = function(){
      
      //for later use
      var input = {};
      this.forEachAlive(function(item) {

                    if ( !(item.g_x in input) ){
                      input[item.g_x] = {};
                    }
                    input[item.g_x][item.g_y] = " abcdefghijklmnopqrstuvwxyz"[item.unit_image.frame];
                    
                    item.spawn_unit();
                    item.clear_image();
                    


      },this);

      
    };

    //init explosions
    explosions = game.add.group();
    explosions.createMultiple(30, 'kaboom');
    explosions.forEach(this.setupExplosion, this);



    //make the input field
    game.level.focused_input = {'turn_off': function (){}, 'handle_keypress' : {}};
    game.level.direction_of_writting = 'right';
    var button;
    game.level.input_field_depth = 4;
    for(var row = game.level.gp_y - game.level.input_field_depth; row < game.level.gp_y; row++) {
      game.level.get_input_field[row] = {};
      for(var col = 0; col < game.level.gp_x; col++) {
        button = new InputField(game, col, row, 'a', this);
        game.level.get_input_field[row][col] = button;
        InputFields.add(button);
      }
    }



    game.input.keyboard.addCallbacks(this, this.handle_keypress);



    // button = game.add.button(400,400, 'sprsh_input', button_got_clicked, this, 2, 1, 0);
    //Hmmmmmmmm
    // TeamA.add(inputfield);


  },
  handle_keypress : function(keypress) {

    game.level.focused_input.handle_keypress(keypress);

  },


  setupExplosion : function (explosion_sp) {
        explosion_sp.anchor.x = 0.5;
        explosion_sp.anchor.y = 0.5;
        explosion_sp.scale.set(0.3,0.3);
        explosion_sp.animations.add('kaboom');
    },
  
  move_teamA : function(keypress) {
    TeamA.forEachExists(function (unit) {
            unit.act();
        });

    

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



