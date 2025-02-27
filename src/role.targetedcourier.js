var roleTargetedCourier = {

    /** @param {Creep} creep **/
    run: function(creep,idFrom,idTo,roomStrFrom=null,roomStrTo=null) {
        
        const storageBuffer=0 //only withdraw if storageBuffer or more would be left over after
        
        var containerFrom=Game.getObjectById(idFrom)
        var containerTo=Game.getObjectById(idTo)

        
        if(creep.memory.transferring && creep.store[RESOURCE_ENERGY] == 0) {
            creep.memory.transferring = false;
            creep.say('pick up');
	    }
	    if(!creep.memory.transferring && creep.store.getFreeCapacity() == 0) {
	        creep.memory.transferring = true;
	        creep.say('drop off');
	    }
	    
	    if(creep.memory.transferring){
	        
	        if(roomStrTo!=null){
    	        if(creep.room.name!=roomStrTo){
    	            creep.moveTo(new RoomPosition(21, 21, roomStrTo),{visualizePathStyle: {stroke: '#ffffff'}})
    	        }
	        }
	        
	        //If you're close to a road that can be repaired, repair it
            const toRepair = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                                filter: (structure) => {
                                    return (structure.structureType == STRUCTURE_ROAD ||
                                            structure.structureType == STRUCTURE_CONTAINER)&&
                                           structure.hits<structure.hitsMax
                                }
            });
            if(toRepair){
                if(creep.repair(toRepair) == ERR_NOT_IN_RANGE) {
                    // if there's no repairable in range, keep moving toward drop off
                    if(creep.transfer(containerTo, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(containerTo, {visualizePathStyle: {stroke: '#ffffff'}});
                    }
                }
            }
            //transfer to container
            else if(creep.transfer(containerTo, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                creep.moveTo(containerTo, {visualizePathStyle: {stroke: '#ffffff'}});
            }
	    }
	    else{
	        //!creep.memory.transferring
	        if(roomStrFrom!=null&&creep.room.name!=roomStrFrom){
    	            creep.moveTo(new RoomPosition(21, 21, roomStrFrom),{visualizePathStyle: {stroke: '#ffffff'}})
	        }

            //withdraw from container
            else if(containerFrom&&containerFrom.store[RESOURCE_ENERGY]>creep.store.getCapacity()+storageBuffer){
                if(creep.withdraw(containerFrom, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(containerFrom, {visualizePathStyle: {stroke: '#ffffff'}});
                }
            }
	    }
        
    }
};

module.exports = roleTargetedCourier;