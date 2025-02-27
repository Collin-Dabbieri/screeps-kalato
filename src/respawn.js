var respawn = {

    run: function() {
        
        let roles=['targetedcourier1','targetedcourier2','harvester','upgrader','miner0','miner1','minertravel1','buildertravel1','couriertravel1']
        let minerRoles=['miner0','miner1','minertravel1']
        harvesterCost=400
        
        let nSpawnDict = {};
        // key is role name, value is number to spawn
        nSpawnDict['targetedcourier1']=1
        nSpawnDict['targetedcourier2']=1
        nSpawnDict['harvester']=1
        nSpawnDict['upgrader']=1
        // if our storage is more than half full, spawn an extra upgrader
        var storage = Game.spawns['Spawn1'].room.find(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return structure.structureType == STRUCTURE_STORAGE
                    }
        });
        if(storage[0].store[RESOURCE_ENERGY]>250000){
            nSpawnDict['upgrader']+=1
        }
        
        nSpawnDict['miner0']=1
        nSpawnDict['miner1']=1
        nSpawnDict['minertravel1']=1
        nSpawnDict['buildertravel1']=0
        nSpawnDict['couriertravel1']=1
        var nSpawnBuilder=1
        nMinersTarget=0
        for(role of minerRoles){
            nMinersTarget+=nSpawnDict[role]
        }
        
        let bodyDict = {};
        // key is role name, value is list of body parts
        bodyDict['targetedcourier1']=[CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE]
        bodyDict['targetedcourier2']=[CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE]
        bodyDict['couriertravel1']=[WORK,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE]
        bodyDict['harvester']=[WORK,CARRY,CARRY,CARRY,MOVE,MOVE]
        //bodyDict['harvester']=[WORK,CARRY,MOVE]
        bodyDict['upgrader']=[WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,CARRY,MOVE,MOVE]
        bodyDict['miner0']=[WORK,WORK,WORK,WORK,WORK,WORK,CARRY,MOVE]
        bodyDict['miner1']=[WORK,WORK,WORK,WORK,WORK,WORK,CARRY,MOVE]
        bodyDict['minertravel1']=[WORK,WORK,WORK,WORK,WORK,CARRY,MOVE,MOVE,MOVE]
        bodyDict['buildertravel1']=[WORK,WORK,CARRY,CARRY,MOVE,MOVE]

        
        for(var name in Memory.creeps) {
            if(!Game.creeps[name]) {
                delete Memory.creeps[name];
                console.log('Clearing non-existing creep memory:', name);
            }
        }
        
        nMiners=0
        for(const roleStr of minerRoles){
            var roleObject = _.filter(Game.creeps, (creep) => creep.memory.role == roleStr);
            nMiners+=roleObject.length
        }
            
        // If you don't have spawner energy and you can't spawn a normal harvester, spawn an emergency baby harvester
        var spawners = Game.spawns['Spawn1'].room.find(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return (structure.structureType == STRUCTURE_EXTENSION ||
                                structure.structureType == STRUCTURE_SPAWN);
                    }
        });
        let totalSpawnerEnergy=0
        for (spawner of spawners){
            totalSpawnerEnergy+=spawner.store[RESOURCE_ENERGY]
        }
        var harvesters = _.filter(Game.creeps, (creep) => creep.memory.role == 'harvester');
        if(totalSpawnerEnergy<harvesterCost&&harvesters.length<1){
            //Spawn an emergency harvester
            var newName = 'e-harvester' + Game.time;
            console.log('Spawning new ' + newName);
            Game.spawns['Spawn1'].spawnCreep([WORK,CARRY,MOVE], newName, 
                {memory: {role: 'harvester'}}); 
        }
        //always spawn harvesters first
        var harvesters = _.filter(Game.creeps, (creep) => creep.memory.role == 'harvester');
        if(harvesters.length < nSpawnDict['harvester']) {
            var newName = 'harvester' + Game.time;
            console.log('Spawning new ' + newName);
            Game.spawns['Spawn1'].spawnCreep(bodyDict['harvester'], newName, 
                {memory: {role: 'harvester'}});
        }
        
        //always spawn miners second
        
        else if(nMiners<nMinersTarget){
            for(const roleStr of minerRoles){
                var roleObject = _.filter(Game.creeps, (creep) => creep.memory.role == roleStr);
                if(roleObject.length < nSpawnDict[roleStr]) {
                    var newName = roleStr + Game.time;
                    console.log('Spawning new ' + newName);
                    Game.spawns['Spawn1'].spawnCreep(bodyDict[roleStr], newName, 
                        {memory: {role: roleStr}});
                }
            }
        }
        // handle spawning for all roles that don't have special conditions
        else{
            for(const roleStr of roles){
                var roleObject = _.filter(Game.creeps, (creep) => creep.memory.role == roleStr);
                if(roleObject.length < nSpawnDict[roleStr]) {
                    var newName = roleStr + Game.time;
                    console.log('Spawning new ' + newName);
                    Game.spawns['Spawn1'].spawnCreep(bodyDict[roleStr], newName, 
                        {memory: {role: roleStr}});
                }
            }
            
            // Builders
            var builders = _.filter(Game.creeps, (creep) => creep.memory.role == 'builder');
            //console.log('Builders: ' + builders.length);
            const_site=Game.spawns['Spawn1'].room.find(FIND_CONSTRUCTION_SITES);
            if(const_site.length>0){
                if(builders.length < nSpawnBuilder) {
                    var newName = 'Builder' + Game.time;
                    console.log('Spawning new builder: ' + newName);
                    Game.spawns['Spawn1'].spawnCreep([WORK,WORK,CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE], newName, 
                        {memory: {role: 'builder'}});        
                }
            }
        }
        

        // This just has the spawn say it's building something
        if(Game.spawns['Spawn1'].spawning) { 
            var spawningCreep = Game.creeps[Game.spawns['Spawn1'].spawning.name];
            Game.spawns['Spawn1'].room.visual.text(
                '🛠️' + spawningCreep.memory.role,
                Game.spawns['Spawn1'].pos.x + 1, 
                Game.spawns['Spawn1'].pos.y, 
                {align: 'left', opacity: 0.8});
        }

        
    }
};

module.exports = respawn;