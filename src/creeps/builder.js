var builder = {

    /** @param {Creep} creep **/
    run: function(creep) {
        var ACTIONS = {
            HARVEST: 1,
            DEPOSIT: 2,
            BUILD: 3
        };
        if (creep.memory.sourceRoom == undefined) {
            creep.memory.sourceRoom = creep.room.name;
        }
        //GET LAST ACTION AND GO TO THAT.
        var continueBuild = false;
        if (creep.energy != 0 && creep.memory.lastAction == ACTIONS.BUILD) {
            continueBuild = true;
        }
        //ADD A DEFAULT SOURCE IF ONE DOESN'T CURRENTLY EXIST
        if (creep.memory.source == undefined) {
            var sources = creep.room.find(FIND_SOURCES);
            creep.memory.source = sources[0].id;
        }
        if(creep.store.getFreeCapacity() > 0 && !continueBuild) {
            //go to default source
            var source = creep.getObject(creep.memory.source);
            if(creep.harvest(source) == ERR_NOT_IN_RANGE) {
                creep.moveTo(source);
                creep.memory.lastAction = ACTIONS.HARVEST;
                creep.say('Harvesting');
            }
        } else {
            //if there is a last construction site in memory, go to that, otherwise, find one
            if (creep.memory.lastBuild == undefined) {                
                var construction = creep.room.find(FIND_CONSTRUCTION_SITES);                
                if(creep.build(construction[0]) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(construction[0]);
                    creep.memory.lastAction = ACTIONS.BUILD;
                    creep.memory.lastBuild = construction[0].id;
                }
            } else {
                var getNCons = creep.getObject(creep.memory.lastBuild);
                if (getNCons && creep.store[RESOURCE_ENERGY] != 0) {                    
                    if(creep.build(getNCons) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(getNCons);
                        creep.memory.lastAction = ACTIONS.BUILD;
                        creep.memory.lastBuild = getNCons.id;
                    }
                } else if (creep.store[RESOURCE_ENERGY] > 0) {
                    var construction = creep.room.find(FIND_CONSTRUCTION_SITES);                
                    if(creep.build(construction[0]) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(construction[0]);
                        creep.memory.lastAction = ACTIONS.BUILD;
                        creep.memory.lastBuild = construction[0].id;
                    }
                } else {
                    creep.say('Empty');
                    var sources = creep.room.find(FIND_SOURCES);
                    if(creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(sources[0]);
                        creep.memory.lastAction = ACTIONS.HARVEST;
                    }
                }
            }
        }
    },
    // checks if the room needs to spawn a creep
    spawn: function(room, level, roleDistribution) {
        var builders = _.filter(Game.creeps, (creep) => creep.memory.role == 'builder' && creep.room.name == room.name);
        console.log('builders: ' + builders.length, room.name);
        if (roleDistribution.total < roleDistribution.min) {
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