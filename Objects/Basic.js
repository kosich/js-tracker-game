(function(){ 
    'use strict';

    var O = helper.defineNS('O'); 
    O.Basic = Backbone.Model.extend({

        speed: null,
        health: 100,
        isAlive: true,
        rangeOfView : Math.PI,
        angleOfView : 0,
        init : function init(){ 
            var self = this;

            if (this.rangeOfView - 2*Math.PI > PRECISION){ 
                console.warn('due to js low precision fov computations might be wrong', this.rangeOfView - 2*Math.PI);
            }

            this.asm = Object.create(ActionStateMachine);

            this._hitradius = (game.level.cellH+game.level.cellW)/6;

            this.speed = Math.ceil(game.level.cellH/9);

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

            this.isAlive = false;
            ObjectManager.remove(this.g);
            console.log(this.id, ' just died');
            this.trigger(Events.Action.Died);
            return; 
        },
        tick : function tick(delta){
            if (!this.isAlive)
                return;

            this.asm.tick(delta);

            this.move();

            //FOV computations 
            var center = {x:this.g.x, y:this.g.y};
            game.fov.setCenter(center);

            this.vis.floorShape = new createjs.Shape();
            this.vis.floorShape.name = this.id;

            var minAngle = restrictNumber(this.angleOfView-this.rangeOfView/2, -Math.PI , Math.PI);
            var maxAngle = restrictNumber(this.angleOfView+this.rangeOfView/2, -Math.PI , Math.PI);

            this.visibilityArea = game.fov.calc(minAngle, maxAngle);

            drawVisibilityArea(this.vis.floorShape.graphics, this.visibilityArea, center);
        },   
        vis : null,
        turn : function(x, y){
            //TODO: move to asm
            this.angleOfView = Math.atan2(y - this.g.y, x - this.g.x);
            //this.angleOfView = restrictNumber(this.angleOfView, -Math.PI , Math.PI);
            this.g.rotation =  180 * this.angleOfView / Math.PI;
        },
        move : function(delta){ 
            //TODO: move to asm
            if (!(this.path && this.path.length))
                return;

            var joint = this.pos = this.path[0];
            var t = [joint[0] * game.level.cellW + game.level.cellW/2, joint[1] * game.level.cellH + game.level.cellH/2];

            this.turn(t[0], t[1]);

            var sx = t[0] - this.g.x,
            sy = t[1] - this.g.y;

            var l = Math.sqrt(Math.pow(sx, 2) + Math.pow(sy, 2))||0;

            if (l<this.speed){
                this.g.x = t[0];
                this.g.y = t[1];
            } else {
                var k = this.speed/l;
                this.g.x += sx * k;
                this.g.y += sy * k;
            }

            //TRIGGERING EVENTS
            //sound
            var soundStrength = 5;
            game.level.trigger(Events.Sound.Basic, this /*sender*/, soundStrength, this.g.x, this.g.y);

            //At point
            if (this.g.x=== t[0]&& this.g.y===t[1]){
                this.path.shift();
                if (this.path.length === 0)
                    this.trigger(Events.Move.attarget);
            }
        },
        targetTo : function targetTo(coordinates){
            //console.log('going to walk');
            var aMove  = new MoveAction(this, {
                target: coordinates
            }); 
            this.asm.push(aMove);
        },
        shoot: function(target){
            //console.log('going to shoot');
            var aShot = new ShootAction(this, {
                target: target
            }); 
            this.asm.push(aShot);
        },
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

    function restrictNumber(n, min, max){
        if(min>max)
            throw 'make sure to pass min>=max .. ' + [min, max].join(',');

        if(n>=min && n<=max)
            return n;

        if(min!=0) {
            var d = 0-min;
            return restrictNumber(n+d, min+d, max+d) - d;
        }

        n = n % max;
        if(n<0)
            return max+n;

        return n;
    }

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
