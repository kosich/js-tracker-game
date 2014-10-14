var DisappearAction = ActionState.extend({
    time:function(){
        return 1000;
    },
    test:function(){ 
        //if current can shoot
        return true;
    },
    execute:function(delta){
        if(!ActionState.prototype.execute.call(this, delta))
            return false;

        this.parent.g.alpha -= 0.1 * delta/1000;
        if(this.parent.g.alpha<=0){
            this.destroy();
            this.resolve();
        }
    },
    destroy: function(){
        ObjectManager.remove(this);
        game.stage.removeChild(this.g);
    }
});
