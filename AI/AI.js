/// 
(function(window, undefined){
    'use strict';

    // how does AI hides while reloading weapon?
    // when low HP he should be more accurate (hide, step back etc)
    // take appropriate gun?
    // pick objects?

    var AI = Backbone.Model.extend({ 
        // behaviour paradigms
        // default | attack | suspicious | searching | patrouling
        state : 'default',

        //target under attack
        target : null,

        initialize : function initialize() {
            // movement logic {{
            var self = this,
                p = this.attributes.puppet,
                startMove = function(){
                    self.currentMovementTargetIndex = 0;
                    p.targetTo.call(p, self.get('movementArray')[self.currentMovementTargetIndex]);
                };
            // TODO move to ai
            this.currentMovementTargetIndex = -1; 
            this.on('change:movementArray', startMove);
            startMove();

            p.on(Events.Move.attarget, function(){
                self.currentMovementTargetIndex++;
                if(self.currentMovementTargetIndex>=self.get('movementArray').length)
                    self.currentMovementTargetIndex = 0;
                p.targetTo.call(p, self.get('movementArray')[self.currentMovementTargetIndex]);
            }); 
            //}}
        },

        tick : function tick(delta){
            var p = this.attributes.puppet,
                h = game.hero;
            // default state
            // -- go on
            // if enemy spotted -- change to 'in battle'
            if (!this.target){
                // attack the hero if seen
                if(p.vis 
                && p.vis.floorShape 
                && p.vis.floorShape.hitTest(h.g.x, h.g.y)){
                    this.target = h;
                    p.asmClear();
                } 
            }

            if (this.target && this.target.isAlive && !p.asmHasActions()){
                // stop other tasks
                // TODO has a pause on turn action, when already turned
                p.turn(h.point());
                p.shoot(h.point());
            }
            // if enemy lost -- change to 'suspicious'
            // depending on state pick appropriate behaviour
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

    /*
    var patrouling = function(){
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
    }
    */

    helper.defineNS('AI', AI); 
})(window);
