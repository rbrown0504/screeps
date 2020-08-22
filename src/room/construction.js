let creepLogic = require("../creeps/index");
let creepTypes = _.keys(creepLogic);

function construction(room) {    
    room.memory.totalConstructionSites = 0;
    room.memory.totalHostileConstructionSites = 0;    
    room.memory.totalContainers = 0;    
    room.memory.totalStructures = 0;   
    room.memory.totalMyConstructionSites = 0;
    room.memory.depositNeeded = 0;    
    room.memory.totalDeposits = 0;
    room.memory.constructExtensions = 0;
    room.memory.constructContainers = 0;
    //go through construction sites	
    var constructionSites = _.filter(Game.constructionSites, (site) => site.room.name == room.name);;
    _.forEach(constructionSites, function(site) {
        room.memory.totalConstructionSites++;
        if (site.my) {
            room.memory.totalMyConstructionSites++;            
            if (site.structureType == 'extension') {
                room.memory.constructExtensions++;
            }
            if (site.structureType == 'container') {
                room.memory.constructContainers++;
            }            
        } else {
            room.memory.totalHostileConstructionSites++;
        };
    });    
    //go through structures
    var myStructures = room.find(FIND_STRUCTURES);
    room.setStructureMemory(myStructures);    
}

module.exports = construction;