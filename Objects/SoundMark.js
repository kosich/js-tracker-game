(function(){ 
    'use strict';

    var O = helper.defineNS('O'); 
    O.SoundMark = Backbone.Model.extend({
        init: function(){
            this.asm = new ActionStateMachine();
            this.asm.push(new DisappearAction(this));
        },
        graphics: function(){
            var g = this.g = new createjs.Shape();
            g.graphics.beginFill("#fa0").drawCircle(0,0, 10); 
            g.alpha = 0.5;
            g.x = this.attributes.x;
            g.y = this.attributes.y;
            return g; 
        },
        tick : function(delta){ 
            this.asm.tick(delta);
        },
        destroy: function(){
            ObjectManager.remove(this);
            game.stage.removeChild(this);
        } 
    });

})();
