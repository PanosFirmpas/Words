
window.onload = function() {

                //  Here is a custom game object
        Unit = function (game, m_x, m_y, team, hp, act_func) {

            
            // this.game = game;

            this.m_x = m_x;
            this.m_y = m_y;
            this.hp = hp;
            this.act = act_func;



            var x = m_x * 40 +20;
            var y = m_y * 40 +20;

            Phaser.Sprite.call(this, game, x, y, 'ship');
            this.anchor.setTo(0.5);

            this.team = team;

            
            if (this.team == 'b'){
                this.angle = 180;
            }


        };

        Unit.prototype = Object.create(Phaser.Sprite.prototype);
        Unit.prototype.constructor = Unit;

        /**
         * Automatically called by World.update
         */

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

            this.hp -= damage;
            
            if (this.hp <=0){
                var explosion = explosions.getFirstExists(false);
                explosion.reset(this.position.x, this.position.y);
                explosion.play('kaboom', 30, false, true);
            }


         };

         //TODO
         //Un-hardcode dimentions and background grid
         // Resolution menu ?
         // Can you scale everything up and down  to handle resolutions?


        var act = function() {
            var there;
            if (this.team == 'b') {
                there = game.matrix[this.m_y +1][this.m_x];

                if ( there === 0){

                    this.move(game.matrix);
                }
                else{
                    //
                }

            }
            else{
                there = game.matrix[this.m_y - 1][this.m_x];
                if ( there === 0){

                    this.move();
                }
                else{
                    there.get_hit(10);
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

        console.log(game.matrix[5]); //TBD



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
            invader.animations.add('kaboom');

        }

        function create () {
            

            backgroundSprite = game.add.tileSprite(0,0,game.width,game.height,'bg');

            game.time.events.loop(Phaser.Timer.SECOND *2, units_act, this);
            
            
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


            for (var i = 0; i < 20; i++)
            {
                var row = 10;
                
                unit = new Unit(game, i, row, 'a', 20, act);
                game.matrix[row][i] = unit;
                
                TeamA.add(unit);

            }
            for (var i = 0; i < 20; i++)
            {   
                var row = 5;
                
                
                unit = new Unit(game, i, row, 'b', 20, act);

                game.matrix[row][i] = unit;
                
                TeamB.add(unit);

            }
            // TeamB.setAll('angle', 180);
            
        }

        function units_act () {
            

            TeamA.forEachExists(function (unit) {
                unit.act();

            });
            
        }















    };

    
