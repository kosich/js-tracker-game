'use strict';
var Deferred = $.Deferred; 

(function(){
    var ActionStateMachine = (function(){ 
        function ActionStateMachine(){
            this.actionStack = [];
        }
        ActionStateMachine.prototype = { 
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
             *  pushes or enqueques the action
             */
            add : function(action, immediate){
                if (immediate)
                    this.push(action);
                else
                    this.queque(action);

                action.promise.then(this.remove.bind(this, action));
            },
            remove : function(action){ 
                var index = this.actionStack.indexOf(action);
                if (index<0)
                    return false; //hasnt been removed
                this.actionStack.splice(index,1);
            },
            /*
             * returns current action and removes it from the stack
            pop : function(){
                if(!this.actionStack.length)
                    return;

                if(this.actionStack[this.actionStack.length-1].isInfinite)
                    return this.actionStack[this.actionStack.length-1];

                return this.actionStack.pop(); 
            },
             */
            get currentAction(){
                if(!this.actionStack.length)
                    return;

                return this.actionStack[this.actionStack.length-1];
            },
            tick : function(delta){
                /*
                if(!this.currentAction || (this.currentAction.succeed || this.currentAction.failed)){
                    this.currentAction = this.pop();
                }
                */

                if(!this.currentAction)
                    return;

                if (!this.currentAction.running)
                    this.currentAction.run();

                this.currentAction.execute(delta); 
            }
        };

        ActionStateMachine.prototype.constructor = ActionStateMachine;

        return ActionStateMachine;
    })(); 

    var ActionState =  Backbone.Model.extend({
        isInfinite : false,
        timeOfExecution : 0,
        running: false,
        initialize: function(parent, options){
            this.deferred = new Deferred();
            this.parent = parent;
            this.options = options;
            this.promise = this.deferred.promise();
            return this.promise;//idk, this, mustbe, is a mistake: initialize is called inside the constructor
        },
        //TODO implement run, resume, pause and cancel
        run : function(){
            this.running = true;
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
