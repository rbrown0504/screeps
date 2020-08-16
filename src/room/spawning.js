let creepLogic = require("../creeps/index");
let creepTypes = _.keys(creepLogic);

function spawnCreeps(room,roleDistribution) {
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
    var controllerLevel = room.controller;
    console.log('SPAWN: controllerLevel:', room.controller.level, 'controllerProgressPercentage: ', (room.controller.progress / room.controller.progressTotal) * 100 );

    var structures = room.find(FIND_STRUCTURES);
    var fullDeposits = 0;
    var numberExtensions = 0;
    var numberRepairSites = 0;
    var numberRepairWalls = 0;
    room.memory.numberExtensions = 0;
    room.memory.numberDeposits = 0;
    room.memory.numberFullDeposits = 0;

    var roomControllerLevelExtensionLimit = {
        1 : 0,
        2 : 5
    }
    
    for(var i = 0; i < structures.length; i++) {
        var deposit = structures[i];        
        if (deposit.structureType == STRUCTURE_EXTENSION || deposit.structureType == STRUCTURE_SPAWN) {
            room.memory.numberDeposits++;
            if(deposit.energy == deposit.energyCapacity) {
                fullDeposits++;
                room.memory.numberFullDeposits++;
            }
            if (deposit.structureType == STRUCTURE_EXTENSION) {
                numberExtensions++
                room.memory.numberExtensions++;
            }            
        }
        if (deposit.hits < deposit.hitsMax && deposit.structureType != STRUCTURE_WALL) {
            numberRepairSites++;
        }
        if (deposit.hits < deposit.hitsMax && deposit.structureType == STRUCTURE_WALL) {
            numberRepairWalls++;
        }
    }
    console.log('SPAWN: Total Structures: ' + structures.length + ' , ' + 'Full Deposits (spawn/extension): ' + fullDeposits, 'NumberExtensions: ' , numberExtensions, 'RepairSites', numberRepairSites, 'RepairWalls',numberRepairWalls);
    room.memory.repairSites = numberRepairSites;
    room.memory.repairWalls = numberRepairWalls;

    var resourceLevel = fullDeposits / 5;
    var level = Math.floor(creepLevel + resourceLevel); 	
    console.log('SPAWN: Level:  ' , level, 'RoomControllerLevel: ', room.controller.level);
    // find a creep type that returns true for the .spawn() function
    let creepTypeNeeded = _.find(creepTypes, function(type) {
        return creepLogic[type].spawn(room,level,roleDistribution[type]);
    });

    // get the data for spawning a new creep of creepTypeNeeded
    let creepSpawnData = creepLogic[creepTypeNeeded] && creepLogic[creepTypeNeeded].spawnData(room,level); 
    console.log('SPAWN: total creeps: ' + totalCreeps + ' population multiplier ' + populationLevelMultiplier + ' creep level ' + creepLevel + ' resourceLevel ' + resourceLevel);

    if (creepSpawnData) {
        // find the first or 0th spawn in the room
        let spawn = room.find(FIND_MY_SPAWNS)[0];
        let result = spawn.spawnCreep(creepSpawnData.body, creepSpawnData.name, {memory: creepSpawnData.memory});
    
        console.log("Tried to Spawn:", creepTypeNeeded, result)
    }
}

module.exports = spawnCreeps;