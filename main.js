(function(window, document, undefined){ 
    'use strict';

    document.addEventListener("DOMContentLoaded", function(){ 
        document.getElementById('gamePane').setAttribute('width',300);
        document.getElementById('gamePane').setAttribute('height',300);

        var game = window.game = new Game("gamePane");
        game.loadLevel(Levels[0]);
        game.paused = false;

        document.getElementById('pause').addEventListener('click', function(){
            game.paused = !game.paused;
        });
        document.getElementById('restart').addEventListener('click', function(){
            game.loadLevel(Levels[0]);
        });
    });


    (function(){ 
        helper.defineNS('pathfinder', new PF.BreadthFirstFinder({
            allowDiagonal: true,
            dontCrossCorners: true
        }));
    })();

    window.debugging = true;
    window.bunchLogging = true;
    window.bunchLoggingFreq = 1000;

    var log = window.console.log.bind(window.console);
    var logStack = [];
    window.console.log = function(){
        if(!window.debugging)
            return;

        if (!window.bunchLogging)
            log.apply(window.console, arguments);

        if (!logStack.length)
            window.setTimeout(function(){
                log('logging ', logStack.length, ' items');
                //log every msg stacked
                log.apply(window.console, logStack); 
                logStack.splice(0);//clear log stack 
            }, window.bunchLoggingFreq);
        logStack = logStack.concat(Array.prototype.splice.call(arguments, 0));
        logStack.push('\r\n');

    };


})(window, document);
