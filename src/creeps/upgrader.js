var roleUpgrader = {

    /** @param {Creep} creep **/
    run: function(creep) {
        var ACTIONS = {
            HARVEST: 1,
            DEPOSIT: 2,
            BUILD: 3,
            UPGRADE: 4
        };
        if (creep.memory.sourceRoom == undefined) {
            creep.memory.sourceRoom = creep.room.name;
        }
        //GET LAST ACTION AND GO TO THAT.
        var continueUpgrade = false;
        if (creep.energy != 0 && creep.memory.lastAction == ACTIONS.UPGRADE) {
            continueUpgrade = true;
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
        //console.log('containerDeposit ',containerDeposit);

        if(creep.store.getFreeCapacity() > 0 && !continueUpgrade) {
            //go to default source
            var source = creep.getObject(creep.memory.source);
            // if(creep.harvest(source) == ERR_NOT_IN_RANGE) {
            //     creep.moveTo(source);
            //     creep.memory.lastAction = ACTIONS.HARVEST;
            //     creep.say('Harvesting');
            // }
            if (containerDeposit != undefined) {
                var targetContainer = Game.getObjectById(containerDeposit);
                if (!creep.pos.inRangeTo(targetContainer,1)) {
                    creep.moveTo(targetContainer);
                }                  
                if(creep.withdraw(targetContainer,RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(targetContainer.pos);
                }
            } else {
                if(creep.harvest(source) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(source);
                    creep.memory.lastAction = ACTIONS.HARVEST;
                    creep.say('11Harvesting');
                }
            }
        } else if (creep.store[RESOURCE_ENERGY] == 0) {
            creep.say('Empty');
            // var source = creep.getObject(creep.memory.source);
            // if(creep.harvest(source) == ERR_NOT_IN_RANGE) {
            //     creep.moveTo(source);
            //     creep.memory.lastAction = ACTIONS.HARVEST;
            // }
            if (containerDeposit != undefined) {
                var targetContainer = Game.getObjectById(containerDeposit);
                if (!creep.pos.inRangeTo(targetContainer,1)) {
                    creep.moveTo(targetContainer);
                }                  
                if(creep.withdraw(targetContainer,RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(targetContainer.pos);
                }
                if (containerDeposit != undefined) {
                    var targetContainer = Game.getObjectById(containerDeposit);
                    if (!creep.pos.inRangeTo(targetContainer,1)) {
                        //console.log('Sittinhg here waiting to build');
                        creep.moveTo(targetContainer);
                    }                  
                    if(creep.withdraw(targetContainer,RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(targetContainer.pos);
                    }
                } else {
                    if(creep.harvest(source) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(source);
                        creep.memory.lastAction = ACTIONS.HARVEST;
                        creep.say('11Harvesting');
                    }
                }
            } else {
                if(creep.harvest(source) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(source);
                    creep.memory.lastAction = ACTIONS.HARVEST;
                    creep.say('11Harvesting');
                }
            }
        } else {
            if(creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                creep.moveTo(creep.room.controller);
                creep.memory.lastAction = ACTIONS.UPGRADE;
            }
        }
    },
    // checks if the room needs to spawn a creep
    spawn: function(room, level, roleDistribution,numberExtensions) {
        var upgraders = _.filter(Game.creeps, (creep) => creep.memory.role == 'upgrader' && creep.room.name == room.name);
        console.log('Upgraders: ' + roleDistribution.total, room.name);
        if (roleDistribution.total < roleDistribution.min 
            && numberExtensions >= roleDistribution.minExtensions
            && roleDistribution.total <= roleDistribution.max) {
            return true;
        }
    },
    // returns an object with the data to spawn a new creep
    spawnData: function(room, level) {
            let name = 'Upgrader' + Game.time;
            let memory = {role: 'upgrader'};
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

module.exports = roleUpgrader;