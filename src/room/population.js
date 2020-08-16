let creepLogic = require("../creeps/index");
let creepTypes = _.keys(creepLogic);

function population(room) {    
    room.memory.totalCreeps = 0;
    room.memory.totalMyCreeps = 0;
    room.memory.totalHostileCreeps = 0;    
    //go through creeps
    var totalCreeps = _.filter(Game.creeps, (creep) => creep.room.name == room.name);;
    _.forEach(totalCreeps, function(creep) {
        room.memory.totalCreeps++;
        if (creep.my) {				
            room.memory.totalMyCreeps++;
        } else {
            room.memory.totalHostileCreeps++;
        }
    });    
}

module.exports = population;