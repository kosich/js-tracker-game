'use strict';
var TurnAction = ActionState.extend({
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

        var targetAngle = this.options.angle,
            turnAngle = this.parent.turningSpeed * delta/1000,
            currentAngle = this.parent.angleOfView,
            clockwise = true;//positive or negative turn

        var sum1 = Math.abs(-Math.PI - Math.min(targetAngle, currentAngle)) 
                 + Math.abs(Math.PI - Math.max(targetAngle, currentAngle)),//x -Pi
            sum2 = Math.abs(targetAngle - currentAngle);//no crossing

        if(Math.min(sum1, sum2) <= turnAngle){
            turn(this.parent, targetAngle);
            this.resolve();
        } else {
            clockwise = Math.min(sum1, sum2) === sum1 /*not crossing -Pi*/ ? currentAngle>targetAngle : currentAngle<targetAngle; 
            turn(this.parent, this.parent.angleOfView + (clockwise?1:-1) * turnAngle);
        }

        function turn(o, a){ 
            o.angleOfView = arithmetics.restrictNumber(a, -Math.PI , Math.PI); 
            o.g.rotation =  180 * o.angleOfView / Math.PI;
        }
    }
});
