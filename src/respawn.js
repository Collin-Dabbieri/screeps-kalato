var create_spawn_dicts = require('create_spawn_dicts');
var respawn = {

    run: function() {

        // handles creation of dictionaries that dictate how to spawn creeps
        create_spawn_dicts.run();
        
        // check number of miners already spawned, minerRoles can be 'miner0','miner1',...
        nMiners=0
        for(const roleStr of Memory.minerRoles){
            var roleObject = _.filter(Game.creeps, (creep) => creep.memory.role == roleStr);
            nMiners+=roleObject.length;
        }

        // always spawn harvesters first
        var harvesters = _.filter(Game.creeps, (creep) => creep.memory.role == 'harvester');
        if(harvesters.length < Memory.nSpawnDict['harvester']) {
            var newName = 'harvester' + Game.time;
            console.log('Spawning new ' + newName);
            Game.spawns['Spawn1'].spawnCreep(Memory.bodyDict['harvester'], newName, 
                {memory: {role: 'harvester'}});
        }
        // always spawn miners second
        else if(nMiners<Memory.nMinersTarget){
            for(const roleStr of Memory.minerRoles){
                var roleObject = _.filter(Game.creeps, (creep) => creep.memory.role == roleStr);
                if(roleObject.length < Memory.nSpawnDict[roleStr]) {
                    var newName = roleStr + Game.time;
                    console.log('Spawning new ' + newName);
                    Game.spawns['Spawn1'].spawnCreep(Memory.bodyDict[roleStr], newName, 
                        {memory: {role: roleStr}});
                }
            }
        }
        // if enough miners and harvesters are spawned, spawn other stuff
        else{
            var builders = _.filter(Game.creeps, (creep) => creep.memory.role == 'builder');
            //Builders
            //console.log('Builders: ' + builders.length);
            const_site=Game.spawns['Spawn1'].room.find(FIND_CONSTRUCTION_SITES);
            if(const_site.length>0){
                if(builders.length < Memory.nSpawnDict['builder']) {
                    var newName = 'Builder' + Game.time;
                    console.log('Spawning new builder: ' + newName);
                    Game.spawns['Spawn1'].spawnCreep(Memory.bodyDict['builder'], newName, 
                        {memory: {role: 'builder'}});        
                }
            }
            // handle respawns for all roles that don't require additional logic
            for(const roleStr of Memory.simpleRoles){
                var roleObject = _.filter(Game.creeps, (creep) => creep.memory.role == roleStr);
                if(roleObject.length < Memory.nSpawnDict[roleStr]) {
                    var newName = roleStr + Game.time;
                    console.log('Spawning new ' + newName);
                    Game.spawns['Spawn1'].spawnCreep(Memory.bodyDict[roleStr], newName, 
                        {memory: {role: roleStr}});
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