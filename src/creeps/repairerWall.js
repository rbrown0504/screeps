var repairerWall = {

    /** @param {Creep} creep **/
    run: function(creep) {
        var ACTIONS = {
            HARVEST: 1,
            DEPOSIT: 2,
            BUILD: 3,
            CONSTRUCT: 4
        };
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

        var containerDeposit;
        _.forEach(creep.room.memory.sources, function(source) {
            if (source.containersBuilt.length > 0) { 
                containerDeposit = source.containersBuilt[0];
            };
        });
        
        if(creep.store[RESOURCE_ENERGY] != 0 && creep.memory.lastAction == ACTIONS.BUILD) {            
            if (creep.memory.lastBuild == undefined) {

                var construction = creep.repairSite(null,ACTIONS);
                console.log('repairerWall:','Result',JSON.stringify(construction));
                //creep.buildSite(construction[0],ACTIONS);                
            } else {
                //continue to work a consutruction site as long as it returns an object
                //when it no longer returns an object, find a new construction site
                //console.log('***********************------------------------------****************************');
                var getNCons = creep.getObject(creep.memory.lastBuild);
                if (getNCons && creep.store[RESOURCE_ENERGY] != 0) {  
                    //creep.buildSite(getNCons,ACTIONS); 
                    var construction = creep.repairSite(getNCons,ACTIONS);
                    console.log('repairerWall:','Result',JSON.stringify(construction));                   
                } else if (!getNCons) {
                    var construction = creep.repairSite(null,ACTIONS);
                    if(buildResult != 0) {
                        console.log('______________________________something is up cannot repair sites__________________________');                                                                                            
                    }
                } else if (creep.store[RESOURCE_ENERGY] == 0) {
                    //go to default source                    
                    var source = creep.getObject(creep.memory.source);
                    creep.harvestSource(source,ACTIONS);                    
                } else {
                    console.log('______________________________________________________________________________');
                }
            }   
        } else if (creep.memory.lastAction == ACTIONS.HARVEST) {
            if (creep.store.getFreeCapacity() > 0) {                
                //first try to find a container with available energy. If not, go and harvest a source
                if (containerDeposit != undefined) {
                    var openContainers = creep.getHarvestContainers();                                
                    creep.harvestContainer(openContainers[0],ACTIONS);                                    
                } else {
                    //harvest source
                    var source = creep.getObject(creep.memory.source);
                    creep.harvestSource(source,ACTIONS);                       
                }
            } else {
                //GO DO BUILD STUFF
                var getNCons = creep.getObject(creep.memory.lastBuild);                
                if (getNCons) {
                    var construction = creep.repairSite(getNCons,ACTIONS);                    
                } else {                    
                    var construction = creep.repairSite(null,ACTIONS);                    
                }                    
            }
        } else {
            var source = creep.getObject(creep.memory.source);
            creep.harvestSource(source,ACTIONS);                        
        }
    },
    // checks if the room needs to spawn a creep
    spawn: function(room, level, roleDistribution) {
        var repairerWalls = _.filter(Game.creeps, (creep) => creep.memory.role == 'repairerWall' && creep.room.name == room.name);
        console.log('repairerWalls: ' + roleDistribution.total, room.name);
        if (roleDistribution.total < roleDistribution.min && 
            room.memory.numberExtensions >= roleDistribution.minExtensions && 
            roleDistribution.total <= roleDistribution.max && room.memory.repairWalls > 0) {
            return true;
        }
    },
    // returns an object with the data to spawn a new creep
    spawnData: function(room, level) {
            let name = 'repairerWall' + Game.time;
            let memory = {role: 'repairerWall'};
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

module.exports = repairerWall;