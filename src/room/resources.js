let creepLogic = require("../creeps/index");
let creepTypes = _.keys(creepLogic);

function resources(room) {
    var sources = room.find(
        FIND_SOURCES, {
            filter: function(src) {
                var targets = src.pos.findInRange(FIND_HOSTILE_CREEPS, 3);
                if(targets.length == 0) {
                    return true;
                }

                return false;
            }
    });
    //room.memory.sources = sources;
    //go through sources and find structures (containers) that are in 3 range
    sourcesInRangeToContainer = new Array();    
    var sourceMap = new Map();    
    _.forEach(sources, function(source) {
        var sourceDetails = {
            hasContainer : false,
        };
        //hasContainer = true IF CONTAINER IS FOUND BY A SOURCE
        var targets = source.pos.findInRange(FIND_STRUCTURES, 3);
        _.forEach(targets, function(target) {
            if (target.structureType == STRUCTURE_CONTAINER) {
                sourcesInRangeToContainer.push(source.id);                
                sourceDetails.hasContainer = true;
            }
        });
        //hasContainer = true IF THERE IS A CONTAINER BEING CONSTRUCTED BY A SOURCE
        var targets = source.pos.findInRange(FIND_CONSTRUCTION_SITES, 3);
        _.forEach(targets, function(target) {
            if (target.structureType == STRUCTURE_CONTAINER) {
                sourcesInRangeToContainer.push(source.id);                
                sourceDetails.hasContainer = true;
            }
        });
        sourceMap.set(source.id,sourceDetails);
    });
    //rule: there must be at least on container within 3 range of each energy source
    console.log('Sources in range (3) of a container ' + sourcesInRangeToContainer + ' sources length ' + sources.length + ' sources container length ' + sourcesInRangeToContainer.length);
    if (sources.length > sourcesInRangeToContainer.length) {
        //console.log('need to build a container');        
        var sourcesNeedingContainer = new Array();
        _.forEach(sources, function(source) {
            if (!sourcesInRangeToContainer.includes(source.id)) {
                sourcesNeedingContainer.push(source.id);
                // console.log('sssssssssssssss ' + JSON.stringify(sourceMap.get(source.id)));
                // console.log('sourceDetail: ' + JSON.stringify(sourceMap.get(source.id).hasContainer));
            }                       
        });
        if (sourcesNeedingContainer.length > 0) {
            room.memory.sourceNeedsContainer = true;
            room.memory.sourcesNeedingContainer = sourcesNeedingContainer;
        } else {
            room.memory.sourceNeedsContainer = false;
            room.memory.sourcesNeedingContainer = null;
        }        
    } else if (sources.length == sourcesInRangeToContainer.length) {
        console.log('there is at least one container next to each source');
    }
    // var towers = room.find(FIND_STRUCTURES, { filter: { structureType: STRUCTURE_TOWER }});
    // if (towers.length) {
    //     _.forEach(towers, function(tower) {
    //         console.log(tower);
    //         var closestDamagedStructure = tower.pos.findClosestByRange(FIND_STRUCTURES,{ filter: (structure) => structure.hits < structure.hitsMax});
    //         if (closestDamagedStructure) {
    //             tower.repair(closestDamagedStructure);
    //         }
    //         var closestHostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
    //         if (closestHostile) {
    //             tower.attack(closestHostile);
    //         }
    //     });
    // }
}

module.exports = resources;