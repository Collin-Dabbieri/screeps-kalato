var roleRepairer = {

    /** @param {Creep} creep **/
    run: function(creep) {
        
        if(creep.memory.repairing && creep.store[RESOURCE_ENERGY] == 0) {
            creep.memory.repairing = false;
            creep.say('pick up');
	    }
	    if(!creep.memory.repairing && creep.store.getFreeCapacity() == 0) {
	        creep.memory.repairing = true;
	        creep.say('repair');
	    }
	    
	    if(creep.memory.repairing){
            const targets = creep.room.find(FIND_STRUCTURES, {
                filter: object => object.hits < object.hitsMax
            });
            
            // sort by fraction of remaining health
            targets.sort((a,b) => (a.hits/a.hitsMax) - (b.hits/b.hitsMax));
            
            if(targets.length > 0) {
                //const target = creep.pos.findClosestByPath(targets);
                if(creep.repair(targets[0]) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(targets[0],{visualizePathStyle: {stroke: '#ffffff'}});
                }
            }
            else{
                // If you have nothing to repair, move out of the way
                creep.moveTo(14,17,{visualizePathStyle: {stroke: '#ffffff'}})
            }
	    }
	    else{
	        // Go pick up energy from container
            var container = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                                            filter: (structure) => {return (structure.structureType == STRUCTURE_CONTAINER)}
            });
            if(creep.withdraw(container, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                creep.moveTo(container, {visualizePathStyle: {stroke: '#ffffff'}});
            }
	    }
    }
};

module.exports = roleRepairer;