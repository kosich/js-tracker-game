var MoveAction = ActionState.extend({
    time:function(){
        return 1000;
    },
    test:function(){ 
        //if current can shoot
        return true;
    },
    execute:function(delta){
        if(!ActionState.prototype.execute.call(this, delta))
            return false;

        this.resolve(); 

        var target = this.options.target;
        var current = game.coordinatesFromPoint(new geometry.Point(this.parent.g.x, this.parent.g.y));
        if (target[0] === current[0] && target[1] === current[1])
            return false;//target wasn't set

        try{
            var path = pathfinder.findPath(current[0], current[1], target[0], target[1], new PF.Grid(game.level.width, game.level.height, game.level.map.field));
            if(!path.length)
                return false;

            path.shift();
            this.parent.path = path;
            return true; 
        } catch (e){
            console.log("failed", target);
        } finally{
            //console.log("executed");
        }
    }
});
