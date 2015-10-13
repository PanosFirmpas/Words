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




var Unit = function (game, m_x, m_y, team, letter) {


    this.m_x = m_x;
    this.m_y = m_y;
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
    //bad design, too tired to figure it out, just want it to work
    this.hp = this.props.hp;
    this.max_hp = this.props.hp;

    var x = m_x * 40 +20;
    var y = m_y * 40 +20;

    Phaser.Sprite.call(this, game, x, y, 'ship');
    this.anchor.setTo(0.5);

    if (this.team == 'b'){
        this.angle = 180;
    }
};

Unit.prototype = Object.create(Phaser.Sprite.prototype);

Unit.prototype.constructor = Unit;



Unit.prototype.get_hit = function(damage) {

    function RGBtoHEX(r, g, b) {
        return r << 16 | g << 8 | b;
    }

    this.hp -= damage;
    this.tint = RGBtoHEX(this.hp/parseFloat(this.max_hp) * 256.0 , 0,0);

    if (this.hp <=0) {
        this.die_gracefully();
    }
};

Unit.prototype.die_gracefully = function() {

    game.matrix[this.m_y][this.m_x] = 0;

    var explosion = explosions.getFirstExists(false);
    explosion.reset(this.position.x, this.position.y);
    explosion.play('kaboom', 30, false, true);
    this.kill();
};


Unit.prototype.what_is_there = function(y,x) {
    if (y <0 ||
        y >= game.matrix.length ||
        x < 0 ||
        x >= game.matrix[0].length ){

        return "out_of_bounds";

        }
    else{

        var there = game.matrix[y][x];
        if (there === 0){
            return "empty";
        }
        else {
            if (there.team == this.team){
                return 'friend'
            }
            else{
                return 'foe'
            }
        }
    }
}

Unit.prototype.hit = function(y,x){
    var where_i_hit = game.matrix[y][x];
    where_i_hit.get_hit(this.props.damage);

}


Unit.prototype.move = function(target_y, target_x) {
    // undefined

    game.matrix[this.m_y][this.m_x] = 0;

    this.m_y = target_y;
    this.m_x = target_x;

    game.matrix[this.m_y][this.m_x] = this;

    this.position.y = this.m_y *40 +20;
    this.position.x = this.m_x *40 +20;


    
};

Unit.prototype.act = function() {
    
    
    //Can I attack something?
    var [hit_y,hit_x] = this.props.look_where_i_hit(this);
    switch ( this.what_is_there(hit_y, hit_x) ) {
        case "out_of_bounds":
            // this.die_gracefully();
            break;
        case "empty":
            //
            break;
        case "friend":
            //
            break;
        case "foe":
            this.hit(hit_y, hit_x);
            break;
        
    }
    //Can I move?
    var [move_y,move_x] = this.props.look_where_i_move(this);
    switch ( this.what_is_there(move_y, move_x) ) {
        case "out_of_bounds":
            this.die_gracefully();
            break;
        case "empty":
            this.move(move_y, move_x);
            break;
        case "friend":
            //
            break;
        case "foe":
            //
            break;
    }
        
    

};
