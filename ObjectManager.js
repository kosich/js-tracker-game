(function(){ 
    var om = { 
        objects: [], 
        AIs : [],
        add : function(object){
            //TODO: if renderable -- add to the shape
            if (object instanceof AI){
                //logical
                this.AIs.push(object);
            } else {
                //physical
                this.objects.push(object);

                //TODO refactor checking init
                if (object.init)
                    object.init();

                //add graphics {{
                //TODO refactor checking graphics
                if (object.graphics){
                    var g = object.graphics();
                    game.stage.addChild(g);
                    if(object.coordinates){
                        var point = game.pointFromCoordinates(object.coordinates);
                        g.x = point.x;
                        g.y = point.y;
                    }
                }
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
