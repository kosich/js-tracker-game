(function(){ 
    'use strict';
    var O = helper.defineNS('O');

    O.Hero = O.Basic.extend({
        turningSpeed : Math.PI*4,
        init: function() {
            O.Basic.prototype.init.apply(this, arguments);

            this.gun = new O.Pistol();
        },
        graphics : function (){
            var g = this.g = new createjs.Shape(),
                s = this._hitradius;
            
            g.graphics.beginFill("#3f5")
                .beginStroke('black') 
                .mt(1.5*s,0)
                .lt(-s, s)
                .lt(-s,-s)
                .cp();

            return g;
        }
    });

})();
