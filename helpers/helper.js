(function(window, undefined){
    window.helper = {
        /**
         *  creates or gets namespace
         *  object for initing with predefined
         * */
        defineNS : function(name, object, replace){
            if(!name)
                return;
            var namespacearray = name.split('.'), current = window;
            for(var i=0, j=namespacearray.length-1; i<j; i++){
                current = current[namespacearray[i]] || (current[namespacearray[i]] = {});
            }
            if (object!= null 
                && (replace || current[namespacearray[i]]==null)){ 
                //target object exists and replace is TRUE

                //defining target object as object
                current = (current[namespacearray[i]] = object);
            } else {
                //getting target or new object
                current = current[namespacearray[i]] || (current[namespacearray[i]] = {});
            }

            return current;
        }
    }
})(window);
