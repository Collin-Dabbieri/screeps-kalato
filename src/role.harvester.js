var roleHarvester = {

    /** @param {Creep} creep **/
    run: function(creep) {
        
        if(creep.memory.transferring && creep.store[RESOURCE_ENERGY] == 0) {
            creep.memory.transferring = false;
            // All containers or storages with energy in them
            var container = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                                            filter: (structure) => {return (structure.structureType == STRUCTURE_CONTAINER ||
                                                                            structure.structureType == STRUCTURE_STORAGE) &&
                                                                            structure.store[RESOURCE_ENERGY]>0
                                            }
            });

            if(container!=null){
                creep.memory.containerId=container.id
            }
            var closestSource = creep.pos.findClosestByPath(FIND_SOURCES);
            if (closestSource!=null){
                creep.memory.closestSourceId=closestSource.id
            }
            creep.say('pick up');
	    }
	    if(!creep.memory.transferring && creep.store.getFreeCapacity() == 0) {
	        creep.memory.transferring = true;
            var target = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                                filter: (structure) => {
                                    return (structure.structureType == STRUCTURE_EXTENSION ||
                                            structure.structureType == STRUCTURE_SPAWN) &&
                                        structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
                                }
            });
            if(target!=null){
                creep.memory.targetId=target.id
            }
	        creep.say('⚡ transfer');
	    }

        if(creep.memory.transferring) {
            var target=Game.getObjectById(creep.memory.targetId)
            if(target){
                if(creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'}});
                }
                
            }
        }
        
	    else{
            var container=Game.getObjectById(creep.memory.containerId)
            if(container){
                // If there's a container or storage with energy, grab that
                if(creep.withdraw(container, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(container, {visualizePathStyle: {stroke: '#ffffff'}});
                }
            }
            else{
    	        // Manually Harvest
                var closestSource=Game.getObjectById(creep.memory.closestSourceId)
                if(creep.harvest(closestSource) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(closestSource,{visualizePathStyle: {stroke: '#ffffff'}})
                }
            }
            
        }
	}
};

module.exports = roleHarvester;