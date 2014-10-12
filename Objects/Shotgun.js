(function(){ 
    'use strict';
    var O = helper.defineNS('O');

    O.Shotgun = Backbone.Model.extend({
        power: 25,
        bulletCount: 7,
        speed: 350,
        shoot: function(target, shooter){
            var targetPoint;

            if (target instanceof geometry.Point)
                targetPoint = target;
            else
                targetPoint = new geometry.Point(target.g.x, target.g.y);

            var currentPoint = new geometry.Point(shooter.g.x, shooter.g.y),
                angle =  currentPoint.angleToPoint(targetPoint);

            var bulletCount = Math.ceil(Math.random()*this.bulletCount)+1;
            while(bulletCount--)
                var bullet = ObjectGenerator({ 
                    type: "O.Bullet", 
                    parent : shooter,
                    pos : currentPoint,
                    angle : angle + Math.random()/5,
                    speed : this.speed * Math.random() + this.speed,
                    power: this.power
                });
        },
        reload: function(){}
    });

})();
