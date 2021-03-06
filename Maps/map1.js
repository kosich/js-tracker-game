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
            id : "Guardian 1",
            type : "O.Guardian",
            coordinates : [1, 3],
            walkingCoordinates : [[0,0], [1,1], [9,1], [1,10], [0,9]],
            has: [{
                id : "Exit key",
                type : "O.Key",
                opens : "Exit"
            }]
        },
        /*
        {
            id : "Guardian 2",
            type : "O.Guardian",
            speed : 0.5,
            turningSpeed : Math.PI/2,
            coordinates : [7, 1],
            walkingCoordinates : [[1,1], [2,2], [5,6], [10,10], [0,9]]
        },
        {
            id : "Guardian 3",
            type : "O.Guardian",
            speed : 1,
            coordinates : [3, 1],
            walkingCoordinates : [[2,2], [6,6], [0,6], [10,10], [0,9]]
        },
        */
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
