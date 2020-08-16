const { result } = require("lodash");

Creep.prototype.sayHello = function sayHello() {
    this.say("Hello", true);
}

Creep.prototype.sayDebug = function sayHello() {
    this.say("Debug", true);
}

Creep.prototype.getObject = function(id) {
	return Game.getObjectById(id);
};

Creep.prototype.getRoomSource = function(id) {
    _.forEach(room.memory.sources, function(source) {
        if (source.id == id) {
            return source;
        }
    });
};

Creep.prototype.getOpenDeposits = function() {
    //get a deposit (extension or spawn) with free capacity
    var deposits = this.room.find(FIND_STRUCTURES, {
        filter: (structure) => {
            return (structure.structureType == STRUCTURE_EXTENSION || structure.structureType == STRUCTURE_SPAWN) &&
                structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
        }
    });
	return deposits;
};

Creep.prototype.getDepositContainers = function() {
    //get containers having free capacity available for deposit
    var deposits = this.room.find(FIND_STRUCTURES, {
        filter: (structure) => {
            return (structure.structureType == STRUCTURE_CONTAINER) && structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
        }
    });	
	return deposits;
};

Creep.prototype.getHarvestContainers = function() {
    //get containers having free energy to withdraw from
    var deposits = this.room.find(FIND_STRUCTURES, {
        filter: (structure) => {
            return (structure.structureType == STRUCTURE_CONTAINER) && structure.store.getUsedCapacity(RESOURCE_ENERGY) > 0;
        }
    });	
	return deposits;
};

Creep.prototype.constructSpawnExtensions = function buildSpawnExtensions(site) {    
    if (site == undefined) {
        site = creep.getBuildSpot(creep,Game.spawns['Spawn1'],1);
    }
    console.log('SITE BUILD: ', JSON.stringify(site)); 
    //build the site if the level is right
    if (!this.pos.inRangeTo(site.x,site.y,3)) {
        this.moveTo(site.x,site.y);
    }
    //console.log('create a construction site move',creep.moveTo(site.x,site.y));                            
    //creep.moveTo(site.x,site.y);
    //console.log('constructResult ', Game.spawns['Spawn1'].room.createConstructionSite(site.x,site.y, STRUCTURE_EXTENSION));
    var result = Game.spawns['Spawn1'].room.createConstructionSite(site.x,site.y, STRUCTURE_EXTENSION);
    return result;
}

Creep.prototype.harvestEnergy = function harvestEnergy(source,ACTIONS) {    
    var result;
    var openContainers = this.getHarvestContainers();
    
    if (openContainers.length > 0) {
        result = this.harvestContainer(openContainers[0],ACTIONS);                
    } else {
        result = this.harvestSource(source,ACTIONS);    
    }    
    return result;
}

Creep.prototype.harvestSource = function harvestSource(source,ACTIONS) {    
    if (source == undefined) {
        source = this.getObject(this.memory.source);
    }    
    var result = this.harvest(source);
    if(result == ERR_NOT_IN_RANGE) {
        this.moveTo(source);
        this.memory.lastAction = ACTIONS.HARVEST;
        this.say('Harvesting');
    }
    return result;
}

Creep.prototype.harvestContainer = function harvestContainer(container,ACTIONS) {    
    if (!this.pos.inRangeTo(container,1)) {        
        this.moveTo(container);
    }                      
    var result = this.withdraw(container,RESOURCE_ENERGY);
    if(result == ERR_NOT_IN_RANGE) {
        this.moveTo(container.pos);
        this.memory.lastAction = ACTIONS.HARVEST;
    }
    return result;
}

Creep.prototype.depositEnergy = function depositEnergy(source,ACTIONS) {    
    var result;
    var openContainers = this.getDepositContainers();                
    if (openContainers > 0) {
        result = this.depositContainer(openContainers[0],ACTIONS);                
    } else {
        result = this.deposit(source,ACTIONS);    
    }    
    return result;
}


Creep.prototype.depositContainer = function depositContainer(container,ACTIONS) {
    if (container == null) {
        container = this.getDepositContainers()[0];
    }
    var result = this.transfer(container, RESOURCE_ENERGY);
    if(result == ERR_NOT_IN_RANGE) {
        this.moveTo(container);
        this.memory.lastAction = ACTIONS.DEPOSIT;
    }                                                
    return result;
}

Creep.prototype.deposit = function deposit(deposit,ACTIONS) {
    if (deposit == null) {
        deposit = this.getOpenDeposits()[0];
    }    
    var result = this.transfer(deposit, RESOURCE_ENERGY);
    if(result == ERR_NOT_IN_RANGE) {
        this.moveTo(deposit);
        this.memory.lastAction = ACTIONS.DEPOSIT;
    }                                                
    return result;
}

