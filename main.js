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

    window.debugging = 1;

    if(!window.debugging)
        window.console= { log: function(){} };


})(window, document);
