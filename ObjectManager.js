(function(){ 
    var om = { 
        objects: [],
        add : function(type, params){
            //TODO: if renderable -- add to the shape
            var newElement = new O[type](params);
            newElement.init(params);
            this.objects.push(newElement);
            return newElement;
        }, 
        remove : function(element){
            //TODO: remove from canvas if renderable
            var index = this.objects.indexOf(element);
            if(index>=0) {
                this.objects.splice(index, 1);
                return true;
            }
            return false;
        }
    }
    helper.defineNS("ObjectManager", om);
})();
