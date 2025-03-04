var run_creeps = require('run_creeps');
var respawn = require('respawn');
var log_memory = require('log_memory');
var construction = require('construction');

module.exports.loop = function () {

    ///// log the average CPU over the last logCpuEvery ticks ///////////////////
    logCpuEvery=10
    if(typeof Memory.cpuCounter=='undefined'){
        Memory.cpuCounter=0
        Memory.cpuVals=[]
    }
    Memory.cpuCounter+=1
    Memory.cpuVals.push(Game.cpu.getUsed())
    if(Memory.cpuCounter==logCpuEvery){
        const average = array => array.reduce((a, b) => a + b) / array.length;
        averageCpu=average(Memory.cpuVals).toFixed(2)


        console.log('Average CPU used over last '+logCpuEvery.toString()+' ticks: '+averageCpu.toString())
        Memory.cpuCounter=0
        Memory.cpuVals=[]
    }
    // handle any Memory cacheing you want to do (some Memory cacheing will be handled in other places too)
    log_memory.run();

    // run creeps
    run_creeps.run();

    // handle respawns
    respawn.run();

    // handle creation of construction sites
    construction.run();



}
