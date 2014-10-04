(function(){ 
    'use strict';
    var O = helper.defineNS('O');

    O.Hero = O.Basic.extend({
        init: function() {
            O.Basic.prototype.init.apply(this, arguments);
            this.health= 10000;
        }
    });

})();
