var harvesterLDRight = {

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
        if (creep.memory.targetRoom == undefined) {
            creep.memory.targetRoom = creep.room.memory.roomRight;
        }        
        //do work
        if (creep.memory.sourceRoom == creep.room.name) {
            
            if (creep.store[RESOURCE_ENERGY] == 0) {
                var exit = creep.room.findExitTo(creep.memory.targetRoom);
                creep.moveTo(creep.pos.findClosestByRange(exit));    
            } else {
                var deposit = creep.depositContainer(null,ACTIONS);
                // if (depositContainer != 0) {
                //     creep.deposit(null,ACTIONS);
                // }
            }
        } else if (creep.memory.targetRoom == creep.room.name) {
            
            if (creep.store.getFreeCapacity()>0 && creep.memory.lastAction != ACTIONS.HARVEST) {                
                var source = creep.getSource();                
                creep.harvestSource(source,ACTIONS);
            } else if (creep.memory.lastAction == ACTIONS.HARVEST & creep.store.getFreeCapacity()>0) {
                var source = creep.getObject(creep.memory.lastHarvest);
                creep.harvestSource(source,ACTIONS);
            } else {
                var exit = creep.room.findExitTo(creep.memory.sourceRoom);
                creep.moveTo(creep.pos.findClosestByRange(exit));
            }            
        }            
    },
    // checks if the room needs to spawn a creep
    spawn: function(room, level, roleDistribution,globalRoleTotals) {
        //var harvesterLDRights = _.filter(Game.creeps, (creep) => creep.memory.role == 'harvesterLDRight' && creep.room.name == room.name);                
        var min = roleDistribution.min;        
        switch(room.memory.numberExtensions) {
            case 0:
                min = 2;
                break;
            case 1:
                min = 4;
                break;
            case 2:
                min = 6;
                break;
            case 3:
                min = 8;
                break;
            case 4:
                min = 8;
                break;            
            case 5:
                min = 8;
                break;
            case 6:
                min = 10;
                break;
            case 7:
                min = 10;
                break;
            case 8:
                min = 10;
                break;
            case 9:
                min = 10;
                break;
            case 10:
                min = 10;
                break;            
            case 11:
                min = 10;
                break;                           
        }
                
        if (globalRoleTotals.total < min
            && globalRoleTotals.total <= roleDistribution.max
            && room.memory.harvestRight
            && room.memory.totalContainers > 0) {
            return true;
        }
    },
    // returns an object with the data to spawn a new creep
    spawnData: function(room, level) {
            let name = 'harvesterLDRight' + Game.time;
            let memory = {role: 'harvesterLDRight'};
            if(level <= 1) {
                let body = [WORK, CARRY, MOVE];
                return {name, body, memory};
            } else
            if(level <= 2) {
                let body = [WORK, CARRY, MOVE, MOVE];
                return {name, body, memory};
            } else
            if(level <= 3) {
                let body = [WORK, CARRY, CARRY, MOVE, MOVE];
                return {name, body, memory};
            } else
            if(level <= 4) {
                let body = [WORK, CARRY, CARRY, MOVE, MOVE, MOVE];
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

module.exports = harvesterLDRight;