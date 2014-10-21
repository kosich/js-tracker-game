(function(window, document, undefined){
    var levels = helper.defineNS('Levels', []);
    var level1 = (function(){
        var map = maps[0],
            field = map.field,
            l = field.length,
            w = field[0].length;

        return _.extend({
            map : map,
            height : l,
            width : w,
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
            }
        }, Backbone.Events); 
    })();
    levels.push(level1);
})(window, document); 
