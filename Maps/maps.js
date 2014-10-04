(function(window, document, undefined){
    var levels = helper.defineNS('Levels', []);
    var level1 = (function(){
        var map=  maps[0],
         field = map.field,
         l = field.length;

        return _.extend({
            init: function(stage){
                //drawing stage map
                this.stage = stage;
                this.guardians=[];
                this.guardians.push({ ma: [
                    [this.cellW*2, this.stageH-this.cellH*2],
                    [this.cellW*2, this.cellH*2],
                    [this.stageW-this.cellW*2, this.stageH-this.cellH*2],
                    [this.stageW-this.cellW*2, this.cellH*2]
                ]});

            },
            field : field,
            spawnPoint : map.objects.hero,
            height : l,
            width : l,
            exitPoint: map.exitPoint,
            get stageH (){
                return this.stage.canvas.height;
            },
            get stageW (){
                return this.stage.canvas.width;
            },
            get cellH (){
                return this.stageH / this.height;
            },
            get cellW (){
                return this.stageW / this.width;
            },
            pointFromCoordinates: function pointFromCoordinates(x, y){
                return [
                    Math.ceil(x/this.cellW) -1 ,
                    Math.ceil(y/this.cellH) -1 
                ];
            },
            guardians : []
        }, Backbone.Events); 
    })();
    levels.push(level1);
})(window, document); 
