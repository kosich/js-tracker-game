(function(){ 
    'use strict';
    var O = helper.defineNS('O');

    O.Guardian = O.Basic.extend({
        init: function() {
            var self = this;
            O.Basic.prototype.init.apply(this, arguments);
            this.speed =this.speed/3;

            this.currentMovementTargetIndex = -1;
            this.set('movementArray', []);

            this.on('change:movementArray', function(){
                this.currentMovementTargetIndex= 0;
                this.targetTo.apply(this, this.get('movementArray')[this.currentMovementTargetIndex]);
            });

            this.on(Events.Move.attarget, function(){
                this.currentMovementTargetIndex++;
                if(this.currentMovementTargetIndex>=this.get('movementArray').length)
                    this.currentMovementTargetIndex= 0;
                this.targetTo.apply(this, this.get('movementArray')[this.currentMovementTargetIndex]);
            }); 

            this.listen();
        },
        move : function(delta){ 
            //console.log('moving to', this.target);
            O.Basic.prototype.move.apply(this, arguments);
        },
        tick: function(delta){ 
            O.Basic.prototype.tick.apply(this, arguments);

            //TODO: move to AI {{
            /*
            if(this.vis.floorShape.hitTest(this.game.hero.g.x, this.game.hero.g.y))
                if (!(this.asm.actionStack[0] instanceof Shoot))
                    this.shoot(this.game.hero);
            */
            //}}
        },
        watch: function(){ 
        },
        listen: function(){ 
            var self = this;
             //listening
            return;
            game.map.on(Events.Sound.Basic, function(sender, soundStrength, x, y){
                if(sender === self)
                    return;
                var dist = Math.pow(Math.pow(self.g.x - x, 2) + Math.pow(self.g.y - y, 2), 0.5);

                if(dist > self.map.cellH*soundStrength) 
                    return;

                console.log('heard sound @', x, y); 
                console.log('dist', dist); 
                self.targetTo(x, y);
            });
        } 
    });
})();
