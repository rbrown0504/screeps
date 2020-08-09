Creep.prototype.sayHello = function sayHello() {
    this.say("Hello", true);
}

Creep.prototype.sayDebug = function sayHello() {
    this.say("Debug", true);
}

Creep.prototype.getObject = function(id) {
	return Game.getObjectById(id);
};