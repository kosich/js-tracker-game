(function(window, document, undefined){
    var levels = helper.defineNS('Levels', []);
    var level1 = (function(){
        var map=  maps[0],
         field = map.field,
         l = field.length;

        return _.extend({
            height : l,
            width : l,
            get stageH (){
                return game.stage.canvas.height;
            },
            get stageW (){
                return game.stage.canvas.width;
            },
            get cellH (){
                return game.level.stageH / game.level.height;
            },
            get cellW (){
                return game.level.stageW / game.level.width;
            },
            guardians : []
        }, Backbone.Events); 
    })();
    levels.push(level1);
})(window, document); 
