(function(window, undefined){
    window.helper = {
        /**
         *  creates or gets namespace
         *  object for initing with predefined
         * */
        defineNS : function(name, object){
            if(!name)
                return;
            var namespacearray = name.split('.'), current = window;
            for(var i=0, j=namespacearray.length-1; i<j; i++){
                current = current[namespacearray[i]] || (current[namespacearray[i]] = {});
            }
            if (object===undefined){ 
                current = current[namespacearray[i]] || (current[namespacearray[i]] = {});
            } else{
                if (current[namespacearray[i]]!==undefined)
                    throw 'trying to redefine existing object'+ name; 
                current = (current[namespacearray[i]] = object);
            }

            return current;
        },
        Geo: {
            
        }
    }
})(window);
