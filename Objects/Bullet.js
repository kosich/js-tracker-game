(function(){ 
    'use strict';

    var O = helper.defineNS('O'); 
    O.Bullet = Backbone.Model.extend({
        init: function(options){

            //TODO: move to game init
            this._gameField = new geometry.Field(new geometry.Point(0, 0), 
                                                 new geometry.Point(game.level.stageW, game.level.stageW));

        },
        graphics : function(){
            var bullet = this.g = new createjs.Shape();
            bullet.graphics.beginFill('#dfd').drawCircle(0, 0, game.level.cellW/15, game.level.cellH/15);
            return bullet;

            //TODO: a bullet is drawn in 0,0 at first
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
                walls = game.level.walls,
                hitPoints = [],
                hitPoint;

            for(var i =0, j = walls.length; i<j; i++){
                if (!lastTracePath.intersectsLine(walls[i])) 
                    continue;

                console.log('hitted a wall');
                hitPoints.push(lastTracePath.pointOfIntersection(walls[i]));
            }

            //{{ 
            ObjectManager.objects.forEach(function(object){
                if (object == self || object == self.parent || !object.hitTest)
                    return;

                hitPoint = object.hitTest(lastTracePath);
                if (hitPoint) {
                    console.log("hitted a ", object.id);
                    hitPoints.push({ hitPoint: hitPoint, object: object}); 
                }
            }); 
            // }}

            if(hitPoints.length){

                hitPoints.sort(function(a,b){
                    return self.pos.squareDistanceToPoint(a) - self.pos.squareDistanceToPoint(b);
                });

                if(hitPoints.length>1)
                    console.log(hitPoints);

                hitPoint = hitPoints.shift();

                if(hitPoint.object)
                    hitPoint.object.hit(this.power);

                pos = hitPoint;
                this.destroy();
            }

            this.pos = pos;
            this.g.x = this.pos.x;
            this.g.y = this.pos.y;
        },
        destroy: function(){
            ObjectManager.remove(this);
            game.stage.removeChild(this.g);
        }
    });
    


})();
