var helper_functions = {

    get_adjacent_free_spot: function(pos) {


        const terrain = Game.map.getRoomTerrain(pos.roomName);

        let x_try=[pos.x+1,pos.x,pos.x-1,pos.x-1,pos.x-1,pos.x,pos.x+1,pos.x+1];
        let y_try=[pos.y+1,pos.y+1,pos.y+1,pos.y,pos.y-1,pos.y-1,pos.y-1,pos.y];

        let xFree=null;
        let yFree=null;

        for (let i = 0; i < x_try.length; i++) {
            switch(terrain.get(x_try[i],y_try[i])) {
                case TERRAIN_MASK_WALL:
                    break;
                case TERRAIN_MASK_SWAMP:
                    if(xFree==null){
                        let xFree=x_try[i];
                        let yFree=y_try[i];
                    }
                case 0:
                    xFree=x_try[i];
                    yFree=y_try[i];
            }
        }

        free_spot_pos=Game.rooms[pos.roomName].getPositionAt(xFree, yFree);

        return free_spot_pos

    }
};

module.exports = helper_functions;