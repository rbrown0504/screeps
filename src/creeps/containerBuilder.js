var containerBuilder = {

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
        var buildContainer = false;
        var buildContainerSource = new Array();
        _.forEach(creep.room.memory.sources, function(source) {
            if (source.containersNear.length == 0) {
                //build containers
                buildContainer = true;
                buildContainerSource.push(source.id);
            }
        });

        //check for extensions around the spawn
        //if there is the right amount for the current level, suicide
        //if there is not the right amount for the current level, contruct and build
        
        if(creep.store[RESOURCE_ENERGY] != 0 && creep.memory.lastAction == ACTIONS.BUILD) {                         
            console.log('_______________________________LAST ACTION BUILD__________________________');
            if (creep.memory.lastBuild == undefined) {                        
                var constructionSites = _.filter(Game.constructionSites, (site) => site.room.name == creep.room.name && site.structureType == 'container');
                creep.buildSite(constructionSites[0],ACTIONS);
            } else {
                //continue to work a consutruction site as long as it returns an object
                //when it no longer returns an object, find a new construction site        

                var getNCons = creep.getObject(creep.memory.lastBuild);
                if (getNCons && creep.store[RESOURCE_ENERGY] != 0) {  
                    console.log('_______________________________BUILD__________________________');
                    creep.buildSite(getNCons,ACTIONS);                    
                } else if (!getNCons) {                                        
                    var constructionSites = _.filter(Game.constructionSites, (site) => site.room.name == creep.room.name && site.structureType == 'container');;                    
                    //console.log('buildResult ', creep.build(constructionSites[0]),'construction',construction);                    
                    var buildResult = creep.buildSite(constructionSites[0],ACTIONS);
                    if(buildResult != 0) {
                        console.log('_______________________________construct container__________________________');
                                                
                    }
                } else if (creep.store[RESOURCE_ENERGY] == 0) {
                    //go to default source
                    var source = creep.getObject(creep.memory.source);
                    creep.harvestEnergy(source,ACTIONS);
                }
            }   
        } else if (creep.memory.lastAction == ACTIONS.HARVEST) {
            //console.log('zzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzz');                  
            if (creep.store.getFreeCapacity() > 0) {
                var source = creep.getObject(creep.memory.source);
                //first try to find a container with available energy. If not, go and harvest a source
                creep.harvestEnergy(source,ACTIONS);                                
            } else {
                //GO DO BUILD STUFF
                var getNCons = creep.getObject(creep.memory.lastBuild);                
                if (getNCons) {
                    creep.buildSite(getNCons,ACTIONS);                
                } else {
                    //get source                                        
                    var constructionSites = _.filter(Game.constructionSites, (site) => site.room.name == creep.room.name && site.structureType == 'container');
                    //console.log('buildResult ', creep.build(constructionSites[0]),'construction',construction);                                        
                    var buildResult = creep.buildSite(constructionSites[0],ACTIONS);
                    console.log('buildSpotSource:',JSON.stringify(buildContainerSource));
                    if(buildResult != 0) {
                        console.log('_______________________________construct container1_________________');
                        //console.log(JSON.stringify(creep.getObject(buildContainerSource[0])));     
                        if (buildContainerSource.length > 0) {
                            var source = creep.getObject(buildContainerSource[0]);                                           
                            var site = creep.getSourceContainerBuildSpot(creep,source,1);
                            console.log(JSON.stringify(site));
                            if (site != undefined) {
                                creep.constructContainer(site);
                            } else {
                                var site2 = creep.getSourceContainerBuildSpot(creep,source,2);    
                                if (site2 != undefined) {
                                    creep.constructContainer(site2);
                                }
                            }
                        } else {                            
                            creep.suicide();
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
        if (roleDistribution.total < min && 
            room.memory.numberExtensions >= roleDistribution.minExtensions && 
            roleDistribution.total <= roleDistribution.max && 
            room.memory.sourceNeedsContainer) {
            return true;
        }
    },
    // returns an object with the data to spawn a new creep
    spawnData: function(room, level) {
            let name = 'containerBuilder' + Game.time;
            let memory = {role: 'containerBuilder'};
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

module.exports = containerBuilder;