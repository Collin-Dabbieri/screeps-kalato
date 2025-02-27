var roleBuilder = {

    /** @param {Creep} creep **/
    run: function(creep,roomStr=null) {
        
        
        if(creep.memory.building && creep.store[RESOURCE_ENERGY] == 0){
            creep.memory.building=false;
            creep.say('pick up');
            
        }
        if (!creep.memory.building && creep.store.getFreeCapacity() == 0){
            creep.memory.building=true;
            creep.say('🚧 build');
	    }
	    
        if(creep.room.name!=roomStr&&roomStr!=null){
            creep.moveTo(new RoomPosition(47, 16, roomStr),{visualizePathStyle: {stroke: '#ffffff'}})
        }
        else{
            if(creep.memory.building){
                var target = creep.pos.findClosestByPath(FIND_CONSTRUCTION_SITES);
                if(target){
                    if(creep.build(target) == ERR_NOT_IN_RANGE) {
                                creep.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'}});
                            }
                }
            }
            else{
                
    	        // Go pick up energy from container
                var targetContainer = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                                                filter: (structure) => {return structure.structureType == STRUCTURE_CONTAINER}
                });
                var targetStorage = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                                                filter: (structure) => {return structure.structureType == STRUCTURE_STORAGE}
                });
                if(targetStorage){
                    if(creep.withdraw(targetStorage, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(targetStorage, {visualizePathStyle: {stroke: '#ffffff'}});
                    }
                }
                else if(targetContainer){
                    if(creep.withdraw(targetContainer, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(targetContainer, {visualizePathStyle: {stroke: '#ffffff'}});
                    }
                }
                else{
                    // if there's no container in this room, try to pick up energy off the ground
                    var dropped = creep.pos.findClosestByRange(FIND_DROPPED_RESOURCES);
                    if(dropped) {
                        if(creep.pickup(dropped) == ERR_NOT_IN_RANGE) {
                            creep.moveTo(dropped);
                        }
                    }
                }
    
            }
        }
    }
};

module.exports = roleBuilder;