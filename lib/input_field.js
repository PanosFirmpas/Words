
var InputField = function (game, x, y, team, callbackContext) {
    
    this.team = team;
    this.focus = false;
    
    //used to reverse matrix position references according to team
    if (this.team === 'a') {
        this.ahead = -1;
    }
    else {
        this.ahead = 1;
    }
    this.g_x = x;
    this.g_y = y;

    this.initial_x = x * game.level.tile_size + game.level.tile_size/2 + game.level.grid_offset_x;
    this.initial_y = y * game.level.tile_size + game.level.tile_size/2 + game.level.grid_offset_y;

    
    Phaser.Button.call(this,game, this.initial_x, this.initial_y, 'sprsh_input', button_got_clicked, this, 3,2,1,0); 


    this.anchor.setTo(0.5);
    this.scale.set(game.level.ship_scale);
    this.alpha = 0.3;
    

    game.add.existing(this);

    // button = game.add.button(game.world.centerX - 95, 400, 'button', actionOnClick, this, 2, 1, 0);
    

};

InputField.prototype = Object.create(Phaser.Button.prototype);

InputField.prototype.constructor = InputField;

InputField.prototype.turn_off = function() {
    this.focus = false;
    this.alpha = 0.3;
};
InputField.prototype.turn_on = function() {
    this.focus = true;
    this.alpha = 1;
};

InputField.prototype.handle_keypress = function(keypress) {
    // console.log(keypress.key, game.level.get_input_field);
    this.turn_off();

    var next =  game.level.get_input_field[this.g_y][(this.g_x+1) % game.level.gp_x ];
    game.level.focused_input = next;
    next.turn_on();

};

button_got_clicked = function(button){
  console.log('I got clicked!');

  if (this.focus === false) {
    game.level.focused_input.turn_off();
    game.level.focused_input = this;
    this.turn_on();
  }
  else {
    game.level.focused_input = {'turn_off': function (){}, 'handle_keypress' : {}};
    this.turn_off();
  }
  

  //

};



// ScaledButton.prototype = Object.create(Phaser.Button.prototype);
// ScaledButton.prototype.constructor = ScaledButton;