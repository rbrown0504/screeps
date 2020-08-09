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

    var deposits = room.find(FIND_STRUCTURES);
    var fullDeposits = 0;
    var numberExtensions = 0;
    for(var i = 0; i < deposits.length; i++) {
        var deposit = deposits[i];        
        if (deposit.structureType == STRUCTURE_EXTENSION || deposit.structureType == STRUCTURE_SPAWN) {
            if(deposit.energy == deposit.energyCapacity) {
                fullDeposits++;
            }
            if (deposit.structureType == STRUCTURE_EXTENSION) {
                numberExtensions++
            }
        }
    }
    console.log('Total Deposits: ' + deposits.length + ' , ' + 'Full Deposits: ' + fullDeposits);
    var resourceLevel = fullDeposits / 5;
    var level = Math.floor(creepLevel + resourceLevel);    
	if(totalCreeps < 5){
        console.log('Level Under 5:  ' + level);
	    level = 1;
	}
    console.log('Level:  ' + level);
    // find a creep type that returns true for the .spawn() function
    let creepTypeNeeded = _.find(creepTypes, function(type) {
        return creepLogic[type].spawn(room,level,roleDistribution[type],numberExtensions);
    });

    // get the data for spawning a new creep of creepTypeNeeded
    let creepSpawnData = creepLogic[creepTypeNeeded] && creepLogic[creepTypeNeeded].spawnData(room,level);
    //console.log(room, JSON.stringify(creepSpawnData));   
    console.log('total creeps: ' + totalCreeps + ' population multiplier ' + populationLevelMultiplier + ' creep level ' + creepLevel + ' resourceLevel ' + resourceLevel);

    if (creepSpawnData) {
        // find the first or 0th spawn in the room
        //console.log(JSON.stringify('SPAWN BODY ' + creepSpawnData.body));
        let spawn = room.find(FIND_MY_SPAWNS)[0];
        let result = spawn.spawnCreep(creepSpawnData.body, creepSpawnData.name, {memory: creepSpawnData.memory});
    
        console.log("Tried to Spawn:", creepTypeNeeded, result)
    }
}

module.exports = spawnCreeps;