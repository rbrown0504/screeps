var builder = {

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

        var containerDeposit;
        _.forEach(creep.room.memory.sources, function(source) {
            if (source.containersBuilt.length > 0) { 
                containerDeposit = source.containersBuilt[0];
            };
        });
        
        if(creep.store[RESOURCE_ENERGY] != 0 && creep.memory.lastAction == ACTIONS.BUILD) {
            //console.log('**00000000000000000000000000000000000000000000000000000000000000000000000000000000000');                  
            if (creep.memory.lastBuild == undefined) {                     
                var construction = creep.room.find(FIND_CONSTRUCTION_SITES);                
                creep.buildSite(construction[0],ACTIONS);                
            } else {
                //continue to work a consutruction site as long as it returns an object
                //when it no longer returns an object, find a new construction site
                //console.log('***********************------------------------------****************************');
                var getNCons = creep.getObject(creep.memory.lastBuild);
                if (getNCons && creep.store[RESOURCE_ENERGY] != 0) {  
                    creep.buildSite(getNCons,ACTIONS);                    
                } else if (!getNCons) {                    
                    var construction = creep.room.find(FIND_CONSTRUCTION_SITES);                
                    //console.log('buildResult ', creep.build(construction[0]),'construction',construction);                    
                    var buildResult = creep.buildSite(construction[0],ACTIONS);
                    if(buildResult != 0) {
                        console.log('_______________________________construct SPAWN EXTENSIONS__________________________');                                                
                        var site = creep.getBuildSpot(creep,Game.spawns['Spawn1'],1);
                        if (site != null) {
                            if (creep.constructSpawnExtensions(site) != 0) {
                                console.log('something is up. cannot construct a spawn extension');
                            };
                        }                        
                    }
                } else if (creep.store[RESOURCE_ENERGY] == 0) {
                    //go to default source
                    //console.log('444444444444444444444444444444444444444444444444444444444444444444444444444444444444444444444444444444444');
                    var source = creep.getObject(creep.memory.source);
                    creep.harvestSource(source,ACTIONS);                    
                } else {
                    console.log('______________________________________________________________________________');
                }
            }   
        } else if (creep.memory.lastAction == ACTIONS.HARVEST) {
            //console.log('zzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzz');                  
            if (creep.store.getFreeCapacity() > 0) {
                var source = creep.getObject(creep.memory.source);
                //first try to find a container with available energy. If not, go and harvest a source
                if (containerDeposit != undefined) {
                    //console.log('HARVEST CONTAINER');
                    var targetContainer = Game.getObjectById(containerDeposit);
                    creep.harvestContainer(targetContainer,ACTIONS);                                        
                } else {
                    //harvest source
                    creep.harvestSource(source,ACTIONS);                       
                }                
            } else {
                //GO DO BUILD STUFF
                var getNCons = creep.getObject(creep.memory.lastBuild);                
                //console.log('***3333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333');                  
                if (getNCons) {
                    creep.buildSite(getNCons,ACTIONS);                
                } else {
                    var construction = creep.room.find(FIND_CONSTRUCTION_SITES);
                    creep.buildSite(construction[0],ACTIONS);
                }                    
            }
        } else {
            var source = creep.getObject(creep.memory.source);
            creep.harvestSource(source,ACTIONS);                        
        }
    },
    // checks if the room needs to spawn a creep
    spawn: function(room, level, roleDistribution,numberExtensions) {
        var builders = _.filter(Game.creeps, (creep) => creep.memory.role == 'builder' && creep.room.name == room.name);
        console.log('builders: ' + roleDistribution.total, room.name);
        if (roleDistribution.total < roleDistribution.min && 
            numberExtensions >= roleDistribution.minExtensions && 
            roleDistribution.total <= roleDistribution.max) {
            return true;
        }
    },
    // returns an object with the data to spawn a new creep
    spawnData: function(room, level) {
            let name = 'builder' + Game.time;
            let memory = {role: 'builder'};
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

module.exports = builder;