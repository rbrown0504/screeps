var scout = {

    /** @param {Creep} creep **/
    run: function(creep,roleDistribution) {        
        var GOTO = {
            HOME: 1,
            DESTINATION: 2            
        };        
        if (creep.memory.sourceRoom == undefined) {
            creep.memory.sourceRoom = creep.room.name;
            creep.memory.workingLeft = false;
            creep.memory.workingRight = false;
            creep.memory.workingTop = false;
            creep.memory.workingBottom = false;            
            creep.memory.leftResult = 'NONE';            
            creep.memory.bottomResult = 'NONE';            
            creep.memory.topResult = 'NONE';            
            creep.memory.rightResult = 'NONE';            
            creep.memory.going = 0;
        }
        //work left         
        if (creep.room.name == creep.memory.sourceRoom ) {
            if (creep.memory.leftResult != 'NONE') {
                creep.room.memory.roomLeft = creep.memory.leftResult;
            } else {
                creep.memory.leftResult = 'NONE';
            }
            if (creep.memory.rightResult != 'NONE') {
                creep.room.memory.roomRight = creep.memory.rightResult;
            } else {
                creep.memory.rightResult = 'NONE';
            }
            if (creep.memory.topResult != 'NONE') {
                creep.room.memory.roomTop = creep.memory.topResult;
            } else {
                creep.memory.topResult = 'NONE';
            }
            if (creep.memory.bottomResult != 'NONE') {
                creep.room.memory.roomBottom = creep.memory.bottomResult;
            } else {
                creep.memory.bottomResult = 'NONE';
            }
        }
        if (creep.memory.leftResult == 'NONE' 
            && creep.room.name == creep.memory.sourceRoom 
            && !creep.memory.workingLeft
            && creep.memory.going != GOTO.DESTINATION) {
            //go to the room on the left
            creep.memory.workingLeft = true;
            creep.scoutDestination(GOTO,FIND_EXIT_LEFT);            
        } 
        else if (creep.memory.leftResult == 'NONE' 
            && creep.room.name == creep.memory.sourceRoom 
            && creep.memory.workingLeft
            && creep.memory.going == GOTO.DESTINATION) {
            //go to the room on the left            
            creep.scoutDestination(GOTO,FIND_EXIT_LEFT);            
        } 
        else if (creep.memory.workingLeft 
            && creep.room.name != creep.memory.sourceRoom 
            && creep.memory.going != GOTO.HOME) {
            //log what you found and go back home.            
            creep.memory.leftResult = creep.room.name;                       
            creep.memory.workingLeft = false;
            creep.scoutHome(GOTO);            
        }
        //work the bottom
        else if (creep.memory.bottomResult == 'NONE'
            && creep.room.name == creep.memory.sourceRoom 
            && !creep.memory.workingBottom 
            && creep.memory.going != GOTO.DESTINATION) {
            //go to exit right
            creep.memory.workingBottom = true;
            var result = creep.scoutDestination(GOTO,FIND_EXIT_BOTTOM);                       
            console.log('scountBottomresult',result);
        }
        else if (creep.memory.workingBottom
            && creep.room.name == creep.memory.sourceRoom 
            && creep.memory.going == GOTO.DESTINATION) {
            //go to the room on the left            
            creep.scoutDestination(GOTO,FIND_EXIT_BOTTOM);            
        }         
        else if (creep.memory.bottomResult == 'NONE'
            && creep.room.name != creep.memory.sourceRoom 
            && creep.memory.workingBottom 
            && creep.memory.going != GOTO.HOME) {
            //log what you found and go back home.            
            creep.memory.workingBottom = false;
            creep.memory.bottomResult = creep.room.name;                       
            creep.scoutHome(GOTO);
        }
        //work the right hand 
        else if (creep.memory.rightResult == 'NONE' 
            && creep.room.name == creep.memory.sourceRoom 
            && !creep.memory.workingRight 
            && creep.memory.going != GOTO.DESTINATION) {
            //go to exit right
            creep.memory.workingRight = true;
            creep.scoutDestination(GOTO,FIND_EXIT_RIGHT);                       
        }
        else if (creep.memory.rightResult == 'NONE' 
            && creep.memory.workingRight
            && creep.room.name == creep.memory.sourceRoom 
            && creep.memory.going == GOTO.DESTINATION) {
            //go to the room on the left            
            creep.scoutDestination(GOTO,FIND_EXIT_RIGHT);            
        }
        else if (creep.memory.rightResult == 'NONE'
            && creep.room.name != creep.memory.sourceRoom 
            && creep.memory.workingRight 
            && creep.memory.going != GOTO.HOME) {
            //log what you found and go back home.                
            creep.memory.rightResult = creep.room.name;
            creep.memory.workingRight = false;
            creep.scoutHome(GOTO);
        }        
        //work the top
        else if (creep.memory.topResult == 'NONE'
            && creep.room.name == creep.memory.sourceRoom 
            && !creep.memory.workingTop 
            && creep.memory.going != GOTO.DESTINATION) {
            //go to exit right
            creep.memory.workingTop = true;
            creep.scoutDestination(GOTO,FIND_EXIT_TOP);                       
        } 
        else if (creep.memory.workingTop
            && creep.room.name == creep.memory.sourceRoom 
            && creep.memory.going == GOTO.DESTINATION) {
            //go to the room on the left            
            creep.scoutDestination(GOTO,FIND_EXIT_TOP);            
        }
        else if (creep.memory.topResult == 'NONE'
            && creep.room.name != creep.memory.sourceRoom 
            && creep.memory.workingTop 
            && creep.memory.going != GOTO.HOME) {
            //log what you found and go back home.            
            creep.memory.topResult = creep.room.name;                       
            creep.memory.workingTop = false;                        
            creep.scoutHome(GOTO);
        }        
        else {
            creep.say('DONE');
            console.log('SCOUT IS DONE' , creep.name , creep.pos);
            creep.suicide();
        }        
    },
    // checks if the room needs to spawn a creep
    spawn: function(room, level, roleDistribution,globalRoleTotals) {
        if ( (room.memory.roomLeft == 'NONE' || room.memory.roomRight == 'NONE' || room.memory.roomUp == 'NONE' || room.memory.roomBottom == 'NONE') 
                && globalRoleTotals.total == 0) {
           return true;
        }
    },
    // returns an object with the data to spawn a new creep
    spawnData: function(room, level) {
        let name = 'scout' + Game.time;
        let memory = {role: 'scout', targetRoom: Game.spawns.Spawn1.claimRoom};
        let body = [MOVE, MOVE];
        return {name, body, memory};        
    }
};

module.exports = scout;