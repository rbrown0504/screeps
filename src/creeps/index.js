let creepLogic = {
    scout:     require('./scout'),
    claimer:      require('./claimer'),    
    harvester:     require('./harvester'),
    containerBuilder:      require('./containerBuilder'),
    miner:     require('./miner'),    
    carrier:      require('./carrier'),
    upgrader:      require('./upgrader'),    
    builder:      require('./builder'),
    harvesterLDLeft:     require('./harvesterLDLeft'),
    harvesterLDRight:     require('./harvesterLDRight'),
    harvesterLDTop:     require('./harvesterLDTop'),
    harvesterLDBottom:     require('./harvesterLDBottom'),    
    
    extensionBuilder:      require('./extensionBuilder'),
    
    repairer:      require('./repairer'),
    repairerWall:      require('./repairerWall'),
    //builder1:      require('./builder1'),    
}

module.exports = creepLogic;