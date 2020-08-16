var repairer = {

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
                var construction = creep.repairSite(null,ACTIONS);
                //console.log('REPAIRER:','Result',JSON.stringify(construction));             
            } else {
                //continue to work a consutruction site as long as it returns an object
                //when it no longer returns an object, find a new construction site                
                var getNCons = creep.getObject(creep.memory.lastBuild);
                var confirmRepair = creep.confirmRepair(getNCons);                
                if (confirmRepair && creep.store[RESOURCE_ENERGY] != 0) {                      
                    var construction = creep.repairSite(getNCons,ACTIONS);
                    //console.log('REPAIRER:','Result',JSON.stringify(construction), 'confirmRepair', confirmRepair, getNCons,getNCons );
                } else if (!confirmRepair) {
                    var construction = creep.repairSite(null,ACTIONS);
                    if(construction != 0) {
                        console.log('______________________________something is up cannot repair sites__________________________');                                                                                            
                    }
                } else if (creep.store[RESOURCE_ENERGY] == 0) {
                    //go to default source                    
                    var source = creep.getObject(creep.memory.source);
                    creep.harvestEnergy(source,ACTIONS);                                  
                } else {
                    console.log('______________________________________________________________________________');
                }
            }   
        } else if (creep.memory.lastAction == ACTIONS.HARVEST) {
            if (creep.store.getFreeCapacity() > 0) {                
                //first try to find a container with available energy. If not, go and harvest a source
                var source = creep.getObject(creep.memory.source);
                creep.harvestEnergy(source,ACTIONS);                
            } else {
                //GO DO BUILD STUFF
                var getNCons = creep.getObject(creep.memory.lastBuild);                
                if (getNCons) {
                    var construction = creep.repairSite(getNCons,ACTIONS);                    
                } else {                    
                    var construction = creep.repairSite(null,ACTIONS);                    
                }                    
            }
        } else {
            var source = creep.getObject(creep.memory.source);
            creep.harvestEnergy(source,ACTIONS);
        }
    },
    // checks if the room needs to spawn a creep
    spawn: function(room, level, roleDistribution) {
        var repairers = _.filter(Game.creeps, (creep) => creep.memory.role == 'repairer' && creep.room.name == room.name);
        console.log('repairers: ' + roleDistribution.total, room.name);
        var min = roleDistribution.min;
        if (room.memory.repairSites > 0 && room.memory.repairSites <= 5) {
            min = 1;
        } else if (room.memory.repairSites > 5 && room.memory.repairSites <= 10) {
            min = 2;
        } else if (room.memory.repairSites > 10 && room.memory.repairSites <= 15) {
            min = 3;
        } else if (room.memory.repairSites > 15 && room.memory.repairSites <= 20) {
            min = 4;
        } else if (room.memory.repairSites > 20 && room.memory.repairSites <= 25) {
            min = 5;
        } else if (room.memory.repairSites > 25 && room.memory.repairSites <= 30) {
            min = 6;
        } else if (room.memory.repairSites > 35 && room.memory.repairSites <= 40) {
            min = 7;
        } else if (room.memory.repairSites > 45 && room.memory.repairSites <= 50) {
            min = 8;
        } else if (room.memory.repairSites > 55 && room.memory.repairSites <= 60) {
            min = 9;
        }

        if (roleDistribution.total < min && 
            room.memory.numberExtensions >= roleDistribution.minExtensions && 
            roleDistribution.total <= roleDistribution.max && room.memory.repairSites > 0) {
            return true;
        }
    },
    // returns an object with the data to spawn a new creep
    spawnData: function(room, level) {
            let name = 'repairer' + Game.time;
            let memory = {role: 'repairer'};
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

module.exports = repairer;