var create_spawn_dicts = {

    run: function() {
        // create dictionaries that tell respawn how to handle spawning of creeps
        // includes information like the body composition of creeps of different roles, number to spawn, etc
        // dictionaries will have role names as the keys. ex. Memory.nSpawnDict['harvester']=1
        // creates             
        //    Memory.nSpawnDict - vals are number to spawn for each role
        //    Memory.bodyDict - vals are lists with body composition for each role
        //    Memory.simpleRoles - list of roles that don't require additional logic and can just spawn if number of creeps with that role<nSpawnDict[role]
        //    Memory.minerRoles - list of role names for miners
        //    Memory.nMinersTarget - target number of miners
        nSources=Memory.room1['nSources'];
        var controller = Game.spawns['Spawn1'].room.controller;
        var rcl = controller.level

        if(typeof Memory.respawnDictsCreated=='undefined'){
            let nSpawnDict={};
            nSpawnDict['harvester']=1;
            nSpawnDict['builder']=2;
            nSpawnDict['upgrader']=1;
            let simpleRoles=['upgrader'];
            if(typeof containerCreated!='undefined'){
                for (let i = 0; i < nSources; i++) {
                    nSpawnDict['targetedcourier'+i.toString()]=1;
                    simpleRoles.push('targetedcourier'+i.toString());
                }
            }
            let minerRoles=[];
            let nMinersTarget=0;
            for (let i = 0; i < nSources; i++) {
                nSpawnDict['miner'+i.toString()]=1;
                minerRoles.push('miner'+i.toString());
                nMinersTarget+=1
            }


            let bodyDict={};
            bodyDict['harvester']=[WORK,CARRY,MOVE];
            bodyDict['builder']=[WORK,CARRY,MOVE];
            bodyDict['upgrader']=[WORK,CARRY,MOVE];
            if(typeof containerCreated!='undefined'){
                for (let i = 0; i < nSources; i++) {
                    bodyDict['targetedcourier'+i.toString()]=[WORK,CARRY,MOVE];
                }
            }
            for (let i = 0; i < nSources; i++) {
                bodyDict['miner'+i.toString()]=[WORK,CARRY,MOVE];
            }

            Memory.nSpawnDict=nSpawnDict;
            Memory.bodyDict=bodyDict;
            Memory.simpleRoles=simpleRoles;
            Memory.minerRoles=minerRoles;
            Memory.nMinersTarget=nMinersTarget;
            console.log(Object.keys(nSpawnDict))


            Memory.respawnDictsCreated=true
        }


    }
};

module.exports = create_spawn_dicts;