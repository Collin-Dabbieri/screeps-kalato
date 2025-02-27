
var roleTargetedCourier = {

    /** @param {Creep} creep **/
    run: function(creep,target) {

        if(creep.memory.transferring && creep.store[RESOURCE_ENERGY] == 0) {
            creep.memory.transferring = false;
            creep.say('pick up');
	    }
	    if(!creep.memory.transferring && creep.store.getFreeCapacity() == 0) {
	        creep.memory.transferring = true;
	        creep.say('drop off');
	    }
	    
	    if(creep.memory.transferring){
	    	// transfer energy to target
			if(creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                creep.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'}});
            }

	    }
	    else{
	    	// if you're empty, grab energy from closest storage or container
            var container = creep.room.controller.pos.findClosestByPath(FIND_STRUCTURES, {
                                            filter: (structure) => {return (structure.structureType == STRUCTURE_CONTAINER ||
                                                                            structure.structureType == STRUCTURE_STORAGE)
                                                                    }
            });
            if(creep.withdraw(container, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                creep.moveTo(container, {visualizePathStyle: {stroke: '#ffffff'}});
            }

	    }


    }
};

module.exports = roleTargetedCourier;