Creep.prototype.buildSite = function buildSite(site,ACTIONS) {    
    if (site == undefined) {
        site = this.room.find(FIND_CONSTRUCTION_SITES);                
    }    
    var result = this.build(site);
    if(result == ERR_NOT_IN_RANGE) {
        this.moveTo(site);                     
        this.memory.lastAction = ACTIONS.BUILD;
        this.memory.lastBuild = site.id;
    }
    return result;
}

Creep.prototype.confirmRepair = function confirmRepair(site) {

    if (site == null) {
        return null;
    }

    if (site.hits < site.hitsMax) {
        return true;
    } else {
        return false;
    }    
}

Creep.prototype.repairSite = function repairSite(site,ACTIONS) {
    if (site == null) {
        var targets = this.room.find(FIND_STRUCTURES, {
            filter: object => object.hits < object.hitsMax && object.structureType != STRUCTURE_WALL
        });        
        targets.sort((a,b) => a.hits - b.hits);        
        if(targets.length > 0) {
            site = targets[0];            
        }
    }
    var result = this.repair(site);    
    if(result == ERR_NOT_IN_RANGE) {
        this.moveTo(site);                     
        this.memory.lastAction = ACTIONS.BUILD;
        this.memory.lastBuild = site.id;
    }
    return result;
}

Creep.prototype.repairWall = function repairWall(site,ACTIONS) {

    if (site == null) {
        var targets = this.room.find(FIND_STRUCTURES, {
            filter: object => object.hits < object.hitsMax && object.structureType != STRUCTURE_WALL
        });        
        targets.sort((a,b) => a.hits - b.hits);        
        if(targets.length > 0) {
            site = targets[0];            
        }
    }

    var result = this.repair(site);
    if(result == ERR_NOT_IN_RANGE) {
        this.moveTo(site);                     
        this.memory.lastAction = ACTIONS.BUILD;
        this.memory.lastBuild = site.id;
    }
    return result;
}

