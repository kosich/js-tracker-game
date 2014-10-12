(function(){ 
    'use strict';
    var O = helper.defineNS('O');

    O.Pistol = Backbone.Model.extend({
        power: 75,
        speed: 350,
        shoot: function(target, shooter){
            var targetPoint;

            if (target instanceof geometry.Point)
                targetPoint = target;
            else
                targetPoint = new geometry.Point(target.g.x, target.g.y);

            var currentPoint = new geometry.Point(shooter.g.x, shooter.g.y),
                angle =  currentPoint.angleToPoint(targetPoint);

            var bullet = ObjectGenerator({ 
                type: "O.Bullet", 
                parent : shooter,
                pos : currentPoint,
                angle : angle,
                speed : this.speed,
                power: this.power
            });
        },
        reload: function(){}
    });

})();
