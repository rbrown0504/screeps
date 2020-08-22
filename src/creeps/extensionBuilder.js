var extensionBuilder = {

    /** @param {Creep} creep **/
    run: function(creep) {
        var ACTIONS = {
            HARVEST: 1,
            DEPOSIT: 2,
            BUILD: 3,
            CONSTRUCT: 4
        };
        if (creep.memory.sourceRoom == undefined) {
            creep.memory.sourceRoom = creep.room.name;
        }
        //if at level maximum of extensions, creep is no longer needed
        var extensionsNeeded = room.getExtensionsNeeded();        
        if (extensionsNeeded == creep.room.memory.numberExtensions) {
            creep.suicide();
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

        var containerDeposit;
        _.forEach(creep.room.memory.sources, function(source) {
            if (source.containersBuilt.length > 0) { 
                containerDeposit = source.containersBuilt[0];
            };
        });

        //check for extensions around the spawn
        //if there is the right amount for the current level, suicide
        //if there is not the right amount for the current level, contruct and build        
        if(creep.store[RESOURCE_ENERGY] != 0 && creep.memory.lastAction == ACTIONS.BUILD) {
            //console.log('_______________________________extesnionBuilder BUILD__________________________');                
            if (creep.memory.lastBuild == undefined) {                        
                var constructionSites = _.filter(Game.constructionSites, (site) => site.room.name == creep.room.name && site.structureType == 'extension');;
                creep.buildSite(constructionSites[0],ACTIONS);           
            } else {
                //continue to work a consutruction site as long as it returns an object
                //when it no longer returns an object, find a new construction site
                var getNCons = creep.getObject(creep.memory.lastBuild);
                if (getNCons && creep.store[RESOURCE_ENERGY] != 0) {  
                    creep.buildSite(getNCons,ACTIONS);                    
                } else if (!getNCons) {                                        
                    var constructionSites = _.filter(Game.constructionSites, (site) => site.room.name == creep.room.name && site.structureType == 'extension');;                    
                    //console.log('buildResult ', creep.build(constructionSites[0]),'construction',construction);                    
                    var buildResult = creep.buildSite(constructionSites[0],ACTIONS);
                    if(buildResult != 0) {
                        console.log('_______________________________construct SPAWN EXTENSIONS__________________________');                                                
                        var site = creep.getBuildSpot(creep,Game.spawns['Spawn1'],1);
                        if (site != null) {
                            if (creep.constructSpawnExtensions(site) != 0) {
                                //console.log('something is up. cannot construct a spawn extension');
                            };
                        }                        
                    }
                } else if (creep.store[RESOURCE_ENERGY] == 0) {
                    //go to default source                    
                    var source = creep.getObject(creep.memory.source);
                    creep.harvestEnergy(source,ACTIONS);
                }
            }   
        } else if (creep.memory.lastAction == ACTIONS.HARVEST) {
            console.log('_______________________________extesnionBuilder HARVEST_____________________________________');
            //console.log('zzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzz');                  
            if (creep.store.getFreeCapacity() > 0) {
                var source = creep.getObject(creep.memory.source);
                //first try to find a container with available energy. If not, go and harvest a source
                creep.harvestEnergy(source,ACTIONS);
                console.log('_______________________________extesnionBuilder HARVESTING_____________________________________');                                
            } else {
                //GO DO BUILD STUFF
                var getNCons = creep.getObject(creep.memory.lastBuild);                                
                if (getNCons) {
                    creep.buildSite(getNCons,ACTIONS);                
                } else {
                                                            
                    var constructionSites = _.filter(Game.constructionSites, (site) => site.room.name == creep.room.name && site.structureType == 'extension');;
                    //console.log('buildResult ', creep.build(constructionSites[0]),'construction',construction);                    
                    var buildResult = creep.buildSite(constructionSites[0],ACTIONS);
                    if(buildResult != 0) {
                        //console.log('_______________________________construct SPAWN EXTENSIONS1__________________________');                                                
                        var site = creep.getBuildSpot(creep,Game.spawns['Spawn1'],1);
                        if (site != null) {
                            if (creep.constructSpawnExtensions(site) != 0) {
                                //console.log('something is up. cannot construct a spawn extension');
                            };
                        }                        
                    }  
                }                    
            }
        } else {
            var source = creep.getObject(creep.memory.source);
            creep.harvestEnergy(source,ACTIONS);
            
        }
    },
    // checks if the room needs to spawn a creep
    spawn: function(room, level, roleDistribution) {
        var min = roleDistribution.min;
        if (room.memory.constructExtensions > 0 && room.memory.constructExtensions <= 1) {
            min = 2;
        } else if (room.memory.constructExtensions > 1 && room.memory.constructExtensions <= 10) {
            min = 4;
        } else if (room.memory.constructExtensions > 5 && room.memory.constructExtensions <= 10) {
            min = 4;
        } else if (room.memory.constructExtensions > 10 && room.memory.constructExtensions <= 15) {
            min = 6;
        } else if (room.memory.constructExtensions > 15 && room.memory.constructExtensions <= 20) {
            min = 6;
        } else if (room.memory.constructExtensions > 20 && room.memory.constructExtensions <= 25) {
            min = 8;
        } else if (room.memory.constructExtensions > 25 && room.memory.constructExtensions <= 30) {
            min = 8;
        } else if (room.memory.constructExtensions > 35 && room.memory.constructExtensions <= 40) {
            min = 10;
        } else if (room.memory.constructExtensions > 45 && room.memory.constructExtensions <= 50) {
            min = 10;
        } else if (room.memory.constructExtensions > 55 && room.memory.constructExtensions <= 60) {
            min = 12;
        }
        
        var extensionsNeeded = room.getExtensionsNeeded();        
        if (extensionsNeeded > 0 && room.memory.numberExtensions < extensionsNeeded && room.memory.constructExtensions == 0) {
            min = 1;
        }

        console.log('SPAWN extensionBuilder: ',roleDistribution.total,min,room.memory.numberExtensions,extensionsNeeded,roleDistribution.max);

        if (roleDistribution.total < min && 
            room.memory.numberExtensions >= roleDistribution.minExtensions && 
            room.memory.numberExtensions < extensionsNeeded && 
            roleDistribution.total <= roleDistribution.max) {
            return true;
        }
    },
    // returns an object with the data to spawn a new creep
    spawnData: function(room, level) {
            let name = 'extensionBuilder' + Game.time;
            let memory = {role: 'extensionBuilder'};
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

module.exports = extensionBuilder;