(function(){
    var test = ActionState.extend({
        time:function(){ 
            return Math.random()*1000;
        },
        test: function(){ 
            return !!this.options.target;
        },
        lastShot:null,
        shootRate: 1000,
        execute:function(delta){
            console.log(delta);

            if(!ActionState.prototype.execute.call(this, delta))
                return false;

            if(!delta)
                return false;

            if(!this.lastShot || this.lastShot-this.timeline<this.shootRate){
                this.lastShot=this.timeline; 
                console.log('BANG!');
                return true;
            }

            return false;
        }
    });

    helper.defineNS('AS.test', test);
})();
