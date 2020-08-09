var harvester = {

    /** @param {Creep} creep **/
    run: function(creep) {
        if (creep.memory.sourceRoom == undefined) {
            creep.memory.sourceRoom = creep.room.name;
        }
        //ADD A DEFAULT SOURCE IF ONE DOESN'T CURRENTLY EXIST
        if (creep.memory.source == undefined) {
            var sources = creep.room.find(FIND_SOURCES);
            creep.memory.source = sources[0].id;
        }

        if(creep.store.getFreeCapacity() > 0) {
            var source = creep.getObject(creep.memory.source);
            if(creep.harvest(source) == ERR_NOT_IN_RANGE) {
                creep.moveTo(source);
            }
        } else {            
            if(creep.transfer(Game.spawns['Spawn1'], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                creep.moveTo(Game.spawns['Spawn1']);
            }
        }
    },
    // checks if the room needs to spawn a creep
    spawn: function(room, level) {
        var harvesters = _.filter(Game.creeps, (creep) => creep.memory.role == 'harvester' && creep.room.name == room.name);
        console.log('Harvesters: ' + harvesters.length, room.name);

        if (harvesters.length < 2) {
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
            let name = 'Harvester' + Game.time;
            //let body = [WORK, CARRY, MOVE];
            let memory = {role: 'harvester'};
        
            return {name, abilities, memory};
    }
};

module.exports = harvester;