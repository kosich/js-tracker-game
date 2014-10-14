'use strict';
var MoveAction = ActionState.extend({
    run : function(){
        ActionState.prototype.run.apply(this, arguments); 

        //check if need to create path
        //and generate the path 
        //TODO path should be updated peridiocally if moving objects to omit are added
        //TODO move testing for validity to this.test
        var target = this.options.target,
            current = game.coordinatesFromPoint(this.parent.point()),
            self = this;

        var canExecute = !(function(){
            if (target[0] === current[0] && target[1] === current[1])
                return false;

            try{
                self.path = pathfinder.findPath(current[0], current[1], target[0], target[1], new PF.Grid(game.level.width, game.level.height, game.level.map.field));
            } catch (e){
                console.log('failed to go to ', target);
                return false;
            }

            if(!self.path || !self.path.length){
                return false;
            }

            self.path.shift();//remove current pos
            return true;
        })();

        if(canExecute)
            this.resolve();
    },
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

        var o = this.parent,
            self = this;
        if (!(this.path && this.path.length)){
            this.resolve();
            return true;
        }
        move(delta);

        function move(delta){ 

            var joint = o.pos = self.path[0];
            var t = [joint[0] * game.level.cellW + game.level.cellW/2, joint[1] * game.level.cellH + game.level.cellH/2];

            //insert the turn action if needed{{
            var targetPoint = new geometry.Point(t[0], t[1]),
                targetAngle = o.point().angleToPoint(targetPoint);
            if (!arithmetics.floatsAreEqual(o.angleOfView , targetAngle)){//diff between target angle and current angle of the subject is less then precision
                o.turn(targetPoint, true);
                return false;
            }
            //}}

            var sx = t[0] - o.g.x,
            sy = t[1] - o.g.y;

            var l = Math.sqrt(Math.pow(sx, 2) + Math.pow(sy, 2))||0;

            if (l<o.speed){
                o.g.x = t[0];
                o.g.y = t[1];
            } else {
                var k = o.speed/l;
                o.g.x += sx * k;
                o.g.y += sy * k;
            }

            //TRIGGERING EVENTS
            //sound
            var soundStrength = 6;//TODO combine sound strength with position of the character and its stelth abilities (or whatever)
            if (Math.random()<0.01)//10% to emit sound
                game.level.trigger(Events.Sound.Basic, o /*sender*/, soundStrength, o.g.x, o.g.y);

            //At point
            if (o.g.x=== t[0]&& o.g.y===t[1]){
                self.path.shift();
                if (self.path.length === 0){
                    o.trigger(Events.Move.attarget);
                    self.resolve();
                    return true;
                }
            }
        }
    }
});
