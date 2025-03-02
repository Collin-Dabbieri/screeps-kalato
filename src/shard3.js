var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');
var roleRepairer = require('role.repairer');
var roleUpgrader = require('role.upgrader')
var roleMiner = require('role.miner')
var roleEnergyCourier=require('role.energycourier')
var roleTargetedCourier=require('role.targetedcourier')
var respawn = require('respawn')
var tower = require('tower')

var shard3 = {

    run: function() {

        respawn.run();
        tower.run(id='67b7c19ff12cdc5c837e8002');

        for(var name in Game.creeps) {
            var creep = Game.creeps[name];
            
            var idCont1='67b779333f846d70f09a90fd'
            var idCont2='67b6b8dac221c502b481a730'
            var idContTo='67b956961702697ef2ab64a3'
            var idTravelCont1='67bc93ec117ec739e59fd307'
            var idSource0='5bbcadf69099fc012e638359'
            var idSource1='5bbcadf69099fc012e63835b'
            var idTravelSource1='5bbcadf69099fc012e638356'
            var roomStrTravelSource1='E18N58'
            var roomStrHome='E18N57'
            var idStorage='67b956961702697ef2ab64a3'
            
            if(creep.memory.role == 'targetedcourier1') {
                roleTargetedCourier.run(creep,idCont1,idStorage);
            }
            if(creep.memory.role == 'targetedcourier2') {
                roleTargetedCourier.run(creep,idCont2,idStorage);
            }
            if(creep.memory.role == 'couriertravel1') {
                roleTargetedCourier.run(creep,idTravelCont1,idStorage,roomStrTravelSource1,roomStrHome);
            }

            if(creep.memory.role == 'harvester') {
                roleHarvester.run(creep);
            }
            if(creep.memory.role == 'builder') {
                roleBuilder.run(creep);
            }
            if(creep.memory.role == 'repairer'){
                roleRepairer.run(creep)
            }
            if(creep.memory.role == 'upgrader'){
                roleUpgrader.run(creep)
            }
            if(creep.memory.role == 'miner0'){
                roleMiner.run(creep,idSource0)
            }
            if(creep.memory.role == 'miner1'){
                roleMiner.run(creep,idSource1)
            }
            if(creep.memory.role == 'minertravel1'){
                roleMiner.run(creep,idTravelSource1,roomStrTravelSource1)
            }
            if(creep.memory.role == 'buildertravel1'){
                roleBuilder.run(creep,roomStrTravelSource1)
            }
            if(creep.memory.role == 'energycourier'){
                roleEnergyCourier.run(creep,refill_tower)
            }
        }
    }
};

module.exports = shard3;