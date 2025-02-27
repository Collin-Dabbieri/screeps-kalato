var roleHarvester = {

    /** @param {Creep} creep **/
    run: function(creep) {
        
        if(creep.memory.transferring && creep.store[RESOURCE_ENERGY] == 0) {
            creep.memory.transferring = false;
            creep.say('pick up');
	    }
	    if(!creep.memory.transferring && creep.store.getFreeCapacity() == 0) {
	        creep.memory.transferring = true;
	        creep.say('⚡ transfer');
	    }

        if(creep.memory.transferring) {
            const target = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                                filter: (structure) => {
                                    return (structure.structureType == STRUCTURE_EXTENSION ||
                                            structure.structureType == STRUCTURE_SPAWN) &&
                                        structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
                                }
            });
            if(target){
                if(creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'}});
                }
                
            }
            else{
                // If you have nothing to transfer to, get out of the way
                creep.moveTo(2,43, {visualizePathStyle: {stroke: '#ffffff'}});
            }
                        

        }
        
	    else{
	        // All containers or storages with energy in them
            var container = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                                            filter: (structure) => {return (structure.structureType == STRUCTURE_CONTAINER ||
                                                                            structure.structureType == STRUCTURE_STORAGE) &&
                                                                            structure.store[RESOURCE_ENERGY]>0
                                            }
            });
            if(container){
                // If there's a container or storage with energy, grab that
                if(creep.withdraw(container, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(container, {visualizePathStyle: {stroke: '#ffffff'}});
                }
            }
            else{
    	        // Manually Harvest
                const target = creep.pos.findClosestByPath(FIND_SOURCES);
                if(creep.harvest(target) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(target,{visualizePathStyle: {stroke: '#ffffff'}})
                }
            }
            
            
            
            
        }
	}
};

module.exports = roleHarvester;