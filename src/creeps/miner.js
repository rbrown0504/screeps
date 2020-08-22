var miner = {

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
            creep.memory.source = creep.getSource().id;
            //because a miner, assign a default container                   
            var sourceData = creep.room.memory.sources[creep.memory.source];
            if (sourceData.containersBuilt.length > 0) {
                if (creep.getObject(sourceData.containersBuilt[0]) != undefined) {
                    creep.memory.containerDeposit = sourceData.containersBuilt[0];
                }
            }        
        }
        //start doing stuff
        if(creep.store.getFreeCapacity() > 0 && !continueDeposit && !continueBuild) {
            //go to default source            
            var source = creep.getObject(creep.memory.source);
            creep.harvestSource(source,ACTIONS);
        } else if (creep.store[RESOURCE_ENERGY] == 0) {
            creep.say('Empty');
            var source = creep.getObject(creep.memory.source);
            creep.harvestSource(source,ACTIONS);
        } else {                   
            if (creep.store[RESOURCE_ENERGY] == 0) {
                creep.say('Empty');
                var source = creep.getObject(creep.memory.source);
                creep.harvestSource(source,ACTIONS);                                  
            } else {
                if (creep.memory.containerDeposit != undefined) {
                    console.log('hasContainerNeedsDeposit');
                    var container = creep.getObject(creep.memory.containerDeposit);
                    creep.depositContainer(container,ACTIONS);  
                } else {
                    creep.depositContainer(null,ACTIONS);
                }                
            }
        }        
    },
    // checks if the room needs to spawn a creep
    spawn: function(room, level, roleDistribution) {
        //when a container has been built next to a source, that source gets a miner
        var min = roleDistribution.min;
        switch(room.memory.totalContainers) {
            case 0:
                min = 0;
                break;
            case 1:
                min = 6;
                break;
            case 2:
                min = 9;
                break;
            case 3:
                min = 9;
                break;
            case 4:
                min = 9;
                break;            
            case 5:
                min = 9;
                break;                        
        }
        
        
        //console.log('miners: ' + roleDistribution.total, room.name);        
        if (roleDistribution.total < min
            && room.memory.numberExtensions >= roleDistribution.minExtensions 
            && roleDistribution.total <= roleDistribution.max
            && room.memory.totalContainers > 0) {
            return true;
        }
    },
    // returns an object with the data to spawn a new creep
    spawnData: function(room, level) {
            let name = 'miner' + Game.time;
            let memory = {role: 'miner'};
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

module.exports = miner;