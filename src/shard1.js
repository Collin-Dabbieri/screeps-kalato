var home_rcl1 = require('home_rcl1');
//var home_rcl2 = require('home_rcl2');
var shard1 = {

    run: function() {

        // log ids of sources and controllers to Memory ///////////////
        if (typeof initialLogCompleted=='undefined'){
            var controller = Game.spawns['Spawn1'].room.controller;
            Memory.room1={};
            Memory.room1['controllerId']=controller.id;
            var sources = Game.spawns['Spawn1'].room.find(FIND_SOURCES);

            let count=0;
            for(source of sources){
                idString='source'+count.toString()+'Id';
                Memory.room1[idString]=source.id;
                count+=1;
            }
            Memory.room1['nSources']=count
            Memory.room1['name']=Game.spawns['Spawn1'].room.name


            initialLogCompleted=true
        }

        // run home management/spawning script based on room control level
        var controller = Game.spawns['Spawn1'].room.controller;
        var rcl = controller.level
        if(rcl==1){
            home_rcl1.run();
        }
        /*
        else if(rcl==2){
            home_rcl2.run();
        }
        */
        //////////////////////////////////////////////////////////////////


    }
};

module.exports = shard1;