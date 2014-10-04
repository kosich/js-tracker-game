(function(){ 
    'use strict';

    var O = helper.defineNS('O'); 
    O.Bullet = Backbone.Model.extend({
        init: function(options){
            this.parent = options.parent;
            this.pos = options.startingPosition;
            this.angle = options.angle;
            this.speed = options.speed;
            this.power = options.power;

            //TODO: move to basic
            this.game = options.game; 

            this._gameField = new geometry.Field(new geometry.Point(0, 0), 
                                                 new geometry.Point(options.game.level.stageW, options.game.level.stageW));

            var bullet = this.g = new createjs.Shape();
            bullet.graphics.beginFill('#dfd').drawCircle(0, 0, this.game.level.cellW/5, this.game.level.cellH/5);
            bullet.x = this.pos.x;
            bullet.y = this.pos.y;
            this.game.level.stage.addChild(bullet);

        },
        tick: function(delta){

            var self = this;

            var distance = delta * this.speed / 1000; //m/s ; TODO: add pixel-independent geometry
         
            //calculate position by angle, last position and delta
            var pos = this.pos.extendTo(this.angle, distance);
            //TODO: //if hit something on map, trigger hit of first object met, self.destroy

            //if out of map, self.destroy
            if(!this._gameField.contains(this.pos)){
                console.log('destroying', pos);
                this.destroy();
                return;
            }

            var lastTracePath = new geometry.Line(pos, this.pos),
                walls = this.game.level.walls,
                hitPoints = [],
                hitPoint;

            for(var i =0, j = walls.length; i<j; i++){
                if (!lastTracePath.intersectsLine(walls[i])) 
                    continue;

                console.log('hitted a wall');
                hitPoints.push(lastTracePath.pointOfIntersection(walls[i]));
            }

            this.game.guardians.forEach(function(guard){
                //TODO: HERE BE THE GUARDIAN COLLISION DETECTION
                if (guard == self.parent)
                    return;

                hitPoint = guard.hitTest(lastTracePath);
                if (hitPoint) 
                    hitPoints.push({ hitPoint: hitPoint, object: guard}); 
            });

            if(hitPoints.length){
                hitPoint = hitPoints.pop();

                if(hitPoint.object)
                    hitPoint.object.hit(this.power);

                this.destroy();
            }

            this.pos = pos;
            this.g.x = this.pos.x;
            this.g.y = this.pos.y;
        },
        destroy: function(){
            this.game.OM.remove(this);
            this.game.level.stage.removeChild(this.g);
        }
    });
    


})();
