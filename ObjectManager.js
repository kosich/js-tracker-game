(function(){ 
    var om = { 
        objects: [], 
        add : function(object){
            //TODO: if renderable -- add to the shape
            this.objects.push(object);

            object.init();

            //add graphics {{
            var g = object.graphics();
            game.stage.addChild(g);
            if(object.coordinates){
                var point = game.pointFromCoordinates(object.coordinates);
                g.x = point.x;
                g.y = point.y;
            }
            //}}
            
            return this;
        }, 
        clear: function(){
            this.objects.splice(0);
        },
        remove : function(object){
            //TODO: remove from canvas if renderable
            var index = this.objects.indexOf(object);
            if(index>=0) {
                this.objects.splice(index, 1);
                return true;
            }
            game.stage.removeChild(object);
            return false;
        },
        getByID: function(id){
            return this.objects.find(function(el){
                return el.id == id;
            });
        }
    }
    helper.defineNS("ObjectManager", om);
})();
