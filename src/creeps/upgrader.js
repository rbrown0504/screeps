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
            var sources = creep.room.find(FIND_SOURCES);
            creep.memory.source = sources[0].id;
        }

        if(creep.store.getFreeCapacity() > 0 && !continueUpgrade) {
            //go to default source
            var source = creep.getObject(creep.memory.source);
            if(creep.harvest(source) == ERR_NOT_IN_RANGE) {
                creep.moveTo(source);
                creep.memory.lastAction = ACTIONS.HARVEST;
                creep.say('Harvesting');
            }
        } else if (creep.store[RESOURCE_ENERGY] == 0) {
            creep.say('Empty');
            var source = creep.getObject(creep.memory.source);
            if(creep.harvest(source) == ERR_NOT_IN_RANGE) {
                creep.moveTo(source);
                creep.memory.lastAction = ACTIONS.HARVEST;
            }
        } else {
            if(creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                creep.moveTo(creep.room.controller);
                creep.memory.lastAction = ACTIONS.UPGRADE;
            }
        }
    },
    // checks if the room needs to spawn a creep
    spawn: function(room, level) {
        var upgraders = _.filter(Game.creeps, (creep) => creep.memory.role == 'upgrader' && creep.room.name == room.name);
        console.log('Upgraders: ' + upgraders.length, room.name);

        if (upgraders.length < 2) {
            return true;
        }
    },
    // returns an object with the data to spawn a new creep
    spawnData: function(room, level) {
            var abilities;
            if(level <= 1) {
                abilities = [WORK, CARRY, MOVE];
            } else
            if(level <= 2) {
                abilities = [WORK, WORK, CARRY, MOVE];
            } else
            if(level <= 3) {
                abilities = [WORK, WORK, CARRY, MOVE, MOVE];
            } else
            if(level <= 4) {
                abilities = [WORK, WORK, WORK, CARRY, MOVE, MOVE];
            } else
            if(level <= 5) {
                abilities = [WORK, WORK, WORK, CARRY, MOVE, MOVE, MOVE];
            } else
            if(level <= 6) {
                abilities = [WORK, WORK, WORK, WORK, CARRY, MOVE, MOVE];
            } else
            if(level <= 7) {
                abilities = [WORK, WORK, WORK, WORK, CARRY, CARRY, MOVE, MOVE];
            } else
            if(level <= 8) {
                abilities = [WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, MOVE, MOVE];
            } else
            if(level <= 9) {
                abilities = [WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, MOVE, MOVE, MOVE];
            } else
            if(level >= 10) {
                abilities = [WORK, WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, MOVE, MOVE, MOVE];
            }
            let name = 'Upgrader' + Game.time;
            //let body = [WORK, CARRY, MOVE];
            let memory = {role: 'upgrader'};
        
            return {name, abilities, memory};
    }
};

module.exports = roleUpgrader;