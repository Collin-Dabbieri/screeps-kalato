var tower = {

    run: function(id) {
        
        var wall_hp_min=200000
        var rampart_hp_min=200000
 
        var targettower = Game.getObjectById(id);
        // create a global variable to be referenced in main
        refill_tower=targettower
        if(tower) {
            
            if(targettower.store[RESOURCE_ENERGY]<1000){
                var energycouriers = _.filter(Game.creeps, (creep) => creep.memory.role == 'energycourier');
            
                if(energycouriers.length < 1) {
                
                    // Spawn an energy courier
                    var newName = 'TowerCourier' + Game.time;
                    console.log('Spawning new Courier: ' + newName);
                    Game.spawns['Spawn1'].spawnCreep([WORK,WORK,CARRY,CARRY,MOVE,MOVE], newName, 
                        {memory: {role: 'energycourier'}});  
                
                }
            }
        
            var closestHostile = targettower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
            var closestDamagedStructure = targettower.pos.findClosestByRange(FIND_STRUCTURES, {
                filter: (structure) => {
                    return structure.hits < structure.hitsMax &&
                           structure.structureType != STRUCTURE_WALL &&
                           structure.structureType != STRUCTURE_RAMPART;
                }
            });
            var wallToRepair = targettower.room.find(FIND_STRUCTURES, {
                                filter: (structure) => {
                                    return structure.structureType == STRUCTURE_WALL &&
                                            structure.hits < wall_hp_min;
                                }
            });
            wallToRepair.sort((a,b) => a.hits-b.hits);
            var rampartToRepair = targettower.pos.findClosestByRange(FIND_STRUCTURES, {
                                filter: (structure) => {
                                    return  structure.structureType == STRUCTURE_RAMPART &&
                                            structure.hits < rampart_hp_min;
                                }
            });
            if(closestHostile) {
                targettower.attack(closestHostile);
            }
            
            else if(closestDamagedStructure) {
                    targettower.repair(closestDamagedStructure);
            }
            else if(rampartToRepair){
                targettower.repair(rampartToRepair);
            }
            else if(wallToRepair[0] && targettower.store[RESOURCE_ENERGY]>700){
                targettower.repair(wallToRepair[0]);
            }
        }
    }
};

module.exports = tower;