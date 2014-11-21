(function(){
    'use strict';

    //inventory could be shown in two modes:
    //only char with bag and
    //or char, bag and other bag

    var i = {
        init : function(operands){ 
            //bindings
            $(window).keydown(this.keydown);

            this.operands = operands;

            //show
            this.show();
        },

        keydown: function(e){
            var inventoryKeys = ['j', 'J'];
            if (e.char in inventoryKeys)
                alert('e');
        },

        destroy: function(){
            //unbind
            $(window).off('keydown', this.keydown);

            //hide
            this.hide();
        },

        show: function(){
            var dlg = this.dialogue = $('<div/>').prop('id','inventory-dialogue');
            $(document.body).append(dlg);

            this.operands.forEach(function(el){
                //init itemlists
                var oList = ObjectManager.getItems(el);
                var select = $('<select/>');
                dlg.append(select);
                oList.forEach((item)=>select.append($('<option/>').text(item.title)))
            });


        },
        hide: function(){
             this.dialogue.remove();
        },

        // TAB -- move between tabs
        tab : function(){
        },

        // m -- move item between views
        move : function(){
            ObjectManager.move(a, b, selectedItem);
        },

        // g -- drop the item
        drop : function(){ 
            ObjectManager.drop(a, selectedItem);
        }
    };

    helper.defineNS('inventory', i);
})();
