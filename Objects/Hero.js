(function(){ 
    'use strict';
    var O = helper.defineNS('O');

    O.Hero = O.Basic.extend({
        //TODO move to characteristics{{
        speed: 1,
        turningSpeed : Math.PI,
        health: 100,
        rangeOfView : Math.PI,
        //}}

        init: function() {
            O.Basic.prototype.init.apply(this, arguments);
            //TODO move to inventory
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
