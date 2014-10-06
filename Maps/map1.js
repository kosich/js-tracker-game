(function(){
    var maps = helper.defineNS('maps', []);

    var map = {
        objects: [{
            id : "Hero",
            type : "O.Hero",
            coordinates : [1, 1],
            has: [{
                type : "Pistol"
            }]
        },
        {
            id : "Guardian",
            type : "O.Guardian",
            coordinates : [1, 5],
            walkingCoordinates : [[1,1], [7,1], [7,7], [1,7]],
            has: [{
                id : "Exit key",
                type : "O.Key",
                opens : "Exit"
            }]
        }/*,         
        {
            id : "Exit",
            type : "O.Exit",
            coordinates: [5, 5]
        }*/],
        field: [
            [0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0],
            [1,1,1,1,1,1,1,0],
            [0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0],
        ]
    };

    maps.push(map);

})();
