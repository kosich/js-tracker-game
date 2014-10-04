(function(){
    'use strict';

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
        drawMap: function drawMap (level){
            //clearing
            level.stage.removeAllChildren();
            level.stage.clear();
            this.guardians=[];

            this.pane = new createjs.Shape();
            this.pane.graphics.beginFill('#9af').drawRect(0,0, level.stageW, level.stageH);
            level.stage.addChild(this.pane);

            for(var i =0; i<level.width; i++){
                var subarray = level.field[i];
                for(var j=0; j< level.height; j++) {
                    if (subarray[j]){
                        var box = new createjs.Shape();
                        box.graphics.beginFill('#333').drawRect(0, 0, level.cellW, level.cellH);
                        box.x = j*level.cellW;
                        box.y = i*level.cellH;
                        level.stage.addChild(box);
                    }
                }
            }

            var box = new createjs.Shape();
            box.graphics.beginFill('#dfd').drawRect(0, 0, level.cellW, level.cellH);
            box.x = level.cellW*level.exitPoint[0];
            box.y = level.cellH*level.exitPoint[1];
            level.stage.addChild(box);

            for(i=0;i<level.guardians.length;i++){
                var g = new O.Guardian();
                g.init(this, level.stage, level, '#f20', level.guardians[i].ma[0][0], level.guardians[i].ma[0][1]);
                g.set('movementArray', level.guardians[i].ma);
                g.name = 'guardian';
                this.guardians.push(g);
            } 
        }, 
        initialize: function(gameCanvas){ 
            var stage = new createjs.Stage(gameCanvas);
            this.stage = stage;
        },
        loadLevel: function loadLevel(level){ 
            var self = this;
            self.level = level;
            level.init(self.stage);
            self.drawMap(self.level);
            self.paused= true;

            (function loadFOV(){
                self.fov = self.fov || new FOV();
                var walls = [];

                self.level.field.forEach(function(el, y, arr){
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

            self.hero = new O.Hero();
            self.hero.name = 'Hero';
            self.hero.init(self, self.stage, self.level, '#2f6', self.level.spawnPoint[0], self.level.spawnPoint[1]);

            self.pane.on('click', function(event){
                var point = new geometry.Point(event.stageX, event.stageY);
                if(event.nativeEvent.ctrlKey){
                    self.hero.shoot(point);
                } else {
                    console.log('heading to' ,event.stageX, event.stageY);
                    self.hero.targetTo(event.stageX, event.stageY);
                    self.paused = false;
                }
            });

            self.hero.on(Events.Move.attarget, function(){
                self.paused = true;
                console.log('im at target'); 
            }); 

            self.hero.on(Events.Action.Died, function(){
                //todo: this.restart
                game.loadLevel(Levels[0]);
            }); 

            self.level.on(Events.Sound.Basic, function(sender, x ,y){
                //console.log('sounds at', x, y , 'sender:', sender); 
            });

            self.guardians.forEach(function(e, i, arr){
                e.g.on('click', function(event){
                    var point = new geometry.Point(event.stageX, event.stageY);
 
                    self.hero.shoot(point, e);
                });
            });

            self.OM = ObjectManager;

            self.timeline = new createjs.Text("", "13px Ubuntu", "#ff7700");
            self.timeline.x = 10;
            self.timeline.y = 10;
            self.timeline.textBaseline = "top";
            self.timeline.textAlign = "left";
            self.stage.addChild(self.timeline);

            //this.paused=false;
            //this.tick(300);
            //return;

            createjs.Ticker.removeAllEventListeners();
            createjs.Ticker.addEventListener('tick', self.tick.bind(self));
            createjs.Ticker.timingMode = createjs.Ticker.RAF_SYNCHED;
            createjs.Ticker.setFPS(60);
        },
        tick: function tick(event){
            var self= this;
            if(!this.paused){
                this.hero.tick(event.delta);

                this.guardians.forEach(function(e, i, arr){
                    e.tick(event.delta); 
                    //TODO: fucking rendering stuff. moveout!!!
                    if(self.guardiansVisibleAreas[i])
                        self.stage.removeChild(self.guardiansVisibleAreas[i]);
                });

                this.OM.objects && this.OM.objects.forEach(function(el){
                    if(el && el.tick)
                        el.tick(event.delta);
                });

                this.guardians = this.guardians.filter(function(e, i, arr){
                    return e.isAlive;
                });

                this.guardians.forEach(function(e, i, arr){
                    if(!self.hero.vis.floorShape.hitTest(e.g.x, e.g.y)){
                        e.g.visible= false;
                        return;
                    } else{
                        e.g.visible= true;
                        self.guardiansVisibleAreas[i] = self.stage.addChild(e.vis.floorShape);
                        self.guardiansVisibleAreas[i].visible=false;
                    }
                });

                if(this.visibleArea)
                    this.stage.removeChild(this.visibleArea);
                this.visibleArea = this.stage.addChild(this.hero.vis.floorShape);

                self.hero.vis.floorShape.visible=false;

                this.time+=event.delta;
                this.timeline.text = Math.floor(this.time/1000);

                if(_.isEqual(this.level.pointFromCoordinates(this.hero.g.x, this.hero.g.y), this.level.exitPoint))
                    this.loadLevel(Levels[0]);
            }
            this.stage.mask = self.hero.vis.floorShape;
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
