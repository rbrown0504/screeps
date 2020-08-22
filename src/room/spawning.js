let creepLogic = require("../creeps/index");
let creepTypes = _.keys(creepLogic);

function spawnCreeps(room,roleDistribution,globalRoleTotals) {
    // lists all the creep types to console
    _.forEach(creepTypes, type => console.log(type));

    var creeps = room.find(FIND_MY_CREEPS);
    var totalCreeps = 0;
    var i = 0;
	for(var n in creeps) {
        totalCreeps++;
	}
    var populationLevelMultiplier = 8;
    var creepLevel = totalCreeps / populationLevelMultiplier;    

    //var structures = room.find(FIND_STRUCTURES);
    
    
    var resourceLevel = room.memory.numberFullDeposits / 5;
    var level = Math.floor(creepLevel + resourceLevel); 	    
    // find a creep type that returns true for the .spawn() function
    let creepTypeNeeded = _.find(creepTypes, function(type) {
        return creepLogic[type].spawn(room,level,roleDistribution[type],globalRoleTotals[type]);
    });

    // get the data for spawning a new creep of creepTypeNeeded
    let creepSpawnData = creepLogic[creepTypeNeeded] && creepLogic[creepTypeNeeded].spawnData(room,level); 
    console.log('SPAWN: Total Structures: ' + room.memory.totalStructures + ' , ' + 'Full Deposits (spawn/extension): ' + room.memory.numberFullDeposits, 'NumberExtensions: ' , room.memory.numberExtensions, 'RepairSites', room.memory.repairSites, 'RepairWalls',room.memory.repairWalls);
    console.log('SPAWN','popMultiplier',populationLevelMultiplier,'creepLevel' , creepLevel,'resourceLevel' , resourceLevel, 'roomLevel' , level,'RoomControllerLevel' , room.controller.level,'controllerProgressPercentage', (room.controller.progress / room.controller.progressTotal) * 100 );
    console.log(room.name,'Total: ' + room.memory.totalCreeps,
                'H:' + roleDistribution['harvester'].total +
                '|U:' + roleDistribution['upgrader'].total +
                '|B:' + roleDistribution['builder'].total + 
                '|C:' + roleDistribution['carrier'].total +
                '|R:' + roleDistribution['repairer'].total +
                '|LDH:' + roleDistribution['harvesterLD'].total +
                '|RW:' + roleDistribution['repairerWall'].total);

    if (creepSpawnData) {
        // find the first or 0th spawn in the room
        let spawn = room.find(FIND_MY_SPAWNS)[0];
        let result = spawn.spawnCreep(creepSpawnData.body, creepSpawnData.name, {memory: creepSpawnData.memory});
        if (Game.spawns.Spawn1.claimRoom != undefined && result == 0 && creepTypeNeeded == 'claimer') {
            delete Game.spawns.Spawn1.claimRoom;
        }
        console.log("Tried to Spawn:", creepTypeNeeded, result)
    }
}

module.exports = spawnCreeps;