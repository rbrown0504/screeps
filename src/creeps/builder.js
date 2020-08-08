var builder = {

    /** @param {Creep} creep **/
    run: function(creep) {
        var ACTIONS = {
            HARVEST: 1,
            DEPOSIT: 2,
            BUILD: 3
        };
        //console.log(creep.name,' Store Capacity: ' + creep.store.getFreeCapacity());
        if (creep.memory.sourceRoom == undefined) {
            creep.memory.sourceRoom = creep.room.name;
        }
        //GET LAST ACTION AND GO TO THAT.
        var continueBuild = false;
        if (creep.energy != 0 && creep.memory.lastAction == ACTIONS.BUILD) {
            continueBuild = true;
        }

        if(creep.store.getFreeCapacity() > 0 && !continueBuild) {
            var sources = creep.room.find(FIND_SOURCES);
            if(creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) {
                creep.moveTo(sources[0]);
                creep.memory.lastAction = ACTIONS.HARVEST;
            }
        }
        else {
            // here is the sayHello() prototype
            creep.sayDebug();
            var construction = creep.room.find(FIND_CONSTRUCTION_SITES);
            console.log(creep.name,JSON.stringify(construction));            
            if(creep.build(construction[0]) == ERR_NOT_IN_RANGE) {
                creep.moveTo(construction[0]);
                creep.memory.lastAction = ACTIONS.BUILD;
            }
        }
    },
    // checks if the room needs to spawn a creep
    spawn: function(room) {
        var builders = _.filter(Game.creeps, (creep) => creep.memory.role == 'builder' && creep.room.name == room.name);
        console.log('builders: ' + builders.length, room.name);

        if (builders.length < 2) {
            return true;
        }
    },
    // returns an object with the data to spawn a new creep
    spawnData: function(room) {
            let name = 'builder' + Game.time;
            let body = [WORK, CARRY, MOVE];
            let memory = {role: 'builder'};
        
            return {name, body, memory};
    }
};

module.exports = builder;