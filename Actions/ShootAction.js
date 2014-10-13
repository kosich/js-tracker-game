var ShootAction = ActionState.extend({
    time:function(){
        return 1000;
    },
    test:function(){ 
        //if current can shoot
        return true;
    },
    shootRate: 100,
    execute:function(delta){
        if(!ActionState.prototype.execute.call(this, delta))
            return false;

        //todo: update percentage
        this.shootRate-=delta;

        if(this.shootRate<=0){

            //create a bullet
            this.resolve(); 

            console.log('BANG!');
            this.parent.gun.shoot(this.options.target, this.parent);

            return true;
        }

        return false;
    }
});