Creep.prototype.getBuildSpot = function(creep,theBuildObjectCenter,surroundingSpace) {
    //assumes object passed has pos    
    var top =0;
    var left = -surroundingSpace;
    var bottom = +surroundingSpace; 
    var right = 0;
    var finalResults = new Array();
    const lookLowerLeft = creep.room.lookForAtArea(LOOK_TERRAIN,theBuildObjectCenter.pos.y+top,theBuildObjectCenter.pos.x+left,theBuildObjectCenter.pos.y+bottom,theBuildObjectCenter.pos.x+right,true);
    const lookLowerLeftConstruction = creep.room.lookForAtArea(LOOK_CONSTRUCTION_SITES,theBuildObjectCenter.pos.y+top,theBuildObjectCenter.pos.x+left,theBuildObjectCenter.pos.y+bottom,theBuildObjectCenter.pos.x+right,true);
    //lookup structures in the area and exclude them from the result
    const lookLowerLeftStructures = creep.room.lookForAtArea(LOOK_STRUCTURES,theBuildObjectCenter.pos.y+top,theBuildObjectCenter.pos.x+left,theBuildObjectCenter.pos.y+bottom,theBuildObjectCenter.pos.x+right,true);
    var filterForLowerLeftStructures = _.filter(lookLowerLeftStructures, (t) => t.structure.structureType == 'extension' || t.structure.structureType == 'spawn');
    var filterForLowerLeft = _.filter(lookLowerLeft, (t) => t.terrain == 'plain' || t.terrain == 'swamp');
    var lowerLeftResults = new Array();
    _.forEach(filterForLowerLeft, function(lowerLeft) {
        var filterStructure = _.filter(filterForLowerLeftStructures, (t) => t.x == lowerLeft.x && t.y == lowerLeft.y);
        //console.log('filterStructureLowerLeft',JSON.stringify(filterStructure),filterStructure.length,filterStructure.length > 0);
        if (filterStructure.length > 0) {            
            
        } else {
            finalResults.push(lowerLeft);
        }
        
    });            
    //console.log('filterForfilterFor ' + filterForLowerLeft, filterForLowerLeft.length,'constructionSites',JSON.stringify(filterForLowerLeftStructures));    
    //look upper left
    top = -surroundingSpace;
    left = -surroundingSpace;
    bottom = 0; 
    right = 0;
    const lookUpperLeft = creep.room.lookForAtArea(LOOK_TERRAIN,theBuildObjectCenter.pos.y+top,theBuildObjectCenter.pos.x+left,theBuildObjectCenter.pos.y+bottom,theBuildObjectCenter.pos.x+right,true);
    //lookup structures in the area and exclude them from the result
    const lookUpperLeftStructures = creep.room.lookForAtArea(LOOK_STRUCTURES,theBuildObjectCenter.pos.y+top,theBuildObjectCenter.pos.x+left,theBuildObjectCenter.pos.y+bottom,theBuildObjectCenter.pos.x+right,true);
    var filterForUpperLeftStructures = _.filter(lookUpperLeftStructures, (t) => t.structure.structureType == 'extension' || t.structure.structureType == 'spawn');
    var filterForUpperLeft = _.filter(lookUpperLeft, (t) => t.terrain == 'plain' || t.terrain == 'swamp');
    _.forEach(filterForUpperLeft, function(upperLeft) {
        var filterStructure = _.filter(filterForUpperLeftStructures, (t) => t.x == upperLeft.x && t.y == upperLeft.y);
        //console.log('filterStructureUpperLeft',JSON.stringify(filterStructure),filterStructure.length,filterStructure.length > 0);
        if (filterStructure.length > 0) {            
            
        } else {
            finalResults.push(upperLeft);
        }
        
    });

    //look upper right
    top = -surroundingSpace;
    left = 0;
    bottom = 0; 
    right = surroundingSpace;
    const lookUpperRight = creep.room.lookForAtArea(LOOK_TERRAIN,theBuildObjectCenter.pos.y+top,theBuildObjectCenter.pos.x+left,theBuildObjectCenter.pos.y+bottom,theBuildObjectCenter.pos.x+right,true);
    var filterForUpperRight = _.filter(lookUpperRight, (t) => t.terrain == 'plain' || t.terrain == 'swamp');
    //lookup structures in the area and exclude them from the result
    const lookUpperRightStructures = creep.room.lookForAtArea(LOOK_STRUCTURES,theBuildObjectCenter.pos.y+top,theBuildObjectCenter.pos.x+left,theBuildObjectCenter.pos.y+bottom,theBuildObjectCenter.pos.x+right,true);
    var filterForUpperRightStructures = _.filter(lookUpperRightStructures, (t) => t.structure.structureType == 'extension' || t.structure.structureType == 'spawn');    
    _.forEach(filterForUpperRight, function(upperRight) {
        var filterStructure = _.filter(filterForUpperRightStructures, (t) => t.x == upperRight.x && t.y == upperRight.y);
        //console.log('filterStructureUpperLeft',JSON.stringify(filterStructure),filterStructure.length,filterStructure.length > 0);
        if (filterStructure.length > 0) {            
            
        } else {
            finalResults.push(upperRight);
        }
    });

    //look lower right
    top = 0;
    left = 0;
    bottom = +surroundingSpace;
    right = surroundingSpace;

    const lookLowerRight = creep.room.lookForAtArea(LOOK_TERRAIN,theBuildObjectCenter.pos.y+top,theBuildObjectCenter.pos.x+left,theBuildObjectCenter.pos.y+bottom,theBuildObjectCenter.pos.x+right,true);
    var filterForLowerRight = _.filter(lookLowerRight, (t) => t.terrain == 'plain' || t.terrain == 'swamp');
    const lookLowerRightStructures = creep.room.lookForAtArea(LOOK_STRUCTURES,theBuildObjectCenter.pos.y+top,theBuildObjectCenter.pos.x+left,theBuildObjectCenter.pos.y+bottom,theBuildObjectCenter.pos.x+right,true);
    var filterForLowerRightStructures = _.filter(lookLowerRightStructures, (t) => t.structure.structureType == 'extension' || t.structure.structureType == 'spawn');    
    _.forEach(filterForLowerRight, function(lowerRight) {
        var filterStructure = _.filter(filterForLowerRightStructures, (t) => t.x == lowerRight.x && t.y == lowerRight.y);
        //console.log('filterStructureUpperLeft',JSON.stringify(filterStructure),filterStructure.length,filterStructure.length > 0);
        if (filterStructure.length > 0) {            
            
        } else {
            finalResults.push(lowerRight);
        }
    });        
    var buildableSite;
    if (finalResults.length > 0) {        
        buildableSite = finalResults[0];
    }
	return buildableSite;
};

// Creep.prototype.getAvailableResource = function(room) {
//     // Some kind of unit counter per resource (with Population)
//     this.room = room;
// 	var srcs = this.room.find(
//         FIND_SOURCES, {
//             filter: function(src) {
//                 var targets = src.pos.findInRange(FIND_HOSTILE_CREEPS, 3);
//                 if(targets.length == 0) {
//                     return true;
//                 }

//                 return false;
//             }
//     });
// 	var srcIndex = Math.floor(Math.random()*srcs.length);

// 	return srcs[srcIndex];
// };

