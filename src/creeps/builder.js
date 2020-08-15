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
        // var continueBuild = false;
        // if (creep.energy != 0 && creep.memory.lastAction == ACTIONS.BUILD) {
        //     continueBuild = true;
        // }
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
        
        if(creep.store[RESOURCE_ENERGY] != 0 && creep.memory.lastAction == ACTIONS.BUILD) {
            console.log('**00000000000000000000000000000000000000000000000000000000000000000000000000000000000');                  
            if (creep.memory.lastBuild == undefined) {                
                var construction = creep.room.find(FIND_CONSTRUCTION_SITES);                
                if(creep.build(construction[0]) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(construction[0]);
                    console.log('11111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111');                  
                    creep.memory.lastAction = ACTIONS.BUILD;
                    creep.memory.lastBuild = construction[0].id;
                }
            } else {
                //continue to work a consutruction site as long as it returns an object
                //when it no longer returns an object, find a new construction site
                var getNCons = creep.getObject(creep.memory.lastBuild);
                if (getNCons && creep.store[RESOURCE_ENERGY] != 0) {  
                    console.log('22222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222');                  
                    if(creep.build(getNCons) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(getNCons);
                        creep.memory.lastAction = ACTIONS.BUILD;
                        creep.memory.lastBuild = getNCons.id;
                    }
                } else if (!getNCons) {
                    var construction = creep.room.find(FIND_CONSTRUCTION_SITES);                
                    if(creep.build(construction[0]) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(construction[0]);
                        console.log('11111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111');                  
                        creep.memory.lastAction = ACTIONS.BUILD;
                        creep.memory.lastBuild = construction[0].id;
                    }
                } else if (creep.store[RESOURCE_ENERGY] == 0) {
                    //go to default source
                    console.log('33333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333');                  
                    var source = creep.getObject(creep.memory.source);
                    if(creep.harvest(source) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(source);
                        creep.memory.lastAction = ACTIONS.HARVEST;
                        creep.say('Harvesting');
                    }
                }
            }   
        } else if (creep.memory.lastAction == ACTIONS.HARVEST) {
            console.log('zzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzz');                  
            if (creep.store.getFreeCapacity() > 0) {
                var source = creep.getObject(creep.memory.source);

                if (containerDeposit != undefined) {
                    var targetContainer = Game.getObjectById(containerDeposit);
                    if (!creep.pos.inRangeTo(targetContainer,1)) {
                        console.log('Sittinhg here waiting to build');
                        creep.moveTo(targetContainer);
                    }                  
                    console.log('***************************************************harvest container',JSON.stringify(creep.withdraw(targetContainer)));
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

                var getNCons = creep.getObject(creep.memory.lastBuild);
                
                console.log('3333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333');                  
                if (getNCons) {
                    if(creep.build(getNCons) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(getNCons);
                        creep.memory.lastAction = ACTIONS.BUILD;
                        creep.memory.lastBuild = getNCons.id;
                    }
                } else {
                    var construction = creep.room.find(FIND_CONSTRUCTION_SITES);                
                    if(creep.build(construction[0]) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(construction[0]);
                        console.log('11111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111');                  
                        creep.memory.lastAction = ACTIONS.BUILD;
                        creep.memory.lastBuild = construction[0].id;
                    }
                }

            }
            
        } else {

            var source = creep.getObject(creep.memory.source);
            if(creep.harvest(source) == ERR_NOT_IN_RANGE) {
                creep.moveTo(source);
                creep.memory.lastAction = ACTIONS.HARVEST;
                creep.say('Harvesting');
            }

        }
    },
    // checks if the room needs to spawn a creep
    spawn: function(room, level, roleDistribution,numberExtensions) {
        var builders = _.filter(Game.creeps, (creep) => creep.memory.role == 'builder' && creep.room.name == room.name);
        console.log('builders: ' + roleDistribution.total, room.name);
        if (roleDistribution.total < roleDistribution.min && 
            numberExtensions >= roleDistribution.minExtensions && 
            roleDistribution.total <= roleDistribution.max) {
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