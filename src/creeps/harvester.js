var harvester = {

    /** @param {Creep} creep **/
    run: function(creep,roomMetrics) {
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

            creep.memory.source = creep.getAvailableResource(creep.room);
        }

        if(creep.store.getFreeCapacity() > 0 && !continueDeposit) {
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
            //continue deposit
            //if there are available containers, try that
            //otherwise deposit to spawn

            // if (creep.room.memory.sourceNeedsContainer == true) {
            //     console.log('do my harvester due diligence and build needed containers for the room');
            // }

            if (roomMetrics.totalMyContainers > 0) {
                //if there isn't a single container withing 3 of source, build one
                //otherwise deposit
                //console.log('containers found');
                if (creep.room.memory.sourceNeedsContainer == true) {
                    console.log('do my harvester due diligence and build needed containers for the room');
                    var sourceId = creep.room.memory.sourcesNeedingContainer[0];
                    var source = creep.getObject(sourceId);
                    console.log('SourceToCreat: ' + JSON.stringify(source.pos));
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
                    var top =0;
                    var left = -3;
                    var bottom = +3; 
                    var right = 0;
                    const lookLowerLeft = creep.room.lookForAtArea(LOOK_TERRAIN,source.pos.y+top,source.pos.x+left,source.pos.y+bottom,source.pos.x+right,true);                    
                    var filterForLowerLeft = _.filter(lookLowerLeft, (t) => t.terrain == 'plain' || t.terrain == 'swamp');
                    console.log('filterForfilterFor ' + filterForLowerLeft, filterForLowerLeft.length);
                    
                    //look upper left
                    top = -3;
                    left = -3;
                    bottom = 0; 
                    right = 0;
                    const lookUpperLeft = creep.room.lookForAtArea(LOOK_TERRAIN,source.pos.y+top,source.pos.x+left,source.pos.y+bottom,source.pos.x+right,true);
                    var filterForUpperLeft = _.filter(lookUpperLeft, (t) => t.terrain == 'plain' || t.terrain == 'swamp');
                    //look upper right
                    top = -3;
                    left = 0;
                    bottom = 0; 
                    right = 3;
                    const lookUpperRight = creep.room.lookForAtArea(LOOK_TERRAIN,source.pos.y+top,source.pos.x+left,source.pos.y+bottom,source.pos.x+right,true);
                    var filterForUpperRight = _.filter(lookUpperRight, (t) => t.terrain == 'plain' || t.terrain == 'swamp');
                    //look upper right
                    top = 0;
                    left = 0;
                    bottom = +3;
                    right = 3;
                    const lookLowerRight = creep.room.lookForAtArea(LOOK_TERRAIN,source.pos.y+top,source.pos.x+left,source.pos.y+bottom,source.pos.x+right,true);
                    var filterForLowerRight = _.filter(lookLowerRight, (t) => t.terrain == 'plain' || t.terrain == 'swamp');
                    //const look1 = creep.room.lookForAtArea(LOOK_STRUCTURES,top,left,bottom,right,true);
                    // console.log('LookLowerLeft: '  + JSON.stringify(lookLowerLeft));
                    // console.log('lookUpperLeft: '  + JSON.stringify(lookUpperLeft));
                    // console.log('lookUpperRight: '  + JSON.stringify(lookUpperRight));
                    // console.log('lookLowerRight: '  + JSON.stringify(lookLowerRight));
                    
                    console.log('For Energy Source: ' + source.id + ' There are ' + filterForLowerLeft.length + ' buildable areas in the lower left quadrant 3 range.');
                    console.log('For Energy Source: ' + source.id + ' There are ' + filterForUpperLeft.length + ' buildable areas in the upper left quadrant 3 range.');
                    console.log('For Energy Source: ' + source.id + ' There are ' + filterForUpperRight.length + ' buildable areas in the upper right quadrant 3 range.');
                    console.log('For Energy Source: ' + source.id + ' There are ' + filterForLowerRight.length + ' buildable areas in the lower right quadrant 3 range.');
                    //console.log('Look1: '  + JSON.stringify(look1));
                    console.log('constructionSites: ' + JSON.stringify(Game.constructionSites));
                    if (filterForLowerLeft.length > 0) {
                        console.log('create a flag');
                        creep.say('hjsddsaasdf');
                        creep.moveTo(filterForLowerLeft[0].pos);
                        //creep.pos.createFlag('testFlag');
                        //console.log('CreAtionDtaila: ' + JSON.stringify(Game.spawns['Spawn1']));
                        Game.spawns['Spawn1'].room.createConstructionSite(creep.pos.x,creep.pos.y, STRUCTURE_CONTAINER);

                    }

                    
                    if (!creep.pos.inRangeTo(source,3)) {
                        console.log('Sittinhg here waiting to build');
                        creep.moveTo(source);
                        
                        //Game.spawns[0].room.createConstructionSite(chemin[i].x,chemin[i].y, STRUCTURE_CONTAINER);
                    }
                    //Game.spawns[0].room.createConstructionSite(chemin[i].x,chemin[i].y, STRUCTURE_ROAD);
                    //let path = creep.room.findPath(creep.pos, source.pos);
                    //console.log('PathTo: ' + JSON.stringify(path));
                    // if( !path.length || !targetPos.isEqualTo(path[path.length - 1]) ) {
                    //     path = creep.room.findPath(creep.pos, targetPos, {
                    //         maxOps: 1000, ignoreDestructibleStructures: true
                    //     });
                    // }
                    // if( path.length ) {
                    //     creep.move(path[0].direction);
                    // }
                } else {
                    //
                    console.log('do my harvester regular duty');
                    var sources = creep.room.find(FIND_SOURCES);
                    var nearbyContainer;            
                    _.forEach(sources, function(source) {
                        //console.log('going through sources...' + JSON.stringify(source));
                        var targets = source.pos.findInRange(FIND_STRUCTURES, 3);                
                        _.forEach(targets, function(target) {
                            //console.log('targetFound ' + target);
                            if (target.structureType == STRUCTURE_CONTAINER) {
                                nearbyContainer = target;
                                return true;
                            }
                        });                            
                    });                
                    //console.log('TargetContainer: ' + JSON.stringify(nearbyContainer));
                    if(creep.transfer(nearbyContainer, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(nearbyContainer);
                        creep.memory.lastAction = ACTIONS.DEPOSIT;
                    } else if(creep.transfer(nearbyContainer, RESOURCE_ENERGY) == ERR_FULL) {
                        creep.say('YEP');
                        //find another container if possible
                        //otherwise go to spawn
                    }    
                }                        
            } else {
                //build first container
                                
            }

        }
        // if(creep.store.getFreeCapacity() > 0) {
            
        //     var source = creep.getObject(creep.memory.source);            
            
        //     if (roomMetrics.totalMyContainers > 0) {
        //         //if there isn't a single container withing 3 of source, build one
        //         //otherwise deposit
        //         console.log('containers found');
        //         var sources = creep.room.find(FIND_SOURCES);
        //         var nearbyContainer;            
        //         _.forEach(sources, function(source) {
        //             //console.log('going through sources...' + JSON.stringify(source));
        //             var targets = source.pos.findInRange(FIND_STRUCTURES, 4);                
        //             _.forEach(targets, function(target) {
        //                 //console.log('targetFound ' + target);
        //                 if (target.structureType == STRUCTURE_CONTAINER) {
        //                     nearbyContainer = target;
        //                     return true;
        //                 }
        //             });                            
        //         });
        //         //console.log('hasContainerNearby: ' + nearbyContainer);

        //         if(creep.transfer(nearbyContainer, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
        //             creep.moveTo(nearbyContainer);
        //         }

        //         if (nearbyContainer != undefined) {
        //             //console.log('Source has Container Nearby');  
        //         } 
        //         //look for a container within 3 of the source
        //         //get containers and see if they are near source                                						
        //     } else {
        //         //go to source and build a container within 3 of source
        //     }
        //     //var hasContainerInRange = false;
        //     //var sources = creep.room.find(FIND_SOURCES, {filter : (source) => source.pos.inRangeTo() });
            
            
        //     //var sources = creep.room.find(FIND_SOURCES, {filter : (source) => source.pos.inRangeTo() });
        //     //creep.memory.source = sources[0].id;
        //     // if(creep.harvest(source) == ERR_NOT_IN_RANGE) {
        //     //     creep.moveTo(source);
        //     // }
        // } else {            
        //     if(creep.transfer(Game.spawns['Spawn1'], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
        //         creep.moveTo(Game.spawns['Spawn1']);
        //     }
        // }
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