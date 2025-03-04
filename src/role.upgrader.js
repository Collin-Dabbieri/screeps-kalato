var roleUpgrader = {

    /** @param {Creep} creep **/
    run: function(creep) {
        
        if(creep.memory.transferring && creep.store[RESOURCE_ENERGY] == 0) {
            creep.memory.transferring = false;
            var target = creep.room.controller.pos.findClosestByPath(FIND_STRUCTURES, {
                                            filter: (structure) => {return (structure.structureType == STRUCTURE_CONTAINER ||
                                                                            structure.structureType == STRUCTURE_STORAGE)
                                                                    }
            });
            if(target!=null){
                creep.memory.targetId=target.id
            }
            //creep.say('pick up');
	    }
	    if(!creep.memory.transferring && creep.store.getFreeCapacity() == 0) {
	        creep.memory.transferring = true;
	        //creep.say('⚡ transfer');
	    }
	    
	    if(creep.memory.transferring){
            var target=Game.getObjectById(creep.memory.targetId)
            //repair container if it needs repairing
            if(target&&target.hits<target.hitsMax){
                if(creep.repair(target) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(target);
                }
            }
	        // go Upgrade controller
            else if(creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                creep.moveTo(creep.room.controller, {visualizePathStyle: {stroke: '#ffffff'}});
            }
	    }
	    else{
            var target=Game.getObjectById(creep.memory.targetId)
            if(target){
    	        // Go pick up energy from container
                if(creep.withdraw(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'}});
                }
            }
            else{
                // if there are no containers, try to pick up energy off the ground
                var dropped = creep.pos.findClosestByRange(FIND_DROPPED_RESOURCES);
                if(dropped) {
                    if(creep.pickup(dropped) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(dropped, {visualizePathStyle: {stroke: '#ffffff'}});
                    }
                }
            }
	    }
    }
};

module.exports = roleUpgrader;