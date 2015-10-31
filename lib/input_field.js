
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
    //The grid coordinates of this field
    this.g_x = x;
    this.g_y = y;

    //The absolute coordinates in pixels of this field
    //migtht need something more sophisticated
    this.pixel_x = x * game.level.tile_size + game.level.tile_size/2 + game.level.grid_offset_x;
    this.pixel_y = y * game.level.tile_size + game.level.tile_size/2 + game.level.grid_offset_y;

    //init this properly as a phaser button
    Phaser.Button.call(this,game, this.pixel_x, this.pixel_y, 'sprsh_input', button_got_clicked, this, 3,2,1,0); 
    this.anchor.setTo(0.5);
    this.scale.set(game.level.ship_scale);
    this.alpha = 0.3;

    //The unit image is a an image of a unit, but not a proper unit object
    //It's rendered based on images of a spritesheet 'freeserif'
    //position 0 is empty (an image with alpha =0 everywhere)
    //position 1 is 'a', etc
    this.unit_image = game.add.sprite(this.pixel_x , this.pixel_y, 'freeserif');
    this.unit_image.anchor.setTo(0.5);
    this.unit_image.scale.set(game.level.ship_scale);
    this.unit_image.frame = 0 ;

    //Used for some logic, being alive mean sim currently displaying a unit image
    this.alive = false;
    
    //Add field to the game
    game.add.existing(this);
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
    if ( /^[a-z]$/.test(keypress.key) ){
      //This spawns a real unit
      //*removed*

      //this just updates this buttons "unit image" sprite
      //so elegant
      this.unit_image.frame = " abcdefghijklmnopqrstuvwxyz".indexOf(keypress.key);
      this.alive = true;      
      
      this.get_next(game.level.direction_of_writting);
    }
    else if (keypress.key == ' ') {
      this.unit_image.frame = 0;
      this.alive = false;
      this.get_next('right');
    }
    else if (keypress.key == 'Enter') {

      if (game.input.keyboard.isDown(Phaser.Keyboard.SHIFT)) {
         this.parent.collect_input();
         this.turn_on();
      } 
      else {
        this.get_next('down');
      }
    }
    else if (keypress.key == 'ArrowDown') {
      if (game.input.keyboard.isDown(Phaser.Keyboard.SHIFT)) {
          game.level.direction_of_writting = 'down'; 
      } 
      else {
        this.get_next('down');
      }
    }
    else if (keypress.key == 'ArrowRight') {
      if (game.input.keyboard.isDown(Phaser.Keyboard.SHIFT)) {
          game.level.direction_of_writting = 'right';
          this.turn_on();
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
    else if (keypress.key == 'Backspace') {
      if (this.game.level.direction_of_writting=='right'){
        this.get_next('left', true);
      }
      else {
        this.get_next('up', true);
      }
    }
    else {
      this.turn_on();
    }
};

InputField.prototype.spawn_unit = function(){

    var unit = new Unit(game, this.g_x , this.g_y, 'a' , " abcdefghijklmnopqrstuvwxyz"[this.unit_image.frame], 'freeserif');
    TeamA.add(unit);// should be removed at soe point
      
    game.level.get_unit[ game.level.guid_max +1] = unit;
    game.level.guid_max = game.level.guid_max+1;
};

InputField.prototype.my_dimention_modulated_by = function( dim, pm ) {
  //This is to have the input-focus only cycle through the positions of the input field
  //instead of cycling through the entire map
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

InputField.prototype.clear_image = function() {
  this.unit_image.frame=0;
  this.alive = false;
};

//bleeding edge motherfuckers
InputField.prototype.get_next = function(direction, erase = false) {
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
  if (erase === true) {
    next.clear_image();
  }
  next.turn_on();
};



button_got_clicked = function(button){
  //This, annoyingly only shows the tile turned on after the mouse hovers away
  //cba to fix for now but 
  //TODO
  if (this.focus === false) {
    game.level.focused_input.turn_off();
    game.level.focused_input = this;
    this.turn_on();
  }
  else {
    game.level.focused_input = {'turn_off': function (){}, 'handle_keypress' : {}};
    this.turn_off();
  }
};