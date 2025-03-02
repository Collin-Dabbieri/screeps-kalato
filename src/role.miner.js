var roleMiner = {

    /** @param {Creep} creep **/
    run: function(creep,id,roomStr=null) {
        
        var mineTarget=Game.getObjectById(id)
        
        if(creep.memory.transferring && creep.store[RESOURCE_ENERGY] == 0) {
            creep.memory.transferring = false;
            //pick up any dropped resources caused by overflow
            //target=creep.pos.findClosestByRange(FIND_DROPPED_RESOURCES);
            //creep.pickup(target)
            //creep.say('🔄 harvest');
	    }
	    if(!creep.memory.transferring && creep.store.getFreeCapacity() == 0) {
	        creep.memory.transferring = true;
            // find closest container
            var target = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                                            filter: (structure) => {return (structure.structureType == STRUCTURE_CONTAINER)}
            });
            if(target!=null){
                creep.memory.targetId=target.id
            }
	        //creep.say('⚡ transfer');
	    }
	    
        if(creep.memory.transferring){
            target=Game.getObjectById(creep.memory.targetId)

            if(target==null){
                // if there's no container in this room, just drop the energy
                creep.drop(RESOURCE_ENERGY)
            }
            //repair container if it needs repairing
            else if(target.hits<target.hitsMax){
                if(creep.repair(target) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(target);
                }
            }
            else{
                if(creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(target);
                }
            }
        }
        else{  // mining
            if(mineTarget == null){
                //if the creep is not in the room, Game can't access it, will return null
                creep.moveTo(new RoomPosition(21, 21, roomStr),{visualizePathStyle: {stroke: '#ffffff'}})
            }
            else{
                //mine assigned node
                if(creep.harvest(mineTarget) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(mineTarget,{visualizePathStyle: {stroke: '#ffffff'}})
    
                }
            }
        }

        
    }
};

module.exports = roleMiner;