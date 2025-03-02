var helper_functions= require('helper_functions');
var roleHarvester = require('role.harvester');
var roleBuilder= require('role.builder');
var roleUpgrader= require('role.upgrader');
var roleTargetedCourier = require('role.targetedcourier')
var roleMiner = require('role.miner')

var home_rcl1 = {

    run: function() {
    	controller=Game.getObjectById(Memory.room1['controllerId']);
    	nSources=Memory.room1['nSources'];
    	room1=Game.rooms[Memory.room1['name']];
        var containers = room1.find(FIND_STRUCTURES, {
                                    filter: (structure) => {return structure.structureType == STRUCTURE_CONTAINER}
        });

	    // delete unused creeps from memory
	    for(var name in Memory.creeps) {
	        if(!Game.creeps[name]) {
	            delete Memory.creeps[name];
	            console.log('Clearing non-existing creep memory:', name);
	        }
	    }

	    // run creep logic
	    for(var name in Game.creeps) {
	        var creep = Game.creeps[name];
	        if(creep.memory.role == 'harvester') {
	            roleHarvester.run(creep);
	        }
			for (let i = 0; i < nSources; i++) {
		        if(creep.memory.role == 'miner'+i.toString()) {
		        	idSourceIdx='source'+i.toString()+'Id';
		        	idSource=Memory.room1[idSourceIdx]
		            roleMiner.run(creep,idSource);
		        }
			}
	        if(creep.memory.role == 'builder') {
	            roleBuilder.run(creep);
	        }
	        if(creep.memory.role == 'upgrader') {
	            roleUpgrader.run(creep);
	        }
			for (let i = 0; i < nSources; i++) {
		        if(creep.memory.role == 'targetedcourier'+i.toString()) {
		        	idFrom=Memory.room1['source'+i.toString()+'ContainerId'];
		        	idTo=Memory.room1['controllerContainerId']
		            roleTargetedCourier.run(creep,idFrom,idTo);
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


    	////// Build containers adjacent to sources and controller ///////////////////////////////////////
    	if(typeof containerConstructionCreated=='undefined'){
    		// build source containers
			for (let i = 0; i < nSources; i++) {
				idString='source'+i.toString()+'Id';
				source=Game.getObjectById(Memory.room1[idString]);
				free_spot_pos=helper_functions.get_adjacent_free_spot(source.pos);
				room1.createConstructionSite(free_spot_pos,STRUCTURE_CONTAINER);
			}

			// build controller container
			free_spot_pos=helper_functions.get_adjacent_free_spot(controller.pos);
			room1.createConstructionSite(free_spot_pos,STRUCTURE_CONTAINER);

			let containerConstructionCreated=true;
		}

		/////// Once the containers are created, log the IDs //////////////////////////////////////////////
		if(typeof containerCreated=='undefined'){
			if(containers.length==nSources+1){
				// containers are built, but we haven't logged their IDs yet
				// get the objects for each source and controller and find the closest container to each, 
				// then log that container's ID

				//get the object for the container closest to each source
				for (let i = 0; i < nSources; i++) {
					idSourceStr='source'+i.toString()+'Id';
					source=Game.getObjectById(Memory.room1[idSourceStr]);
		            var closestContainer = source.pos.findClosestByPath(FIND_STRUCTURES, {
		                                            filter: (structure) => {return structure.structureType == STRUCTURE_CONTAINER}
		            });
		            idContainerStr='source'+i.toString()+'ContainerId';
		            Memory.room1[idContainerStr]=closestContainer.id
				}
				//get the object for the container closest to the controller
	            var closestContainer = controller.pos.findClosestByPath(FIND_STRUCTURES, {
	                                            filter: (structure) => {return structure.structureType == STRUCTURE_CONTAINER}
	            });
	            idContainerStr='controllerContainerId'
	            Memory.room1[idContainerStr]=closestContainer.id

				let containerCreated=true
			}
		}

    	////// Handle respawns ////////////////////////////////////////////////////////////
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

        var harvesters = _.filter(Game.creeps, (creep) => creep.memory.role == 'harvester');
        nMiners=0
        for(const roleStr of minerRoles){
            var roleObject = _.filter(Game.creeps, (creep) => creep.memory.role == roleStr);
            nMiners+=roleObject.length
        }

        // always spawn harvesters first
        if(harvesters.length < nSpawnDict['harvester']) {
            var newName = 'harvester' + Game.time;
            console.log('Spawning new ' + newName);
            Game.spawns['Spawn1'].spawnCreep(bodyDict['harvester'], newName, 
                {memory: {role: 'harvester'}});
        }
        // always spawn miners second
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
        // if enough miners and harvesters are spawned, spawn other stuff
        else{
	        var builders = _.filter(Game.creeps, (creep) => creep.memory.role == 'builder');
	        //Builders
	        //console.log('Builders: ' + builders.length);
	        const_site=Game.spawns['Spawn1'].room.find(FIND_CONSTRUCTION_SITES);
	        if(const_site.length>0){
	            if(builders.length < nSpawnDict['builder']) {
	                var newName = 'Builder' + Game.time;
	                console.log('Spawning new builder: ' + newName);
	                Game.spawns['Spawn1'].spawnCreep(bodyDict['builder'], newName, 
	                    {memory: {role: 'builder'}});        
	            }
	        }
	        // handle respawns for all roles that don't require additional logic
            for(const roleStr of simpleRoles){
                var roleObject = _.filter(Game.creeps, (creep) => creep.memory.role == roleStr);
                if(roleObject.length < nSpawnDict[roleStr]) {
                    var newName = roleStr + Game.time;
                    console.log('Spawning new ' + newName);
                    Game.spawns['Spawn1'].spawnCreep(bodyDict[roleStr], newName, 
                        {memory: {role: roleStr}});
                }
            }

    	}

    }
};

module.exports = home_rcl1;