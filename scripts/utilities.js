String.prototype.startsWithLetter = function() {
    return this[0].toLowerCase() !== this[0].toUpperCase();
}

User.prototype.name = function() {
    return sys.name(this.id);
}
