var Deferred = $.Deferred;

(function(){
    var ActionStateMachine = (function(){ 
        return {
            actionStack : [],
            /* 
             * adds an action to the LAST position of the stack
             */
            queque : function(action){
                if (!(action instanceof ActionState)){
                    throw 'pass the proper action here'; 
                }
                this.actionStack.unshift(action); 
            },
            /* 
             * adds an action to the FIRST position of the stack
             */
            push : function(action){
                if (!(action instanceof ActionState)){
                    throw 'pass the proper action here'; 
                }
                this.actionStack.push(action); 
            },
            /*
             * returns current action and removes it from the stack
             */
            pop : function(){
                if(!this.actionStack.length)
                    return;

                if(this.actionStack[this.actionStack.length-1].isInfinite)
                    return this.actionStack[this.actionStack.length-1];

                return this.actionStack.pop(); 
            },
            tick : function(delta){
                if(!this.currentAction || (this.currentAction.succeed || this.currentAction.failed)){
                    this.currentAction = this.pop();
                }

                if(!this.currentAction)
                    return;

                this.currentAction.execute(delta); 
            }
        };
    })(); 

    var ActionState =  Backbone.Model.extend({
        isInfinite : false,
        timeOfExecution : 0,
        initialize: function(parent, options){
            this.deferred = new Deferred();
            this.parent = parent;
            this.options = options;
            return this.deferred.promise();
        },
        test : function(){
            throw 'not implemented';
            return false;
        },
        time : function(){
            throw 'not implemented';
            return Number.NEGATIVE_INFINITY;
        },
        execute : function(delta){
            if(this.failed){
                return false;
            }

            if(!this.test()){
                this.reject();
                return false;
            }

            this.timeOfExecution+=delta;
            return true;
        },
        reject: function(){
            this.failed=true;
            this.deferred.reject();
        },
        resolve: function(){
            this.succeed=true;
            this.deferred.resolve();
        }
    });

    //exports
    window.ActionState= ActionState;
    window.ActionStateMachine = ActionStateMachine;
})();
