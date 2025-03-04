var log_memory = {

    run: function() {

        if(Game.spawns['Spawn1']==null){
            Memory.initialLogCompleted==undefined
        }

        // log ids of sources and controllers to Memory ///////////////
        if (typeof Memory.initialLogCompleted=='undefined'){
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


            Memory.initialLogCompleted=true

            console.log(Object.keys(Memory.room1))
            console.log(Memory.room1['nSources'])
            console.log(Memory.room1['name'])
        }

        /////// delete unused creeps from memory /////////////////////////////////////////////////////////////
        for(var name in Memory.creeps) {
            if(!Game.creeps[name]) {
                delete Memory.creeps[name];
                console.log('Clearing non-existing creep memory:', name);
            }
        }
    }
};

module.exports = log_memory;