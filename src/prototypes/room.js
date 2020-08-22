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