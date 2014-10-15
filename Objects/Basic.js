(function(){ 
    'use strict';

    var O = helper.defineNS('O'); 
    O.Basic = Backbone.Model.extend({
        speed: null,
        turningSpeed : Math.PI,
        health: 100,
        isAlive: true,
        rangeOfView : Math.PI,
        angleOfView : 0,
        init : function init(){ 
            var self = this;

            if (this.rangeOfView - 2*Math.PI > PRECISION){ 
                console.warn('due to js low precision fov computations might be wrong', this.rangeOfView - 2*Math.PI);
            }

            this.asm = new ActionStateMachine();

            //TODO make pixel-indefferent measurement system
            this._hitradius = (game.level.cellH + game.level.cellW)/6;

            this.speed = this.speed || Math.ceil(game.level.cellH/9);
            
            this.vis={};
        },
        graphics : function (){
            var g = this.g = new createjs.Shape();
            g.graphics.beginFill("red").drawCircle(0,0, this._hitradius);
            g.shadow = new createjs.Shadow("#000000", 0, 0, 5);
            return g;
        },
        hit: function(power){
            this.health-=power || 0;

            if (this.health>0 && this.isAlive){
                console.log(this.id, ' got hit, ', this.health, 'hp left');
                return;
            }

            this.destroy();
            return; 
        },
        destroy: function(){
            console.log(this.id, ' just died');
            this.isAlive = false;
            this.trigger(Events.Action.Died);
            ObjectManager.remove(this);
            game.stage.removeChild(this.g);
        } ,
        tick : function tick(delta){
            if (!this.isAlive)
                return;

            this.asm.tick(delta);

            //FOV computations 
            var center = {x:this.g.x, y:this.g.y};
            game.fov.setCenter(center);

            this.vis.floorShape = new createjs.Shape();
            this.vis.floorShape.name = this.id;

            var minAngle = arithmetics.restrictNumber(this.angleOfView-this.rangeOfView/2, -Math.PI , Math.PI);
            var maxAngle = arithmetics.restrictNumber(this.angleOfView+this.rangeOfView/2, -Math.PI , Math.PI);

            this.visibilityArea = game.fov.calc(minAngle, maxAngle);

            drawVisibilityArea(this.vis.floorShape.graphics, this.visibilityArea, center);
        },   
        vis : null,
        point : function(){
            return new geometry.Point(this.g.x,this.g.y);
        },
        //ASM actions {{
        turn : function(point, immediate){
            //TODO possible accepted args: Point, {x,y}, Angle, angle
            var heroPoint = new geometry.Point(this.g.x,this.g.y);
            this.asm.add(new TurnAction(this, {
                angle: heroPoint.angleToPoint(point)
            }), immediate);
        },
        targetTo : function targetTo(coordinates, immediate){
            //console.log('going to walk');
            var aMove = new MoveAction(this, {
                target: coordinates
            }); 
            this.asm.add(aMove, immediate);
        },
        shoot: function(target, immediate){
            //console.log('going to shoot');
            var aShot = new ShootAction(this, {
                target: target
            }); 
            this.asm.add(aShot, immediate);
        },
        //}}
        hitTest: function(object){
            //TODO: add object type check

            var gCenter = new geometry.Point(this.g.x, this.g.y),
            circle = new geometry.Circle(gCenter, this._hitradius);

            if (circle.intersectsLine(object)){
                return gCenter;
            }

            return null;
        }
    });

    function drawVisibilityArea(g, path, center) {
        var i = path.length-1, startPoint = path[i], point;
        g.f('#11bb99');
        g.beginStroke('yellow'); 
        g.mt(startPoint.x, startPoint.y); 

        while(i--){ 
            point= path[i];
            g.lt(point.x, point.y);
        }

        g.cp();
    }

})();
