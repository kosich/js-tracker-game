(function(){

    var EXCLUDED_PROPS = ["type", "id", "has"];

    var og = function ObjectGenerator(def){
        var Type = helper.defineNS(def.type);
        var o = new Type();

        for(var p in def){
            if (!def.hasOwnProperty(p) || p in EXCLUDED_PROPS)
                continue;
            o[p] = def[p];
        }

        ObjectManager.add(o);

        /* adding objects inclusion
           if (p.has){
           p.has.forEach((el)=>{
        //generate new object and add to World
        ObjectManager.add(og(el), o);
        });
        }
        */

        return o;
    }
    helper.defineNS("ObjectGenerator", og);
})();
