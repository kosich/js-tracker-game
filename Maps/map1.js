(function(){
    var maps = helper.defineNS('maps', []);

    var map = {
        objects: [{
            id : "Hero",
            type : "O.Hero",
            coordinates : [4, 3],
            has: [{
                type : "Pistol"
            }]
        },
        {
            id : "Guardian",
            type : "O.Guardian",
            coordinates : [1, 3],
            walkingCoordinates : [[0,0], [7,1], [5,6], [10,10], [0,9]],
            has: [{
                id : "Exit key",
                type : "O.Key",
                opens : "Exit"
            }]
        },
        {
            id : "Exit",
            type : "O.Exit",
            coordinates: [5, 5]
        }],
        field: [
            [0,0,0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0,0,0],
            [0,0,1,0,0,0,0,0,0,0,0,0],
            [0,0,1,0,0,0,0,0,0,0,0,0],
            [0,0,1,0,0,0,0,0,0,0,0,0],
            [0,0,1,0,0,0,0,0,0,0,0,0],
            [0,0,1,0,0,0,0,0,0,0,0,0],
            [0,0,1,0,0,0,0,0,0,0,0,0],
            [0,0,1,1,1,1,1,1,1,1,0,0],
            [0,0,0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0,0,0],
        ]
    };

    maps.push(map);

})();
