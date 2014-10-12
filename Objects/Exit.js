(function(){ 
    'use strict';

    var O = helper.defineNS('O'); 
    O.Exit = Backbone.Model.extend({
        init: function(){
            this.doorRect = game.fieldFromCoordinates(this.coordinates);
        },
        graphics : function(){
            var exit = this.g = new createjs.Shape();
            exit.graphics.beginFill('#eee').drawRect(-game.level.cellW/2, -game.level.cellH/2, game.level.cellW, game.level.cellH);
            return exit;
        },
        tick: function(delta){ 
            if (this.doorRect.contains(new geometry.Point(game.hero.g.x, game.hero.g.y))){
                //TODO: apply level logic
                console.log("oke");
            }
        }
    });

})();
