/// 
(function(window, undefined){
    'use strict';

    var AI = Backbone.Model.extend({ 
        state : 'default',
        init: function init(options) { 
            this.toy = options.toy;
        },
        tick : function tick(delta){
            // default state
            // -- go on
            // if enemy spotted -- change to 'in battle'
            if (this.toy.vis.floorShape.hitTest(game.hero.g.x, game.hero.g.y)){
                // stop other tasks
                // attack the hero
                
            }
            // if enemy lost -- change to 'suspicious'
            // depending on state pick aptopriate behaviour
        }
    });

    helper.defineNS('AI', AI); 
})(window);
