var ARCHETYPES = {
        "x" : {'hp' :  50,
               'damage' : 5,
               look_where_i_hit : function (obj) {
                   return  [obj.m_y + 1 * obj.ahead , obj.m_x];
               },
               look_where_i_move : function (obj) {
                   return  [obj.m_y + 1 * obj.ahead , obj.m_x];
               }
        },
        "o" : {'hp' :  5,
               'damage' : 15,
               look_where_i_hit : function (obj) {
                   return  [obj.m_y + 2 * obj.ahead , obj.m_x];
               },
               look_where_i_move : function (obj) {
                   return  [obj.m_y + 1 * obj.ahead , obj.m_x];
               }
        }
    };




var Unit = function (game, x, y, team, letter, spritesheetname) {

    this.team = team;
    this.letter = letter;
    //used to reverse matrix position references according to team
    if (this.team === 'a') {
        this.ahead = -1;
    }
    else {
        this.ahead = 1;
    }
    this.props = ARCHETYPES[this.letter];

    var inital_x = x * game.level.tile_size + game.level.tile_size/2 + game.level.grid_offset_x;
    var inital_y = y * game.level.tile_size + game.level.tile_size/2 + game.level.grid_offset_y;
    Phaser.Sprite.call(this, game, inital_x, inital_y, spritesheetname, " abcdefghijklmnopqrstuvwxyz".indexOf(this.letter));
    this.anchor.setTo(0.5);
    this.scale.set(game.level.ship_scale);

    if (this.team == 'b'){
        this.angle = 180;
    }
};

Unit.prototype = Object.create(Phaser.Sprite.prototype);

Unit.prototype.constructor = Unit;



Unit.prototype.get_hit = function(damage) {
    //Animate getting hit here

    //Set alpha to 0.1
    this.alpha = 0.1;
    //.. places a tween 
    // <3
    // A Tween allows you to alter one or more properties of a target object over a defined period of time.
    //  This can be used for things such as alpha fading Sprites, scaling them or motion. Use Tween.to or Tween.
    //  from to set-up the tween values. You can create multiple tweens on the same object by calling Tween.to 
    //  multiple times on the same Tween. Additional tweens specified in this way become "child" tweens and are 
    //  played through in sequence. You can use Tween.timeScale and Tween.reverse to control the playback of this 
    //  Tween and all of its children.
    // <3
    game.add.tween(this).to( { alpha: 1 }, 1000, "Linear", true);
    
    // function RGBtoHEX(r, g, b) {
    //     return r << 16 | g << 8 | b;
    // }
    // this.tint = RGBtoHEX(this.hp/parseFloat(this.max_hp) * 256.0 , 0,0);
};

Unit.prototype.die_gracefully = function() {
    var explosion = explosions.getFirstExists(false);
    explosion.reset(this.position.x, this.position.y);
    explosion.play('kaboom', 30, false, true);
    this.kill();
};


Unit.prototype.hit = function(y,x){
    //Use this to handle any animation needed when a unit hits something else
};


Unit.prototype.move = function(positions_y, positions_x) {
    var target_y = this.position.y + positions_y*game.level.tile_size;
    var target_x = this.position.x + positions_x*game.level.tile_size;
    var target_time = 200; //200 ms

    if (this.letter === 'a'){
        var demoTween = game.add.tween(this).to({x:target_x, y:target_y}, target_time);
        demoTween.start();
    }
    else {

        this.position.y =  target_y;
        this.position.x = target_x ;
    }

    if (this.position.y  < game.level.tile_size){
        this.die_gracefully();
    }
};
