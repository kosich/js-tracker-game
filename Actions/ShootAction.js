var Shoot = ActionState.extend({
    time:function(){
        return 1000;
    },
    test:function(){ 
        //if current can shoot
        return true;
    },
    shootRate: 1000,
    execute:function(delta){
        if(!ActionState.prototype.execute.call(this, delta))
            return false;

        //todo: update percentage
        this.shootRate-=delta;

        if(this.shootRate<=0){

            //create a bullet
            this.resolve(); 
            console.log('BANG!');

            var targetPoint,
                target = this.options.target;

            if (target instanceof geometry.Point)
                targetPoint = target;
            else
                targetPoint = new geometry.Point(target.g.x, target.g.y);

            var currentPoint = new geometry.Point(this.parent.g.x, this.parent.g.y),
                angle =  currentPoint.angleToPoint(targetPoint);

            var bullet = ObjectGenerator({ 
                type: "O.Bullet", 
                parent : this.parent,
                pos : currentPoint,
                angle : angle,
                speed : 1000,
                power: 10
            });
            ObjectManager.add(bullet);
            return true;
        }

        return false;
    }
});