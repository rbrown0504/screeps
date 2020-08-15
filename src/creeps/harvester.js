const { map } = require("lodash");

var harvester = {

    /** @param {Creep} creep **/
    run: function(creep,roleDistribution) {
        var DEPOSIT_FOR = {
            CONSTRUCTION: 1,
            POPULATION: 2
        }
        var ACTIONS = {
            HARVEST: 1,
            DEPOSIT: 2,
            BUILD: 3,
            UPGRADE: 4
        };
        //GET LAST ACTION AND GO TO THAT.
        var continueDeposit = false;
        if (creep.energy != 0 && creep.memory.lastAction == ACTIONS.DEPOSIT) {
            continueDeposit = true;
        }
        var continueBuild = false;
        if (creep.energy != 0 && creep.memory.lastAction == ACTIONS.BUILD) {
            continueBuild = true;
        }
        if (creep.memory.sourceRoom == undefined) {
            creep.memory.sourceRoom = creep.room.name;
        }
        //ADD A DEFAULT SOURCE IF ONE DOESN'T CURRENTLY EXIST
        if (creep.memory.source == undefined) {      
            var srcs = creep.room.find(
                FIND_SOURCES, {
                    filter: function(src) {
                        var targets = src.pos.findInRange(FIND_HOSTILE_CREEPS, 3);
                        if(targets.length == 0) {
                            return true;
                        }
        
                        return false;
                    }
            });
            var srcIndex = Math.floor(Math.random()*srcs.length);
            creep.memory.source = srcs[srcIndex].id;            
        }

        var deposits = creep.room.find(FIND_STRUCTURES, {
                filter: (structure) => {
                    return (structure.structureType == STRUCTURE_EXTENSION || structure.structureType == STRUCTURE_SPAWN) &&
                        structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
                }
        });        
        var spawns = [];
        for(var n in Game.spawns) { 
            var s = Game.spawns[n];
            if(s.room == creep.room) {
                spawns.push(s);
            }
        }        
        var depositFor;
        if(deposits == 0 && spawns[0].energy == spawns[0].energyCapacity) {
            //help a builder out
            depositFor = DEPOSIT_FOR.CONSTRUCTION;
            console.log('it would do this.. deposit for construction');
        } else {
            //go to containers or spawn
            depositFor = DEPOSIT_FOR.POPULATION;
            console.log('it would do this.. deposit for population');
        }                
        var harvesterBuildContainer = false;
        var sourceContainer = false;
        var harvesterContainersToBuild = new Array();
        var harvesterContainers = new Array();
        //always go to the first container source found and start to build that if possible.
        _.forEach(creep.room.memory.sources, function(source) {
            if (source.containersNear.length > 0) {            
                _.forEach(source.containersNear, function(theSource) {
                    var sourceSplit = theSource.split("__");
                    if (sourceSplit[1] == 'underConstruction') {                    
                        harvesterContainersToBuild.push(sourceSplit[0]);                    
                        if (roleDistribution['builder'].total == 0) {
                            harvesterBuildContainer = true;
                        }             
                        
                    } else if (sourceSplit[1] == 'container') {
                        sourceContainer = true;
                        harvesterContainers.push(sourceSplit[0]);                    
                    }
                });
            }
        });

        //start doing stuff
        if(creep.store.getFreeCapacity() > 0 && !continueDeposit && !continueBuild) {
            //go to default source
            var source = creep.getObject(creep.memory.source);
            if(creep.harvest(source) == ERR_NOT_IN_RANGE) {
                creep.moveTo(source);
                creep.memory.lastAction = ACTIONS.HARVEST;
                creep.say('xHarvesting');
            }
        } else if (creep.store[RESOURCE_ENERGY] == 0) {
            creep.say('Empty');
            var source = creep.getObject(creep.memory.source);
            if(creep.harvest(source) == ERR_NOT_IN_RANGE) {
                creep.moveTo(source);
                creep.memory.lastAction = ACTIONS.HARVEST;
            }
        } else {            
            //console.log('-***********************************here');            
            if (creep.store[RESOURCE_ENERGY] == 0) {
                creep.say('Empty');
                var source = creep.getObject(creep.memory.source);
                if(creep.harvest(source) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(source);
                    creep.memory.lastAction = ACTIONS.HARVEST;
                }             
            } else if (creep.room.memory.sourceNeedsContainer == true) {
                //if there isn't a single container withing 3 of source, construct one                
                console.log('Construct a Container');
                var sourceId = creep.room.memory.sourcesNeedingContainer[0];                
                //console.log('Builde this container: ',sourceId);
                var constructionSource = creep.getObject(sourceId);
                //console.log('Source Object: ',constructionSource);
                
                // _.forEach(creep.room.memory.sources, function(source) {
                //     if (source.id == sourceId) {
                //         constructionSourceId = source;
                //     }
                // });
                
                //console.log('SourceToCreat: ' + JSON.stringify(constructionSource.pos));
                //const look = creep.room.lookForAtArea(LOOK_FLAGS,source.pos.y+3,source.pos.x-3,source.pos.y-3,source.pos.x+3);
                //look down / left three
                //const look = creep.room.lookForAtArea(LOOK_FLAGS,source.pos.y,source.pos.x-3,source.pos.y+3,source.pos.x,true);
                //console.log('Look: '  + JSON.stringify(look));
                //look down / left three
                //y up/down x left/right
                // smaller x = left
                // smaller y = up
                // const look = creep.room.lookForAtArea(LOOK_STRUCTURES,top,left,bottom,right);
                //look bottom left
                //look at the areas on each of the 4 sides                    
                var top =0;
                var left = -3;
                var bottom = +3; 
                var right = 0;
                const lookLowerLeft = creep.room.lookForAtArea(LOOK_TERRAIN,constructionSource.pos.y+top,constructionSource.pos.x+left,constructionSource.pos.y+bottom,constructionSource.pos.x+right,true);                    
                var filterForLowerLeft = _.filter(lookLowerLeft, (t) => t.terrain == 'plain' || t.terrain == 'swamp');
                console.log('filterForfilterFor ' + filterForLowerLeft, filterForLowerLeft.length);
                
                //look upper left
                top = -3;
                left = -3;
                bottom = 0; 
                right = 0;
                const lookUpperLeft = creep.room.lookForAtArea(LOOK_TERRAIN,constructionSource.pos.y+top,constructionSource.pos.x+left,constructionSource.pos.y+bottom,constructionSource.pos.x+right,true);
                var filterForUpperLeft = _.filter(lookUpperLeft, (t) => t.terrain == 'plain' || t.terrain == 'swamp');
                //look upper right
                top = -3;
                left = 0;
                bottom = 0; 
                right = 3;
                const lookUpperRight = creep.room.lookForAtArea(LOOK_TERRAIN,constructionSource.pos.y+top,constructionSource.pos.x+left,constructionSource.pos.y+bottom,constructionSource.pos.x+right,true);
                var filterForUpperRight = _.filter(lookUpperRight, (t) => t.terrain == 'plain' || t.terrain == 'swamp');
                //look upper right
                top = 0;
                left = 0;
                bottom = +3;
                right = 3;
                const lookLowerRight = creep.room.lookForAtArea(LOOK_TERRAIN,constructionSource.pos.y+top,constructionSource.pos.x+left,constructionSource.pos.y+bottom,constructionSource.pos.x+right,true);
                var filterForLowerRight = _.filter(lookLowerRight, (t) => t.terrain == 'plain' || t.terrain == 'swamp');
                
                console.log('For Energy Source: ' + constructionSource.id + ' There are ' + filterForLowerLeft.length + ' buildable areas in the lower left quadrant 3 range.');
                console.log('For Energy Source: ' + constructionSource.id + ' There are ' + filterForUpperLeft.length + ' buildable areas in the upper left quadrant 3 range.');
                console.log('For Energy Source: ' + constructionSource.id + ' There are ' + filterForUpperRight.length + ' buildable areas in the upper right quadrant 3 range.');
                console.log('For Energy Source: ' + constructionSource.id + ' There are ' + filterForLowerRight.length + ' buildable areas in the lower right quadrant 3 range.');                
                if (filterForLowerLeft.length > 0 ) {
                    console.log('create a construction site');
                    creep.moveTo(filterForLowerLeft[0].pos);
                    Game.spawns['Spawn1'].room.createConstructionSite(creep.pos.x,creep.pos.y, STRUCTURE_CONTAINER);                    
                }
                if (!creep.pos.inRangeTo(constructionSource,3)) {
                    console.log('Sittinhg here waiting to build');
                    creep.moveTo(constructionSource);
                }                  
            } else if (creep.memory.lastAction == ACTIONS.BUILD) {                
                //check if there are containers near a resource that are still a construction site and need to be built
                var getNCons = creep.getObject(creep.memory.lastBuild);
                if (getNCons && creep.store[RESOURCE_ENERGY] != 0) {  
                    //console.log('22222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222');                  
                    var target = Game.getObjectById(creep.memory.lastBuild);
                    if (!creep.pos.inRangeTo(target,3)) {
                        console.log('Sittinhg here waiting to build');
                        creep.moveTo(target);                        
                    }
                    if(creep.build(getNCons) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(getNCons);
                        creep.memory.lastAction = ACTIONS.BUILD;
                        creep.memory.lastBuild = getNCons.id;
                    }
                } else {
                    var construction = creep.room.find(FIND_CONSTRUCTION_SITES);                
                    if(creep.build(construction[0]) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(construction[0]);
                        //console.log('11111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111');                  
                        creep.memory.lastAction = ACTIONS.BUILD;
                        creep.memory.lastBuild = construction[0].id;
                    }
                }
                
            } else if (harvesterBuildContainer) {                
                //check if there are containers near a resource that are still a construction site and need to be built
                //console.log('harvester.harvestBuildercontainer',harvesterContainersToBuild);                
                var target = Game.getObjectById(harvesterContainersToBuild[0]);
                if (!creep.pos.inRangeTo(target,3)) {
                    console.log('Sittinhg here waiting to build');
                    creep.moveTo(target);                        
                }
                if(creep.build(target) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(target);
                    creep.memory.lastAction = ACTIONS.BUILD;
                    creep.memory.lastBuild = target.id;
                }
            } else if (sourceContainer && depositFor != DEPOSIT_FOR.POPULATION) {
                //console.log('has container for deposit. ' + creep.memory.source);                            
                if (creep.memory.sourceCountainer === undefined) {
                    var containerSourceId = harvesterContainers[0];
                    var containerDeposit = Game.getObjectById(containerSourceId);
                    if(creep.transfer(containerDeposit, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(containerDeposit);
                    }                                        
                }
                //console.log('containerSource: ' + containerSource.memory.);
            } else if (depositFor == DEPOSIT_FOR.CONSTRUCTION) {
                //help a builder out
                var construction = creep.room.find(FIND_CONSTRUCTION_SITES);                
                if(creep.build(construction[0]) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(construction[0]);
                    //console.log('11111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111');                  
                    creep.memory.lastAction = ACTIONS.BUILD;
                    creep.memory.lastBuild = construction[0].id;
                }
            } else {     
                //or go to spawn            
                if (deposits.length > 0) {
                    if (creep.transfer(deposits[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(deposits[0]);
                    }
                } else {
                    if(creep.transfer(Game.spawns['Spawn1'], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(Game.spawns['Spawn1']);
                    }
                }
                console.log('11111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111');                  
            }
        }        
    },
    // checks if the room needs to spawn a creep
    spawn: function(room, level, roleDistribution,numberExtensions) {
        var harvesters = _.filter(Game.creeps, (creep) => creep.memory.role == 'harvester' && creep.room.name == room.name);
        console.log('Harvesters: ' + roleDistribution.total, room.name);        
        if (roleDistribution.total < roleDistribution.min 
            && numberExtensions >= roleDistribution.minExtensions 
            && roleDistribution.total <= roleDistribution.max) {
            return true;
        }
    },
    // returns an object with the data to spawn a new creep
    spawnData: function(room, level) {
            let name = 'harvester' + Game.time;
            let memory = {role: 'harvester'};
            if(level <= 1) {
                let body = [WORK, CARRY, MOVE];
                return {name, body, memory};
            } else
            if(level <= 2) {
                let body = [WORK, WORK, CARRY, MOVE];
                return {name, body, memory};
            } else
            if(level <= 3) {
                let body = [WORK, WORK, CARRY, MOVE, MOVE];
                return {name, body, memory};
            } else
            if(level <= 4) {
                let body = [WORK, WORK, WORK, CARRY, MOVE, MOVE];
                return {name, body, memory};
            } else
            if(level <= 5) {
                let body = [WORK, WORK, WORK, CARRY, MOVE, MOVE, MOVE];
                return {name, body, memory};
            } else
            if(level <= 6) {
                let body = [WORK, WORK, WORK, WORK, CARRY, MOVE, MOVE];
                return {name, body, memory};
            } else
            if(level <= 7) {
                let body = [WORK, WORK, WORK, WORK, CARRY, CARRY, MOVE, MOVE];
                return {name, body, memory};
            } else
            if(level <= 8) {
                let body = [WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, MOVE, MOVE];
                return {name, body, memory};
            } else
            if(level <= 9) {
                let body = [WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, MOVE, MOVE, MOVE];
                return {name, body, memory};
            } else
            if(level >= 10) {
                let body = [WORK, WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, MOVE, MOVE, MOVE];
                return {name, body, memory};
            }
    }
};

module.exports = harvester;