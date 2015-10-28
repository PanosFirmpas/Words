
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
    this.turn_off();
    
    // if the keypress is a recognized character
    // text = "ArrowRight"; 
    
    if ( /^[a-z]$/.test(keypress.key) ){
      var unit = new Unit(game, this.g_x , this.g_y, 'a' , keypress.key, 'freeserif');
      TeamA.add(unit);// should be removed at soe point
      
      game.level.get_unit[ game.level.guid_max +1] = unit;
      game.level.guid_max = game.level.guid_max+1;
      
      
      this.get_next(game.level.direction_of_writting);
    }
    else if (keypress.key == ' ') {
      
      this.get_next('right');
    
    }
    else if (keypress.key == 'Enter') {
      
      this.get_next('down');
    }
    else if (keypress.key == 'ArrowDown') {
      if (game.input.keyboard.isDown(Phaser.Keyboard.SHIFT)) {
         
          game.level.direction_of_writting = 'down';
          
      } 
      
      this.get_next('down');
    
    }
    else if (keypress.key == 'ArrowRight') {
      if (game.input.keyboard.isDown(Phaser.Keyboard.SHIFT)) {
          game.level.direction_of_writting = 'right';
      } 
      else {
      this.get_next('right');
      }
    
    }
    else if (keypress.key == 'ArrowUp') {
      this.get_next('up');
    }
    else if (keypress.key == 'ArrowLeft') {
      this.get_next('left');
    }
    else {
      this.turn_on();
    }
};

InputField.prototype.my_dimention_modulated_by = function( dim, pm ) {
  var input_size, foo, bar;
  if (dim == "x"){
      input_size = game.level.gp_x;
      foo = (game.level.gp_x - input_size);
      bar = this.g_x + pm - foo;
  }
  else {
    input_size = game.level.input_field_depth;
    foo = (game.level.gp_y - input_size);
    bar = this.g_y + pm - foo;

  }

  if (bar <0) {
      return  input_size + (bar % input_size) +foo;
  }
  else {
      return (bar % input_size) + foo;
  }
  

};



InputField.prototype.get_next = function(direction) {
  //very elegance
  var next;
  switch ( direction ) {
          case "right":
              next =  game.level.get_input_field[this.g_y][ this.my_dimention_modulated_by('x', +1)];
              break;
          case "left":
              next =  game.level.get_input_field[this.g_y][this.my_dimention_modulated_by('x', -1)];
              break;
          case "up":
              
              next =  game.level.get_input_field[ this.my_dimention_modulated_by('y', -1) ][(this.g_x)];
              break;
          case "down":
              next =  game.level.get_input_field[ this.my_dimention_modulated_by('y', +1) ][(this.g_x)];
              break;
          
      }
  game.level.focused_input = next;
  next.turn_on();

};



button_got_clicked = function(button){
  

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