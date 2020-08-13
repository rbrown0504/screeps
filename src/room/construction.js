let creepLogic = require("../creeps/index");
let creepTypes = _.keys(creepLogic);

function construction(room) {    
    room.memory.totalConstructionSites = 0;
    room.memory.totalHostileConstructionSites = 0;
    room.memory.totalCreeps = 0;
    room.memory.totalMyCreeps = 0;
    room.memory.totalHostileCreeps = 0;
    room.memory.totalContainers = 0;    
    room.memory.totalStructures = 0;   
    room.memory.totalMyConstructionSites = 0;    
    //go through construction sites	
    var constructionSites = _.filter(Game.constructionSites, (site) => site.room.name == room.name);;
    _.forEach(constructionSites, function(site) {
        room.memory.totalConstructionSites++;
        if (site.my) {
            room.memory.totalMyConstructionSites++;            
        } else {
            room.memory.totalHostileConstructionSites++;
        };
    });
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
    //go through structures
    var myStructures = room.find(FIND_STRUCTURES);
    _.forEach(myStructures, function(structure) {
        room.memory.totalStructures++;
        if (structure.structureType == STRUCTURE_CONTAINER) {
            room.memory.totalContainers++;		
        } 
    });    
}

module.exports = construction;