let creepLogic = require('./creeps');
let roomLogic = require('./room');
let prototypes = require('./prototypes');


module.exports.loop = function () {
    // make a list of all of our rooms
	Game.myRooms = _.filter(Game.rooms, r => r.controller && r.controller.level > 0 && r.controller.my);
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
		carrier: {
			total: 0,
			goalPercentage: 0.3,
			currentPercentage: 0,
			//max: 15,
			max: 2,
			min: 2,
			minExtensions: 0			
        },
        harvester: {
			total: 0,
			goalPercentage: 0.3,
			currentPercentage: 0,
			//max: 15,
			max: 2,
			min: 2,
			minExtensions: 0			
		},
		builder: {
			total: 0,
			goalPercentage: 0.25,
			currentPercentage: 0,
			max: 15,
			min: 1,
			minExtensions: 0
        },
        builder1: {
			total: 0,
			goalPercentage: 0.25,
			currentPercentage: 0,
			max: 15,
			min: 0,
			minExtensions: 0
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
		upgrader: {
			total: 0,
			goalPercentage: 0.2,
			currentPercentage: 0,
			max: 3,
			min: 2,
			minExtensions: 0
		}
	};
	var roomMetricsDefault = {
		totalHostileCreeps : 0,
		totalHostileSpawns : 0,
		totalHostileConstructionSites : 0,
		totalMyConstructionSites : 0,
		totalConstructionSites : 0,
		totalMyStructures : 0,
		totalMyContainers : 0,
		totalCreeps : 0,
		totalMyCreeps : 0,
		totalDroppedResources : 0,
	};
	var roomMap = new Map();
	for(var n in Game.myRooms) {
		var room = Game.myRooms[n];
		var roomMetrics;
		if (roomMap.get(room.name) != null) {
			roomMetrics = roomMap.get(room.name);
		} else {
			roomMetrics = roomMetricsDefault;
		}
		//go through construction sites	
		var constructionSites = _.filter(Game.constructionSites, (site) => site.room.name == room.name);;
		_.forEach(constructionSites, function(site) {
			roomMetrics.totalConstructionSites++;
			if (site.my) {
				roomMetrics.totalMyConstructionSites++;
			} else {
				roomMetrics.totalHostileConstructionSites++;
			};
		});
		//go through creeps
		var totalCreeps = _.filter(Game.creeps, (creep) => creep.room.name == room.name);;
		_.forEach(totalCreeps, function(creep) {
			roomMetrics.totalCreeps++;
			if (creep.my) {				
				roomMetrics.totalMyCreeps++;
				let role = creep.memory.role;
				roleDistribution[role].total++;	
			} else {
				roomMetrics.totalHostileCreeps++;
			}
			
		});
		//go through structures
		var myStructures = room.find(FIND_STRUCTURES);
		_.forEach(myStructures, function(structure) {
			//console.log('structureType: ' + structure.structureType);
			roomMetrics.totalMyStructures++;
			if (structure.structureType == STRUCTURE_CONTAINER) {
				//console.log('structure: ' + JSON.stringify(structure));
				roomMetrics.totalMyContainers++;			
			} 
		});			
		roomMap.set(room.name,roomMetrics);
		console.log('RoomMetrics: ' + JSON.stringify(roomMetrics));
	}	
	
    // run spawn logic for each room in our empire
    _.forEach(Game.myRooms, r => roomLogic.spawning(r,roleDistribution));

    // run defense logic for each room in our empire
	_.forEach(Game.myRooms, r => roomLogic.defense(r));    
	
	//run through resource management
	_.forEach(Game.myRooms, r => roomLogic.resources(r));

    // run each creep role see /creeps/index.js
    
    for(var name in Game.creeps) {
        var creep = Game.creeps[name];
        let role = creep.memory.role;
        if (creepLogic[role]) {
            creepLogic[role].run(creep,roomMap.get(creep.room.name));
        }
    }

    // free up memory if creep no longer exists
    for(var name in Memory.creeps) {
        if(!Game.creeps[name]) {
            delete Memory.creeps[name];
            console.log('Clearing non-existing creep memory:', name);
        }
	}
	//console.log(JSON.stringify(Game.Memory));
}