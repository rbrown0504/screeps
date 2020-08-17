var claimer = {

    /** @param {Creep} creep **/
    run: function(creep,roleDistribution) {        
        var ACTIONS = {
            HARVEST: 1,
            DEPOSIT: 2,
            BUILD: 3,
            UPGRADE: 4,
            CLAIM: 5
        };        
        if (creep.memory.sourceRoom == undefined) {
            creep.memory.sourceRoom = creep.room.name;
        }
        if (creep.memory.sourceRoom == creep.room.name) {
            //go to exit and leave room
            var exit = creep.room.findExitTo(creep.memory.targetRoom);
            creep.moveTo(creep.pos.findClosestByRange(exit));            
        } else if (creep.memory.targetRoom == creep.room.name) {
            //claim room
            creep.claimRoom(ACTIONS);
        }
    },
    // checks if the room needs to spawn a creep
    spawn: function(room, level, roleDistribution) {                      
        if (Game.spawns.Spawn1.claimRoom != undefined) {
            return true;
        }
    },
    // returns an object with the data to spawn a new creep
    spawnData: function(room, level) {
        let name = 'claimer' + Game.time;
        let memory = {role: 'claimer', targetRoom: Game.spawns.Spawn1.claimRoom};
        let body = [CLAIM, MOVE];
        return {name, body, memory};        
    }
};

module.exports = claimer;