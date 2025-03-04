var roleHarvester = require('role.harvester');
var roleBuilder= require('role.builder');
var roleUpgrader= require('role.upgrader');
var roleTargetedCourier = require('role.targetedcourier');
var roleMiner = require('role.miner');

var run_creeps = {

    run: function() {

        nSources=Memory.room1['nSources'];
        var controller = Game.spawns['Spawn1'].room.controller;
        var rcl = controller.level



        /////// run creep logic //////////////////////////////////////////////////
        for(var name in Game.creeps) {
            var creep = Game.creeps[name];
            if(creep.memory.role == 'harvester') {
                roleHarvester.run(creep);
            }
            for (let i = 0; i < nSources; i++) {
                if(creep.memory.role == 'miner'+i.toString()) {
                    idSourceIdx='source'+i.toString()+'Id';
                    idSource=Memory.room1[idSourceIdx]
                    roleMiner.run(creep,idSource);
                }
            }
            if(creep.memory.role == 'builder') {
                roleBuilder.run(creep);
            }
            if(creep.memory.role == 'upgrader') {
                roleUpgrader.run(creep);
            }
            for (let i = 0; i < nSources; i++) {
                if(creep.memory.role == 'targetedcourier'+i.toString()) {
                    idFrom=Memory.room1['source'+i.toString()+'ContainerId'];
                    idTo=Memory.room1['controllerContainerId']
                    roleTargetedCourier.run(creep,idFrom,idTo);
                }
            }
        }
    }
};

module.exports = run_creeps;