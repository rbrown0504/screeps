/* This header is placed at the beginning of the output file and defines the
	special `__require`, `__getFilename`, and `__getDirname` functions.
*/
(function() {
	/* __modules is an Array of functions; each function is a module added
		to the project */
var __modules = {},
	/* __modulesCache is an Array of cached modules, much like
		`require.cache`.  Once a module is executed, it is cached. */
	__modulesCache = {},
	/* __moduleIsCached - an Array of booleans, `true` if module is cached. */
	__moduleIsCached = {};
/* If the module with the specified `uid` is cached, return it;
	otherwise, execute and cache it first. */
function __require(uid, parentUid) {
	if(!__moduleIsCached[uid]) {
		// Populate the cache initially with an empty `exports` Object
		__modulesCache[uid] = {"exports": {}, "loaded": false};
		__moduleIsCached[uid] = true;
		if(uid === 0 && typeof require === "function") {
			require.main = __modulesCache[0];
		} else {
			__modulesCache[uid].parent = __modulesCache[parentUid];
		}
		/* Note: if this module requires itself, or if its depenedencies
			require it, they will only see an empty Object for now */
		// Now load the module
		__modules[uid].call(this, __modulesCache[uid], __modulesCache[uid].exports);
		__modulesCache[uid].loaded = true;
	}
	return __modulesCache[uid].exports;
}
/* This function is the replacement for all `__filename` references within a
	project file.  The idea is to return the correct `__filename` as if the
	file was not concatenated at all.  Therefore, we should return the
	filename relative to the output file's path.

	`path` is the path relative to the output file's path at the time the
	project file was concatenated and added to the output file.
*/
function __getFilename(path) {
	return require("path").resolve(__dirname + "/" + path);
}
/* Same deal as __getFilename.
	`path` is the path relative to the output file's path at the time the
	project file was concatenated and added to the output file.
*/
function __getDirname(path) {
	return require("path").resolve(__dirname + "/" + path + "/../");
}
/********** End of header **********/
/********** Start module 0: C:\Users\RBROW\screeps\src\main.js **********/
__modules[0] = function(module, exports) {
let creepLogic = __require(1,0);
let roomLogic = __require(2,0);
let prototypes = __require(3,0);


module.exports.loop = function () {
    Game.myRooms = _.filter(Game.rooms, r => r.controller && r.controller.level > 0 && r.controller.my);
    var roleDistribution = {
		carrier: {
			total: 0,
			goalPercentage: 0.3,
			currentPercentage: 0,
			max: 2,
			min: 2,
			minExtensions: 0			
        },
        harvester: {
			total: 0,
			goalPercentage: 0.3,
			currentPercentage: 0,
			max: 2,
			min: 2,
			minExtensions: 0			
		},
		builder: {
			total: 0,
			goalPercentage: 0.25,
			currentPercentage: 0,
			max: 15,
			min: 3,
			minExtensions: 0
        },
        builder1: {
			total: 0,
			goalPercentage: 0.25,
			currentPercentage: 0,
			max: 15,
			min: 1,
			minExtensions: 0
		},
		upgrader: {
			total: 0,
			goalPercentage: 0.2,
			currentPercentage: 0,
			max: 3,
			min: 2,
			minExtensions: 0
		}
	};
    for(var name in Game.creeps) {
        var creep = Game.creeps[name];
        let role = creep.memory.role;
        roleDistribution[role].total++;
        if (creepLogic[role]) {
            
        }
    }
    _.forEach(Game.myRooms, r => roomLogic.spawning(r,roleDistribution));
    _.forEach(Game.myRooms, r => roomLogic.defense(r));    
    
    for(var name in Game.creeps) {
        var creep = Game.creeps[name];
        let role = creep.memory.role;
        if (creepLogic[role]) {
            creepLogic[role].run(creep);
        }
    }
    for(var name in Memory.creeps) {
        if(!Game.creeps[name]) {
            delete Memory.creeps[name];
            console.log('Clearing non-existing creep memory:', name);
        }
    }
}
return module.exports;
}
/********** End of module 0: C:\Users\RBROW\screeps\src\main.js **********/
/********** Start module 1: C:\Users\RBROW\screeps\src\creeps\index.js **********/
__modules[1] = function(module, exports) {
let creepLogic = {
    harvester:     __require(4,1),
    upgrader:      __require(5,1),
    builder:      __require(6,1),
}

module.exports = creepLogic;
return module.exports;
}
/********** End of module 1: C:\Users\RBROW\screeps\src\creeps\index.js **********/
/********** Start module 2: C:\Users\RBROW\screeps\src\room\index.js **********/
__modules[2] = function(module, exports) {
let roomLogic = {
    spawning:     __require(7,2),
    defense:     __require(8,2),
}

module.exports = roomLogic;
return module.exports;
}
/********** End of module 2: C:\Users\RBROW\screeps\src\room\index.js **********/
/********** Start module 3: C:\Users\RBROW\screeps\src\prototypes\index.js **********/
__modules[3] = function(module, exports) {
let files = {
    creep: __require(9,3)
}
return module.exports;
}
/********** End of module 3: C:\Users\RBROW\screeps\src\prototypes\index.js **********/
/********** Start module 4: C:\Users\RBROW\screeps\src\creeps\harvester.js **********/
__modules[4] = function(module, exports) {
var harvester = {

    /** @param {Creep} creep **/
    run: function(creep) {
        if (creep.memory.sourceRoom == undefined) {
            creep.memory.sourceRoom = creep.room.name;
        }
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
    spawn: function(room, level, roleDistribution,numberExtensions) {
        var harvesters = _.filter(Game.creeps, (creep) => creep.memory.role == 'harvester' && creep.room.name == room.name);
        console.log('Harvesters: ' + roleDistribution.total, room.name);        
        if (roleDistribution.total < roleDistribution.min 
            && numberExtensions >= roleDistribution.minExtensions 
            && roleDistribution.total <= roleDistribution.max) {
            return true;
        }
    },
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
return module.exports;
}
/********** End of module 4: C:\Users\RBROW\screeps\src\creeps\harvester.js **********/
/********** Start module 5: C:\Users\RBROW\screeps\src\creeps\upgrader.js **********/
__modules[5] = function(module, exports) {
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
        var continueUpgrade = false;
        if (creep.energy != 0 && creep.memory.lastAction == ACTIONS.UPGRADE) {
            continueUpgrade = true;
        }
        if (creep.memory.source == undefined) {
            var sources = creep.room.find(FIND_SOURCES);
            creep.memory.source = sources[0].id;
        }

        if(creep.store.getFreeCapacity() > 0 && !continueUpgrade) {
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
    spawn: function(room, level, roleDistribution,numberExtensions) {
        var upgraders = _.filter(Game.creeps, (creep) => creep.memory.role == 'upgrader' && creep.room.name == room.name);
        console.log('Upgraders: ' + roleDistribution.total, room.name);
        if (roleDistribution.total < roleDistribution.min 
            && numberExtensions >= roleDistribution.minExtensions
            && roleDistribution.total <= roleDistribution.max) {
            return true;
        }
    },
    spawnData: function(room, level) {
            let name = 'Upgrader' + Game.time;
            let memory = {role: 'upgrader'};
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

module.exports = roleUpgrader;
return module.exports;
}
/********** End of module 5: C:\Users\RBROW\screeps\src\creeps\upgrader.js **********/
/********** Start module 6: C:\Users\RBROW\screeps\src\creeps\builder.js **********/
__modules[6] = function(module, exports) {
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
        var continueBuild = false;
        if (creep.energy != 0 && creep.memory.lastAction == ACTIONS.BUILD) {
            continueBuild = true;
        }
        if (creep.memory.source == undefined) {
            var sources = creep.room.find(FIND_SOURCES);
            creep.memory.source = sources[0].id;
        }
        if(creep.store.getFreeCapacity() > 0 && !continueBuild) {
            var source = creep.getObject(creep.memory.source);
            if(creep.harvest(source) == ERR_NOT_IN_RANGE) {
                creep.moveTo(source);
                creep.memory.lastAction = ACTIONS.HARVEST;
                creep.say('Harvesting');
            }
        } else {
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
    spawn: function(room, level, roleDistribution,numberExtensions) {
        var builders = _.filter(Game.creeps, (creep) => creep.memory.role == 'builder' && creep.room.name == room.name);
        console.log('builders: ' + roleDistribution.total, room.name);
        if (roleDistribution.total < roleDistribution.min && numberExtensions >= roleDistribution.minExtensions) {
            return true;
        }
    },
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
return module.exports;
}
/********** End of module 6: C:\Users\RBROW\screeps\src\creeps\builder.js **********/
/********** Start module 7: C:\Users\RBROW\screeps\src\room\spawning.js **********/
__modules[7] = function(module, exports) {
let creepLogic = __require(1,7);
let creepTypes = _.keys(creepLogic);

function spawnCreeps(room,roleDistribution) {
    _.forEach(creepTypes, type => console.log(type));

    var creeps = room.find(FIND_MY_CREEPS);
    var totalCreeps = 0;
    var i = 0;
	for(var n in creeps) {
        totalCreeps++;
	}
    var populationLevelMultiplier = 8;
    var creepLevel = totalCreeps / populationLevelMultiplier;

    var deposits = room.find(FIND_STRUCTURES);
    var fullDeposits = 0;
    var numberExtensions = 0;
    for(var i = 0; i < deposits.length; i++) {
        var deposit = deposits[i];        
        if (deposit.structureType == STRUCTURE_EXTENSION || deposit.structureType == STRUCTURE_SPAWN) {
            if(deposit.energy == deposit.energyCapacity) {
                fullDeposits++;
            }
            if (deposit.structureType == STRUCTURE_EXTENSION) {
                numberExtensions++
            }
        }
    }
    console.log('Total Deposits: ' + deposits.length + ' , ' + 'Full Deposits: ' + fullDeposits);
    var resourceLevel = fullDeposits / 5;
    var level = Math.floor(creepLevel + resourceLevel);    
	if(totalCreeps < 5){
        console.log('Level Under 5:  ' + level);
	    level = 1;
	}
    console.log('Level:  ' + level);
    let creepTypeNeeded = _.find(creepTypes, function(type) {
        return creepLogic[type].spawn(room,level,roleDistribution[type],numberExtensions);
    });
    let creepSpawnData = creepLogic[creepTypeNeeded] && creepLogic[creepTypeNeeded].spawnData(room,level);
    console.log('total creeps: ' + totalCreeps + ' population multiplier ' + populationLevelMultiplier + ' creep level ' + creepLevel + ' resourceLevel ' + resourceLevel);

    if (creepSpawnData) {
        let spawn = room.find(FIND_MY_SPAWNS)[0];
        let result = spawn.spawnCreep(creepSpawnData.body, creepSpawnData.name, {memory: creepSpawnData.memory});
    
        console.log("Tried to Spawn:", creepTypeNeeded, result)
    }
}

module.exports = spawnCreeps;
return module.exports;
}
/********** End of module 7: C:\Users\RBROW\screeps\src\room\spawning.js **********/
/********** Start module 8: C:\Users\RBROW\screeps\src\room\defense.js **********/
__modules[8] = function(module, exports) {
let creepLogic = __require(1,8);
let creepTypes = _.keys(creepLogic);

function defense(room) {

    var towers = room.find(FIND_STRUCTURES, { filter: { structureType: STRUCTURE_TOWER }});
    if (towers.length) {
        _.forEach(towers, function(tower) {
            console.log(tower);
            var closestDamagedStructure = tower.pos.findClosestByRange(FIND_STRUCTURES,{ filter: (structure) => structure.hits < structure.hitsMax});
            if (closestDamagedStructure) {
                tower.repair(closestDamagedStructure);
            }
            var closestHostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
            if (closestHostile) {
                tower.attack(closestHostile);
            }
        });
    }
}

module.exports = defense;
return module.exports;
}
/********** End of module 8: C:\Users\RBROW\screeps\src\room\defense.js **********/
/********** Start module 9: C:\Users\RBROW\screeps\src\prototypes\creep.js **********/
__modules[9] = function(module, exports) {
Creep.prototype.sayHello = function sayHello() {
    this.say("Hello", true);
}

Creep.prototype.sayDebug = function sayHello() {
    this.say("Debug", true);
}

Creep.prototype.getObject = function(id) {
	return Game.getObjectById(id);
};
return module.exports;
}
/********** End of module 9: C:\Users\RBROW\screeps\src\prototypes\creep.js **********/
/********** Footer **********/
if(typeof module === "object")
	module.exports = __require(0);
else
	return __require(0);
})();
/********** End of footer **********/
