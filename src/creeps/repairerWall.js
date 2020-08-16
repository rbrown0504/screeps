var repairerWall = {

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
            if (creep.memory.lastBuild == undefined) {
                var construction = creep.repairWall(null,ACTIONS);          
            } else {
                //continue to work a consutruction site as long as it returns an object
                //when it no longer returns an object, find a new construction site
                var getNCons = creep.getObject(creep.memory.lastBuild);
                if (getNCons && creep.store[RESOURCE_ENERGY] != 0) {  
                    var construction = creep.repairWall(getNCons,ACTIONS);
                } else if (!getNCons) {
                    var construction = creep.repairWall(null,ACTIONS);
                    if(buildResult != 0) {
                    }
                } else if (creep.store[RESOURCE_ENERGY] == 0) {
                    //go to default source                    
                    var source = creep.getObject(creep.memory.source);
                    creep.harvestSource(source,ACTIONS);                    
                }
            }   
        } else if (creep.memory.lastAction == ACTIONS.HARVEST) {            
            if (creep.store.getFreeCapacity() > 0) {                
                //first try to find a container with available energy. If not, go and harvest a source                
                var openContainers = creep.getHarvestContainers();    
                if (openContainers.length > 0) {
                    creep.harvestContainer(openContainers[0],ACTIONS);                                    
                }  else {
                    //harvest source
                    var source = creep.getObject(creep.memory.source);
                    creep.harvestSource(source,ACTIONS);
                }                                                              
            } else {
                //GO DO BUILD STUFF                
                var getNCons = creep.getObject(creep.memory.lastBuild);       
                var confirmRepair = creep.confirmRepair(getNCons);                         
                console.log('repairWall',getNCons);  
                if (confirmRepair) {
                    var construction = creep.repairWall(getNCons,ACTIONS);                    
                } else {                    
                    var construction = creep.repairWall(null,ACTIONS);                    
                }                    
            }
        } else {
            var source = creep.getObject(creep.memory.source);
            creep.harvestSource(source,ACTIONS);                        
        }
    },
    // checks if the room needs to spawn a creep
    spawn: function(room, level, roleDistribution) {
        var repairerWalls = _.filter(Game.creeps, (creep) => creep.memory.role == 'repairerWall' && creep.room.name == room.name);
        //console.log('repairerWalls: ' + roleDistribution.total, room.name);
        var min = roleDistribution.min;
        if (room.memory.repairWalls > 0 && room.memory.repairWalls <= 5) {
            min = 1;
        } else if (room.memory.repairWalls > 5 && room.memory.repairWalls <= 10) {
            min = 1;
        } else if (room.memory.repairWalls > 10 && room.memory.repairWalls <= 15) {
            min = 2;
        } else if (room.memory.repairWalls > 15 && room.memory.repairWalls <= 20) {
            min = 2;
        } else if (room.memory.repairWalls > 20 && room.memory.repairWalls <= 25) {
            min = 3;
        } else if (room.memory.repairWalls > 25 && room.memory.repairWalls <= 30) {
            min = 3;
        } else if (room.memory.repairWalls > 35 && room.memory.repairWalls <= 40) {
            min = 4;
        } else if (room.memory.repairWalls > 45 && room.memory.repairWalls <= 50) {
            min = 4;
        } else if (room.memory.repairWalls > 55 && room.memory.repairWalls <= 60) {
            min = 5;
        } else if (room.memory.repairWalls > 60 && room.memory.repairWalls <= 65) {
            min = 5;
        } else if (room.memory.repairWalls > 65 && room.memory.repairWalls <= 70) {
            min = 6;
        } else if (room.memory.repairWalls > 70 && room.memory.repairWalls <= 75) {
            min = 6;
        } else if (room.memory.repairWalls > 75 && room.memory.repairWalls <= 80) {
            min = 7;
        } else if (room.memory.repairWalls > 80 && room.memory.repairWalls <= 85) {
            min = 7;
        } else if (room.memory.repairWalls > 85) {
            min = 8;
        }   

        if (roleDistribution.total < min && 
            room.memory.numberExtensions >= roleDistribution.minExtensions && 
            roleDistribution.total <= roleDistribution.max && room.memory.repairWalls > 0) {
            return true;
        }
    },
    // returns an object with the data to spawn a new creep
    spawnData: function(room, level) {
            let name = 'repairerWall' + Game.time;
            let memory = {role: 'repairerWall'};
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

module.exports = repairerWall;