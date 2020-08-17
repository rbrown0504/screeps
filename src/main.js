let creepLogic = require('./creeps');
let roomLogic = require('./room');
let prototypes = require('./prototypes');
const { min } = require('lodash');


module.exports.loop = function () {
    // make a list of all of our rooms
	Game.myRooms = _.filter(Game.rooms, r => r.controller && r.controller.level > 0 && r.controller.my);
	//get some global metrics together
	var globalRoleTotals = {
		scout: {
			total: 0
		},
		carrier: {
			total: 0
		},
		harvester: {
			total: 0
		},
		harvesterLD: {
			total: 0
		},
		harvesterLDLeft: {
			total: 0
		},
		harvesterLDRight: {
			total: 0
		},
		harvesterLDTop: {
			total: 0
		},
		harvesterLDBottom: {
			total: 0
		},
		upgrader: {
			total: 0
		},
		builder: {
			total: 0
		},
		repairer: {
			total: 0
		},
		repairerWall: {
			total: 0
		},		
	}
	//get some room metrics together
	var roleDistribution = {
		// CreepMiner: {
		// 	total: 0,
		// 	goalPercentage: 0.2,
		// 	currentPercentage: 0,
		// 	max: 2,
		// 	min: 2,
		// 	//max: 5,
		// 	minExtensions: 0
		// },
		scout: {
			total: 0,
			goalPercentage: 0.3,
			currentPercentage: 0,
			max: 10,
			min: 2,
			minExtensions: 0,
			minTTL: 0,			
        },
		carrier: {
			total: 0,
			goalPercentage: 0.3,
			currentPercentage: 0,
			max: 10,
			min: 2,
			minExtensions: 0,
			minTTL: 0,			
        },
        harvester: {
			total: 0,
			goalPercentage: 0.3,
			currentPercentage: 0,
			max: 10,
			min: 6,
			minExtensions: 0,
			minTTL: 0,
		},
		harvesterLD: {
			total: 0,
			goalPercentage: 0.25,
			currentPercentage: 0,
			max: 30,
			min: 1,
			minExtensions: 0,
			minTTL: 0,
		},		
		harvesterLDLeft: {
			total: 0,
			goalPercentage: 0.25,
			currentPercentage: 0,
			max: 30,
			min: 1,
			minExtensions: 0,
			minTTL: 0,
		},
		harvesterLDRight: {
			total: 0,
			goalPercentage: 0.25,
			currentPercentage: 0,
			max: 30,
			min: 1,
			minExtensions: 0,
			minTTL: 0,
		},
		harvesterLDTop: {
			total: 0,
			goalPercentage: 0.25,
			currentPercentage: 0,
			max: 30,
			min: 1,
			minExtensions: 0,
			minTTL: 0,
		},
		harvesterLDBottom: {
			total: 0,
			goalPercentage: 0.25,
			currentPercentage: 0,
			max: 30,
			min: 1,
			minExtensions: 0,
			minTTL: 0,
		},
		claimer: {
			total: 0,
			goalPercentage: 0.3,
			currentPercentage: 0,
			max: 1,
			min: 1,
			minExtensions: 0,
			minTTL: 0,			
        },
		upgrader: {
			total: 0,
			goalPercentage: 0.2,
			currentPercentage: 0,
			max: 20,
			min: 5,
			minExtensions: 0,
			minTTL: 0,
		},
		builder: {
			total: 0,
			goalPercentage: 0.25,
			currentPercentage: 0,
			max: 15,
			min: 2,
			minExtensions: 0,
			minTTL: 0,
        },
        // builder1: {
		// 	total: 0,
		// 	goalPercentage: 0.25,
		// 	currentPercentage: 0,
		// 	max: 15,
		// 	min: 0,
		// 	minExtensions: 0,
		// 	minTTL: 0,
		// },
		repairer: {
			total: 0,
			goalPercentage: 0.25,
			currentPercentage: 0,
			max: 20,
			min: 0,
			minExtensions: 0,
			minTTL: 0,
		},
		repairerWall: {
			total: 0,
			goalPercentage: 0.25,
			currentPercentage: 0,
			max: 5,
			min: 0,
			minExtensions: 0,
			minTTL: 0,
		},
		
		// CreepHealer: {
		// 	total: 0,
		// 	goalPercentage: 0.25,
		// 	currentPercentage: 0,
		// 	max: 2,
		// 	min: 0,
		// 	minExtensions: 2
		// },
		// CreepSoldier: {
		// 	total: 0,
		// 	goalPercentage: 0.25,
		// 	currentPercentage: 0,
		// 	max: 5,
		// 	min: 0,
		// 	minExtensions: 2
		// },
		// CreepShooter: {
		// 	total: 0,
		// 	goalPercentage: 0.2,
		// 	currentPercentage: 0,
		// 	max: 3,
		// 	min: 0,
		// 	minExtensions: 10
		// },

		
	};
	
	for(var n in Game.myRooms) {		
		var room = Game.myRooms[n];
		if (Game.myRooms.length == 1 ) {
			room.memory.homeRoom = room.name;				
		}
		var minTTL = 0;
		var totalCreeps = _.filter(Game.creeps, (creep) => creep.room.name == room.name);	
    	_.forEach(totalCreeps, function(creep) {
			let role = creep.memory.role;
			roleDistribution[role].total++;	
			if (minTTL == 0) {
				minTTL = creep.ticksToLive;
			} else if (minTTL < creep.ticksToLive) {
				minTTL = creep.ticksToLive;
			}			
		});
	}

	for(var name in Game.creeps) {
        var creep = Game.creeps[name];
		let role = creep.memory.role;
		if (creep.my) {
			globalRoleTotals[role].total++;
		}		
	}
	//run through resource management
	_.forEach(Game.myRooms, r => roomLogic.resources(r));
	//run through construction management
	_.forEach(Game.myRooms, r => roomLogic.construction(r));	
	//run through population management
	_.forEach(Game.myRooms, r => roomLogic.population(r));	    
	// run spawn logic for each room in our empire
	_.forEach(Game.myRooms, r => roomLogic.spawning(r,roleDistribution,globalRoleTotals));
	console.log('GLOBAL POP:','Total (room controlled)',totalCreeps.length,
				'S:' + globalRoleTotals['scout'].total +			
				'|H:' + globalRoleTotals['harvester'].total +
                '|U:' + globalRoleTotals['upgrader'].total +
                '|B:' + globalRoleTotals['builder'].total + 
                '|C:' + globalRoleTotals['carrier'].total +
                '|R:' + globalRoleTotals['repairer'].total +
                '|LDH:' + globalRoleTotals['harvesterLD'].total +
                '|RW:' + globalRoleTotals['repairerWall'].total);
    // run defense logic for each room in our empire
	_.forEach(Game.myRooms, r => roomLogic.defense(r));    

	// run each creep role see /creeps/index.js	
    for(var name in Game.creeps) {
        var creep = Game.creeps[name];
		let role = creep.memory.role;		
        if (creepLogic[role]) {
            creepLogic[role].run(creep,roleDistribution);
        }
	}
    // free up memory if creep no longer exists
    for(var name in Memory.creeps) {
        if(!Game.creeps[name]) {
            delete Memory.creeps[name];
            console.log('Clearing non-existing creep memory:', name);
        }
	}

	for(var name in Memory.rooms) {
		if(!Game.rooms[name]) {
			console.log('Clearing non-existing room memory:' , name);
			delete Memory.rooms[name];
		}		
	}
	//console.log(JSON.stringify(Game.Memory));
}