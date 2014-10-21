(function(){
    'use strict';

    //inventory could be shown in two modes:
    //only char with bag and
    //or char, bag and other bag
    var i = function(){
    };

    var c = {
        show: function(a, b){
            var aList = ObjectManager.getItems(a),
                bList = ObjectManager.getItems(b);

            // TAB -- move between tabs
            // m -- move item between views
            ObjectManager.move(a, b, selectedItem);
        },
        hide: function(){
            this.destroy();
        }
    };

    defineNS('Inventory', i);
})();
