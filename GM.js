(function(){
    'use strict';

    helper.defineNS('PRECISION', 0.00001);

    var Game = Backbone.Model.extend({ 
        stage: null,
        hero: null,
        pane: null,
        fov: null,
        time: 0,
        timeline: null,
        guardians:[],
        visibleArea: null,
        guardiansVisibleAreas: [],
        paused: true,
        initialize: function(gameCanvas){ 
            var stage = new createjs.Stage(gameCanvas);
            this.stage = stage;
        },
        //# RENDERING TASKS {{
        pointFromCoordinates: function(c){
            var point = new geometry.Point();
            point.x= c[0] * this.level.cellW + this.level.cellW/2;
            point.y= c[1] * this.level.cellH + this.level.cellH/2;
            return point;
        },
        coordinatesFromPoint: function coordinatesFromPoint(point){
            return [
                Math.ceil(point.x/game.level.cellW) -1 ,
                Math.ceil(point.y/game.level.cellH) -1 
            ];
        },
        fieldFromCoordinates: function (coordinates){
            return new geometry.Field(
                new geometry.Point(coordinates[0] * this.level.cellW, coordinates[1] * this.level.cellH),
                new geometry.Point((coordinates[0]+1) * this.level.cellW, (coordinates[1]+1) * this.level.cellH)
            ); 
        },
        //}}
        //Render statics{{ 
        drawMap: function drawMap (level){
            //TODO: remake to drawing images

            //# drawing walls {{
            for(var i =0; i<level.width; i++){
                var subarray = level.map.field[i];
                for(var j=0; j< level.height; j++) {
                    if (subarray[j]){
                        var box = new createjs.Shape();
                        box.graphics.beginFill('#333').drawRect(0, 0, level.cellW, level.cellH);
                        box.x = j*level.cellW;
                        box.y = i*level.cellH;
                        game.stage.addChild(box);
                    }
                }
            }
            //}} 
        },
        //}}
        loadLevel: function(level){
            var self = this;
            this.level=level;
            var map = maps[0];
            this.level.map = map;
            //clear the map
            this.stage.removeAllChildren();
            this.stage.clear();

            //init rendering {{
            this.pane = new createjs.Shape();
            this.pane.graphics.beginFill('#8af').drawRect(0,0, level.stageW, level.stageH); 
            this.stage.addChild(this.pane);

            this.drawMap(level);
            //}}

            //create every object on a map
            map.objects.forEach(function(el){ 
                var object = ObjectGenerator(el);
            });

            this.hero = ObjectManager.getByID("Hero");

            self.level.on(Events.Sound.Basic, function(sender, x ,y){
                //console.log('sounds at', x, y , 'sender:', sender); 
            });

            //{{
            (function loadFOV(){
                self.fov = self.fov || new FOV();
                var walls = [];

                map.field.forEach(function(el, y, arr){
                    el.forEach(function(value, x){
                        if (value===1)
                            walls = walls.concat(createBox(x*self.level.cellW + self.level.cellW/2, y*self.level.cellH + self.level.cellH/2, self.level.cellH/2));
                    });
                });

                self.fov.loadMap(self.level.height*self.level.cellH, walls);
                self.level.walls = walls;//TODO:moveout

                function createBox(x, y, r){
                    x-=r, y-=r, r+=r;
                    var p1= {x:x, y: y}, p2= {x:x+r, y: y}, p3= {x:x+r, y: y+r}, p4= {x:x, y: y+r};
                    return [{p1: p1, p2:p2}, {p1: p2, p2:p3}, {p1: p3, p2:p4}, {p1: p4, p2:p1}];
                } 
            })();
            //}} 

            //INIT UI INTERACTIONS{{ 
            this.pane.on('click', function(event){
                var point = new geometry.Point(event.stageX, event.stageY);
                if(event.nativeEvent.ctrlKey){
                    self.hero.shoot(point);
                    return;
                }

                if(event.nativeEvent.shiftKey){
                    self.hero.turn(event.stageX, event.stageY);
                    return;
                }
                //console.log('heading to' ,event.stageX, event.stageY);
                self.hero.targetTo(game.coordinatesFromPoint(new geometry.Point(event.stageX, event.stageY)));
                self.paused = false;
            });
            //}}

            //initing time tracking
            this.time = 0;

            //init UI{{
            this.timeline = new createjs.Text("", "13px Ubuntu", "#f70");
            this.timeline.x = 10;
            this.timeline.y = 10;
            this.timeline.textBaseline = "top";
            this.timeline.textAlign = "left";
            this.stage.addChild(this.timeline);
            //}}

            createjs.Ticker.removeAllEventListeners();
            createjs.Ticker.addEventListener('tick', this.tick.bind(this));
            createjs.Ticker.timingMode = createjs.Ticker.RAF_SYNCHED;
            createjs.Ticker.setFPS(100);

        },
        tick: function tick(event){
            var self= this;
            if(!this.paused){
                ObjectManager.objects.forEach(function(el){

                    el.tick(event.delta);
                    if(el === self.hero)
                        return;

                    //check if objects are seen by the hero{{ 
                    //TODO: check only on nonstatic objects
                    el.g.visible = self.hero.vis.floorShape.hitTest(el.g.x, el.g.y); 
                    self.hero.vis.floorShape.visible = false;
                    //}}
                });
                self.time+=event.delta || 0;
            }

            this.timeline.text = Math.floor(this.time/1000) +':' + Math.floor((this.time % 1000)/100) + (this.paused?' [p]':'');

            if(this.visibleArea)
                this.stage.removeChild(this.visibleArea);
            this.visibleArea = this.stage.addChild(this.hero.vis.floorShape);

            this.stage.update();
        },
        restart: function restart(){ 
            this.loadLevel(this.level);
        },
        over: function over(){
            alert('the game is over');
            this.restart();
        }
    }); 

    helper.defineNS('Game', Game);
})();
