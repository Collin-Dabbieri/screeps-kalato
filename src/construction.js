var helper_functions= require('helper_functions');

var construction = {

    run: function() {

    	room1=Game.rooms[Memory.room1['name']];
        var containers = room1.find(FIND_STRUCTURES, {
                                    filter: (structure) => {return structure.structureType == STRUCTURE_CONTAINER}
        });

    	////// Build containers adjacent to sources and controller ///////////////////////////////////////
    	if(typeof Memory.containerConstructionCreated=='undefined'){
    		// build source containers
			for (let i = 0; i < nSources; i++) {
				idString='source'+i.toString()+'Id';
				source=Game.getObjectById(Memory.room1[idString]);
				free_spot_pos=helper_functions.get_adjacent_free_spot(source.pos);
				room1.createConstructionSite(free_spot_pos,STRUCTURE_CONTAINER);
				Memory.room1['source'+i.toString()+'ContainerX']=free_spot_pos.x;
				Memory.room1['source'+i.toString()+'ContainerY']=free_spot_pos.y;
			}

			// build controller container
			var controller=Game.getObjectById(Memory.room1['controllerId']);
			free_spot_pos=helper_functions.get_adjacent_free_spot(controller.pos);
			room1.createConstructionSite(free_spot_pos,STRUCTURE_CONTAINER);
			Memory.room1['controllerContainerX']=free_spot_pos.x;
			Memory.room1['controllerContainerY']=free_spot_pos.y;

			Memory.containerConstructionCreated=true;
		}

		/////// Once the containers are created, log the IDs //////////////////////////////////////////////
		if(typeof Memory.containerCreated=='undefined'){
			if(containers.length==nSources+1){
				// containers are built, but we haven't logged their IDs yet
				// get the objects for each source and controller and find the closest container to each, 
				// then log that container's ID

				//get the object for the container closest to each source
				for (let i = 0; i < nSources; i++) {
					var containerX=Memory.room1['source'+i.toString()+'ContainerX']
					var containerY=Memory.room1['source'+i.toString()+'ContainerY']
					var sourceContainer = room1.lookForAt(type=LOOK_STRUCTURES,x=containerX,y=containerY)
		            idContainerStr='source'+i.toString()+'ContainerId';
		            Memory.room1[idContainerStr]=closestContainer.id
				}
				//get the object for the container closest to the controller
				var containerX=Memory.room1['controllerContainerX']
				var containerY=Memory.room1['controllerContainerY']
	            var controllerContainer=room1.lookForAt(type=LOOK_STRUCTURES,x=containerX,y=containerY);
	            idContainerStr='controllerContainerId';
	            Memory.room1[idContainerStr]=controllerContainer.id;

				Memory.containerCreated=true
			}
		}

    }
};

module.exports = construction;