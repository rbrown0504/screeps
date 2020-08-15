let creepLogic = require("../creeps/index");
let creepTypes = _.keys(creepLogic);

function resources(room) {
    room.memory.sources = null;
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
    //establish room memory for sources
    Source.prototype.memory = undefined;
    if(!room.memory.sources){//If this room has no sources memory yet
        room.memory.sources = {}; //Add it
        for(var i in sources){
            var source = sources[i];
            source.memory = room.memory.sources[source.id] = {}; //Create a new empty memory object for this source
            //Now you can do anything you want to do with this source
            //for example you could add a worker counter:
            source.memory.id = source.id;
            source.memory.containersNear = {};
        }
    } else { //The memory already exists so lets add a shortcut to the sources in its memory
        for(var i in sources){
            var source = sources[i];
            source.memory = this.memory.sources[source.id]; //Set the shortcut
            source.memory.id = source.id;
            source.memory.containersNear = {};
        }
    }
    room.memory.sourceNeedsContainer = false;

    //go through sources and find structures (containers) that are in 3 range
    var sourcesInRangeToContainer = new Array();              
    _.forEach(room.memory.sources, function(source) {
        source.containersNear = null;
        source.hasContainerBuilt = false;
        source.containersBuilt = null;
        var newContainer = new Array();
        source.containersBuilt = newContainer;
        var newArray = new Array();
        source.containersNear = newArray;
        var theSource = Game.getObjectById(source.id);
        //hasContainer = true IF CONTAINER IS FOUND BY A SOURCE
        var targets = theSource.pos.findInRange(FIND_STRUCTURES, 3);
        _.forEach(targets, function(target) {
            if (target.structureType == STRUCTURE_CONTAINER) {
                sourcesInRangeToContainer.push(source.id);
                source.hasContainer = true;
                source.hasContainerBuilt = true;
                if (!source.containersNear.includes(target.id + '__' + target.structureType)) {
                    source.containersNear.push(target.id + '__' + target.structureType);
                    var existing = source.containersNear;
                    existing.push(target.id + '__' + target.structureType);
                    var unique = existing.filter((v, i, a) => a.indexOf(v) === i);       
                    source.containersNear = unique;   
                }
                if (!source.containersBuilt.includes(target.id)) {
                    source.containersBuilt.push(target.id);
                    var existing = source.containersBuilt;
                    existing.push(target.id);
                    var unique = existing.filter((v, i, a) => a.indexOf(v) === i);       
                    source.containersBuilt = unique;                    
                }
            };
        });
        //hasContainer = true IF THERE IS A CONTAINER BEING CONSTRUCTED BY A SOURCE        
        var targets = theSource.pos.findInRange(FIND_CONSTRUCTION_SITES, 3);
        _.forEach(targets, function(target) {
            if (target.structureType == STRUCTURE_CONTAINER) {
                sourcesInRangeToContainer.push(source.id);
                source.hasContainer = true;
                if (!source.containersNear.includes(target.id + '__underConstruction')) {
                    source.containersNear.push(target.id + '__underConstruction');
                    var existing = source.containersNear;
                    existing.push(target.id + '__underConstruction');
                    var unique = existing.filter((v, i, a) => a.indexOf(v) === i);       
                    source.containersNear = unique;
                }       
            }
        });
    });
    //rule: there must be at least on container within 3 range of each energy source
    console.log('Sources in range (3) of a container ' + sourcesInRangeToContainer + ' sources length ' + sources.length + ' sources container length ' + sourcesInRangeToContainer.length);
    
    if (sources.length > sourcesInRangeToContainer.length) {
        //console.log('need to build a container');        
        var sourcesNeedingContainer = new Array();
        _.forEach(sources, function(source) {
            if (!sourcesInRangeToContainer.includes(source.id)) {
                sourcesNeedingContainer.push(source.id);
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
        //console.log('there is at least one container next to each source');
    }
}

module.exports = resources;