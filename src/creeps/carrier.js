const { map } = require("lodash");

var carrier = {

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

        var deposits = creep.getOpenDeposits();
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
        } else {
            //go to containers or spawn
            depositFor = DEPOSIT_FOR.POPULATION;
        }        

        //start doing stuff
        if(creep.store.getFreeCapacity() > 0 && creep.memory.lastAction != ACTIONS.DEPOSIT) {
            var containers = creep.getHarvestContainers();
            //console.log('harvesContainers: ',containers);
            if (containers.length > 0) {
                creep.harvestContainer(containers[0],ACTIONS);
            }
        } else if (creep.store[RESOURCE_ENERGY] == 0) {
            creep.say('Empty');
            //get energy from container
            var containers = creep.getHarvestContainers();
            if (containers.length > 0) {

                creep.harvestContainer(containers[0],ACTIONS);
            }            
        } else if (creep.memory.lastAction == ACTIONS.DEPOSIT) {
            creep.deposit(deposits[0],ACTIONS);
        } else if (creep.memory.lastAction == ACTIONS.HARVEST) {
            var containers = creep.getHarvestContainers();

            if (creep.store.getFreeCapacity() == 0) {
                if (deposits.length > 0) {
                    creep.deposit(deposits[0],ACTIONS);
                } else {
                    console.log('CARRIER: Deposits Full');
                }                                
            } else {
                if (containers.length > 0) {
                    creep.harvestContainer(containers[0],ACTIONS);
                }                                             
            }
        } else if (creep.store[RESOURCE_ENERGY] == 0) {
            creep.say('Empty');
            //get energy from container
            var containers = creep.getHarvestContainers();

            if (containers.length > 0) {
                creep.harvestContainer(containers[0],ACTIONS);
            }            
        } else {   
            //console.log('6666666666666666666666666666666666');
            var containers = creep.getHarvestContainers();
            if (containers.length > 0) {
                creep.harvestContainer(containers[0],ACTIONS);
            }         
        }                
                 
    },
    // checks if the room needs to spawn a creep
    spawn: function(room, level, roleDistribution) {
        //var carriers = _.filter(Game.creeps, (creep) => creep.memory.role == 'carrier' && creep.room.name == room.name);        
        var min = roleDistribution.min;
        switch(room.memory.numberExtensions) {
            case 0:
                min = 0;
                break;
            case 1:
                min = 2;
                break;
            case 2:
                min = 4;
                break;
            case 3:
                min = 6;
                break;
            case 4:
                min = 6;
                break;            
            case 5:
                min = 6;
                break;                        
        }

        switch(room.memory.totalContainers) {
            case 0:
                min = 0;
                break;
            case 1:
                min = 6;
                break;
            case 2:
                min = 12;
                break;
            case 3:
                min = 16;
                break;
            case 4:
                min = 20;
                break;            
            case 5:
                min = 24;
                break;                        
        }
        
        //console.log('carriers: ' + roleDistribution.total, room.name);        
        if (roleDistribution.total < min
            && room.memory.numberExtensions >= roleDistribution.minExtensions 
            && roleDistribution.total <= roleDistribution.max) {
            return true;
        }
    },
    // returns an object with the data to spawn a new creep
    spawnData: function(room, level) {
            let name = 'carrier' + Game.time;
            let memory = {role: 'carrier'};
            if(level <= 1) {
                let body = [CARRY, MOVE];
                return {name, body, memory};
            } else
            if(level <= 2) {
                let body = [CARRY, CARRY, MOVE];
                return {name, body, memory};
            } else
            if(level <= 3) {
                let body = [CARRY, CARRY, MOVE, MOVE];
                return {name, body, memory};
            } else
            if(level <= 4) {
                let body = [CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE];
                return {name, body, memory};
            } else
            if(level <= 5) {
                let body = [CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE];
                return {name, body, memory};
            } else
            if(level <= 6) {
                let body = [CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE];
                return {name, body, memory};
            } else
            if(level <= 7) {
                let body = [CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE];
                return {name, body, memory};
            } else
            if(level <= 8) {
                let body = [CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE];
                return {name, body, memory};
            } else
            if(level <= 9) {
                let body = [CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE];
                return {name, body, memory};
            } else
            if(level >= 10) {
                let body = [CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY,  CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE];
                return {name, body, memory};
            }
    }
};

module.exports = carrier;