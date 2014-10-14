(function(){ 
    'use strict';
    var O = helper.defineNS('O');

    O.Guardian = O.Basic.extend({
        init: function() {
            var self = this;
            O.Basic.prototype.init.apply(this, arguments);
            this.speed =this.speed/3;

            this.currentMovementTargetIndex = -1; 
            this.on('change:movementArray', function(){
                this.currentMovementTargetIndex = 0;
                this.targetTo.call(this, this.get('movementArray')[this.currentMovementTargetIndex]);
            });

            window.setTimeout(function(){
            //WARN dirty hack!!
            //TODO refactor
            self.set('movementArray', self.walkingCoordinates); 
            }, 4);

            this.on(Events.Move.attarget, function(){
                this.currentMovementTargetIndex++;
                if(this.currentMovementTargetIndex>=this.get('movementArray').length)
                    this.currentMovementTargetIndex = 0;
                this.targetTo.call(this, this.get('movementArray')[this.currentMovementTargetIndex]);
            }); 

            this.listen();
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
        graphics : function (){
            var g = this.g = new createjs.Shape(),
                s = this._hitradius;
            
            g.graphics.beginFill("#f35")
                .beginStroke('black') 
                .mt(1.5*s,0)
                .lt(-s, s)
                .lt(-s,-s)
                .cp();

            return g;
        },
        watch: function(){ 
            //TODO: move to AI {{
        },
        listen: function(){ 
            //TODO: move to AI {{
            return;

            var self = this;
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
