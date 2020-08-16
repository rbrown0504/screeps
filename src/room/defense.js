let creepLogic = require("../creeps/index");
let creepTypes = _.keys(creepLogic);

function defense(room) {

    var towers = room.find(FIND_STRUCTURES, { filter: { structureType: STRUCTURE_TOWER }});
    if (towers.length) {
        _.forEach(towers, function(tower) {
            console.log(tower);
            var closestDamagedStructure = tower.pos.findClosestByRange(FIND_STRUCTURES,{ filter: (structure) => structure.hits < structure.hitsMax});
            if (closestDamagedStructure) {
                tower.repair(closestDamagedStructure);
            }
            var closestHostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
            if (closestHostile) {
                tower.attack(closestHostile);
            }
        });
    }
}

module.exports = defense;