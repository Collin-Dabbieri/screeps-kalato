var shard3 = require('shard3')
var shard1 = require('shard1')

module.exports.loop = function () {
    /*
    if(Game.shard['name']=='shard3'){
        shard3.run();
    }
    */
    if(Game.shard['name']=='shard1'){
        shard1.run();
    }


}
