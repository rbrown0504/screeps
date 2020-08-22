Room.prototype.getExtensionsNeeded = function () {    
    var extensionsNeeded = 0;
    switch(this.controller.level) {
        case 0:
            extensionsNeeded = 0;
            break;
        case 1:
            extensionsNeeded = 5;                
            break;
        case 2:
            extensionsNeeded = 5;
            break;
        case 3:
            extensionsNeeded = 5;
            break;
        case 4:
            extensionsNeeded = 5;
            break;            
        case 5:
            extensionsNeeded = 5;
            break;                        
    }
    return extensionsNeeded;
}

Room.prototype.setStructureMemory = function (structures) { 
    if (structures == undefined) {
        structures = this.find(FIND_STRUCTURES);
    }
    this.memory.numberExtensions = 0;
    this.memory.numberDeposits = 0;
    this.memory.numberFullDeposits = 0;
    this.memory.repairSites = 0;    
    this.memory.repairWalls = 0;    
    this.memory.totalStructures = 0;
    this.memory.totalContainers = 0;
    this.memory.depositNeeded = 0; 	
    for(var i = 0; i < structures.length; i++) {
        var deposit = structures[i];   
        this.memory.totalStructures++;     
        if (deposit.structureType == STRUCTURE_EXTENSION || deposit.structureType == STRUCTURE_SPAWN) {
            this.memory.numberDeposits++;
            if(deposit.energy == deposit.energyCapacity) {                
                this.memory.numberFullDeposits++;
            }
            if (deposit.structureType == STRUCTURE_EXTENSION) {                
                this.memory.numberExtensions++;
            } 
            if (deposit.store.getFreeCapacity(RESOURCE_ENERGY) > 0) {
                this.memory.depositNeeded++;
            }           
        }
        //count number repairs needed for non walls
        if (deposit.hits < deposit.hitsMax && deposit.structureType != STRUCTURE_WALL) {
            this.memory.repairSites++;
        }
        //count number of repairs needed for walls
        if (deposit.hits < deposit.hitsMax && deposit.structureType == STRUCTURE_WALL) {
            this.room.memory.repairWalls++;    
        }
        //count number of containers
        if (deposit.structureType == STRUCTURE_CONTAINER) {
            this.memory.totalContainers++;	
        }
    }
}