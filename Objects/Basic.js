(function(){ 
    'use strict';

    var O = helper.defineNS('O'); 
    O.Basic = Backbone.Model.extend({

        speed: null,
        health: 100,
        isAlive: true,
        rangeOfView : Math.PI,
        angleOfView : Math.PI/2, 
        init : function init(){ 
            var self = this;

            if(this.rangeOfView === 2*Math.PI)
                console.warn('due to js low precision fov computations might be wrong');

            this.asm = Object.create(ActionStateMachine);

            this._hitradius = (game.level.cellH+game.level.cellW)/4;

            this.speed = Math.ceil(game.level.cellH/6);

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
            console.log(this.name, ' got hit, ', this.health, 'hp left');
            if(this.health<=0){
                this.isAlive = false;
                game.level.stage.removeChild(this.g);
                console.log(this.name, ' just died');
                this.trigger(Events.Action.Died);
            }
        },
        targetTo : function targetTo(x,y){
            var target =  game.coordinatesFromPoint(new geometry.Point(x, y));
            var current = game.coordinatesFromPoint(new geometry.Point(this.g.x, this.g.y));
            if(target[0] === current[0] && target[1] === current[1])
                return false;//target wasn't set

            this.target = target;
            var path = pathfinder.findPath(current[0], current[1], target[0], target[1], new PF.Grid(game.level.width,game.level.height, game.level.map.field));
            if(!path.length)
                return false;

            path.shift();
            this.path = path;
            return true;
        },
        tick : function tick(delta){
            this.asm.tick(delta);

            this.move();
            
            //FOV computations 
            var center = {x:this.g.x, y:this.g.y};
            game.fov.setCenter(center);

            this.vis.floorShape = new createjs.Shape();
            this.vis.floorShape.name = this.name;

            var minAngle = restrictNumber(this.angleOfView-this.rangeOfView/2, -Math.PI , Math.PI);
            var maxAngle = restrictNumber(this.angleOfView+this.rangeOfView/2, -Math.PI , Math.PI);


            this.visibilityArea = game.fov.calc(minAngle, maxAngle);

            drawVisibilityArea(this.vis.floorShape.graphics, this.visibilityArea, center, game.level.height*game.level.cellH); 
        },   
        vis : null,
        move : function(delta){ 
            if(!(this.path && this.path.length))
                return;

            var joint = this.pos = this.path[0];
            var t = [joint[0] * game.level.cellW + game.level.cellW/2, joint[1] * game.level.cellH + game.level.cellH/2];


            this.angleOfView = Math.atan2(t[1] - this.g.y, t[0] - this.g.x);

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
            //game.level.map.trigger(Events.Sound.Basic, this /*sender*/, soundStrength, this.g.x, this.g.y);

            //At point
            if (this.g.x=== t[0]&& this.g.y===t[1]){
                this.path.shift();
                if (this.path.length === 0)
                    this.trigger(Events.Move.attarget);
            }
        },
        shoot: function(target){
            console.log('going to shoot');
            var aShot = new Shoot(this, {
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

    function drawVisibilityArea(g, path, center, size) {
        var i = path.length-1, startPoint = path[i], point;
        g.f('#199');
        g.beginStroke('yellow'); 
        g.mt(startPoint.x, startPoint.y); 

        while(i--){ 
            point= path[i];
            g.lt(point.x, point.y);
        }

        g.cp();
    }

})();
