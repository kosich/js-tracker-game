(function(){ 
    'use strict';
    var O = helper.defineNS('O');

    O.Guardian = O.Basic.extend({
        init : function(){
            O.Basic.prototype.init.apply(this, arguments);

            var self = this;

            // TODO moveout
            ObjectManager.add(new AI({
                puppet: this, 
                movementArray : self.walkingCoordinates
            }));


            this.gun = new O.Pistol();
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
        }
    });
})();
