
window.onload = function() {
        // var givemeone = function () {return 'one';};
        



        var ARCHETYPES = {
            "x" : {
                'hp' :  50,
                'damage' : 5,
                
                'look_where_i_hit' : function (obj) {

                                        return  game.matrix[obj.m_y + 1 * obj.ahead][obj.m_x];
                                    },
                'look_where_i_move' : function (obj) {
                                        return  game.matrix[obj.m_y + 1 * obj.ahead][obj.m_x];
                                    }

            },

            "o" : {
                'hp' :  5,
                'damage' : 15,
                
                'look_where_i_hit' : function (obj) {

                                        return  game.matrix[obj.m_y + 2 * obj.ahead][obj.m_x];
                                    },
                'look_where_i_move' : function (obj) {
                                        return  game.matrix[obj.m_y + 1 * obj.ahead][obj.m_x];
                                    }

            },
        };



        
                //  Here is a custom game object
        Unit = function (game, m_x, m_y, team, letter) {


            this.m_x = m_x;
            this.m_y = m_y;
            this.team = team;
            this.letter = letter;

            //used to reverse matrix position references according to team
            if (this.team === 'a')
                {this.ahead = -1; }
            else
                {this.ahead = 1; }
            
            

            this.props = ARCHETYPES[this.letter];
            this.hp = this.props.hp; //bad design, too tired to figure it out, just want it to work
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

        Unit.prototype.move = function() {

            if (this.team == 'b') {
                game.matrix[this.m_y][this.m_x] = 0;
                this.m_y += 1;
                game.matrix[this.m_y][this.m_x] = this;

                this.position.y += 40;

            }
            else{
                game.matrix[this.m_y][this.m_x] = 0;
                this.m_y -= 1;
                game.matrix[this.m_y][this.m_x] = this;

                this.position.y -= 40;
            }

         };

         Unit.prototype.get_hit = function(damage) {


            function RGBtoHEX(r, g, b) {

                return r << 16 | g << 8 | b;

            }

            


            this.hp -= damage;
            
            this.tint = RGBtoHEX(this.hp/parseFloat(this.max_hp) * 256.,0,0);
            
            if (this.hp <=0){
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

        Unit.prototype.act = function() {
                var where_i_move = this.props['look_where_i_move'](this);

                var where_i_hit = this.props['look_where_i_hit'](this);
            


                if ( where_i_move === 0){
                    

                    this.move();
                }
                else{

                    if (where_i_hit != 0){
                        where_i_hit.get_hit(this.props.damage);
                    }

                }

        };


        

        // var act_ranged = function() {
            
        //     if (this.team == 'b') {

        //         if (game.matrix[this.m_y +1][this.m_x] === 0){

        //             this.move(game.matrix);
        //         }
        //         else{
        //             //
        //         }

        //     }
        //     else{
                


        //         if (game.matrix[this.m_y - 1][this.m_x] === 0){

        //             this.move();
        //         }
        //         else{
        //             //
        //         }
                
        //     }

        // };

        





        

        

        








        var rows = 16;
        var columns = 20;

        var game = new Phaser.Game(columns *40 , rows*40, Phaser.AUTO, '', { preload: preload, create: create, update: update });
        
        // var test = "it worked";


        
    
        game.matrix = new Array(rows);
        for(var i=0; i<rows; i++) {
            game.matrix[i] = new Array(columns);
        }


        for(var i=0; i<rows; i++) {
            for(var j=0; j<columns; j++) {
                game.matrix[i][j] = 0;
            }
            
        }

        



        var backgroundSprite;
        var TeamA;
        var TeamB;


        function preload () {

            //The BAckground tile
            game.load.image('bg', 'assets/bg_tile.png');
            game.load.image('ship','assets/ship.png');

            game.load.spritesheet('invader', 'assets/invader32x32x4.png', 32, 32);
            game.load.spritesheet('kaboom', 'assets/explode.png', 128, 128);


        }

        function setupInvader (invader) {

            invader.anchor.x = 0.5;
            invader.anchor.y = 0.5;
            invader.scale.set(0.3,0.3);
            invader.animations.add('kaboom');

        }

        function create () {
            

            backgroundSprite = game.add.tileSprite(0,0,game.width,game.height,'bg');

            game.time.events.loop(Phaser.Timer.SECOND , units_act, this);
            
            
            create_units();


            //  An explosion pool
            explosions = game.add.group();
            explosions.createMultiple(30, 'kaboom');
            explosions.forEach(setupInvader, this);
            
            

        }

        function update () {
            
            
            
        }


        function translate_grid_position_to_pixels (x,y){
            return [x*40 +20, y*40 +20];
        }


        function create_units () {
            
            TeamA = game.add.group();
            TeamB = game.add.group();

            for (var i = 5; i < 12; i++)
            {
                var row = 11;
                
                unit = new Unit(game, i, row, 'a', 'o');
                game.matrix[row][i] = unit;
                
                TeamA.add(unit);

            }

            for (var i = 0; i < 20; i++)
            {
                var row = 10;
                
                unit = new Unit(game, i, row, 'a', 'x');
                game.matrix[row][i] = unit;
                
                TeamA.add(unit);

            }



            for (var i = 0; i < 20; i++)
            {   
                var row = 5;
                
                
                unit = new Unit(game, i, row, 'b', 'x');

                game.matrix[row][i] = unit;
                
                TeamB.add(unit);

            }
            // TeamB.setAll('angle', 180);
            
        }

        function units_act () {
            
            /// They act by order of "who was created first"
            /// A more sophisticated approach would be better
            TeamA.forEachExists(function (unit) {
                unit.act();

            });
            
        }















    };

    
