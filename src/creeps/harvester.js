const { map } = require("lodash");

var harvester = {

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
            //console.log('it would do this.. deposit for construction');
        } else {
            //go to containers or spawn
            depositFor = DEPOSIT_FOR.POPULATION;
            //console.log('it would do this.. deposit for population');
        }                
        var harvesterBuildContainer = false;
        var sourceContainer = false;
        var harvesterContainersToBuild = new Array();
        var harvesterContainers = new Array();
        //make a list of containers available
        _.forEach(creep.room.memory.sources, function(source) {
            if (source.containersNear.length > 0) {            
                _.forEach(source.containersNear, function(theSource) {
                    var sourceSplit = theSource.split("__");
                    if (sourceSplit[1] == 'underConstruction') {                    
                        harvesterContainersToBuild.push(sourceSplit[0]);                    
                        if (roleDistribution['builder'].total == 0) {
                            harvesterBuildContainer = true;
                        }             
                        
                    } else if (sourceSplit[1] == 'container') {
                        sourceContainer = true;
                        harvesterContainers.push(sourceSplit[0]);                    
                    }
                });
            }
        });

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
            } else if (creep.memory.lastAction == ACTIONS.BUILD) {
                //check if there are containers near a resource that are still a construction site and need to be built
                var getNCons = creep.getObject(creep.memory.lastBuild);
                if (getNCons && creep.store[RESOURCE_ENERGY] != 0) {  
                    creep.buildSite(getNCons,ACTIONS);
                } else {
                    var construction = creep.room.find(FIND_CONSTRUCTION_SITES);                
                    creep.buildSite(construction[0],ACTIONS);                    
                }
            } else if (harvesterBuildContainer && depositFor != DEPOSIT_FOR.POPULATION) {                     
                //check if there are containers near a resource that are still a construction site and need to be built
                var target = Game.getObjectById(harvesterContainersToBuild[0]);
                creep.buildSite(target,ACTIONS);
            } else if (depositFor == DEPOSIT_FOR.CONSTRUCTION) {   
                //help a builder out
                var construction = creep.room.find(FIND_CONSTRUCTION_SITES);                
                creep.buildSite(construction[0],ACTIONS);                
            } else {                     
                if (roleDistribution['carrier'].total > 1) {
                    creep.depositContainer(null,ACTIONS);
                } else {
                    creep.deposit(null,ACTIONS)
                }             
            }
        }        
    },
    // checks if the room needs to spawn a creep
    spawn: function(room, level, roleDistribution) {
        //var harvesters = _.filter(Game.creeps, (creep) => creep.memory.role == 'harvester' && creep.room.name == room.name);
        //number of deposits
        //var depositContainers =  this.getDepositContainers();
        //console.log('spawnHarvesters: ', 'depositNeeded: ', room.memory.depositNeeded);
        var min = roleDistribution.min;
        switch(room.memory.numberExtensions) {
            case 0:
                min = 4;
                break;
            case 1:
                min = 6;
                break;
            case 2:
                min = 6;
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
        
        
        //console.log('Harvesters: ' + roleDistribution.total, room.name);        
        if (roleDistribution.total < min
            && room.memory.numberExtensions >= roleDistribution.minExtensions 
            && roleDistribution.total <= roleDistribution.max
            && room.memory.totalContainers == 0) {
            return true;
        }
    },
    // returns an object with the data to spawn a new creep
    spawnData: function(room, level) {
            let name = 'harvester' + Game.time;
            let memory = {role: 'harvester'};
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

module.exports = harvester;