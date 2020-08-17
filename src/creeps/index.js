let creepLogic = {
    scout:     require('./scout'),
    claimer:      require('./claimer'),
    harvester:     require('./harvester'),
    //harvesterLD:     require('./harvesterLD'),
    harvesterLDLeft:     require('./harvesterLDLeft'),
    harvesterLDRight:     require('./harvesterLDRight'),
    harvesterLDTop:     require('./harvesterLDTop'),
    harvesterLDBottom:     require('./harvesterLDBottom'),
    carrier:      require('./carrier'),
    upgrader:      require('./upgrader'),    
    builder:      require('./builder'),
    repairer:      require('./repairer'),
    repairerWall:      require('./repairerWall'),
    //builder1:      require('./builder1'),    
}

module.exports = creepLogic;