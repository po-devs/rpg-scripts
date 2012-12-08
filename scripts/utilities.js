String.prototype.startsWithLetter = function() {
    return this[0].toLowerCase() !== this[0].toUpperCase();
}

User.prototype.name = function() {
    return sys.name(this.id);
}

rand = function rand(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}


is_undefined = function(val) {
    return typeof (val) === 'undefined' || val === null;
}

Array.prototype.clean = function(deleteValue) {
  for (var i = 0; i < this.length; i++) {
    if (this[i] == deleteValue) {
      this.splice(i, 1);
      i--;
    }
  }
  return this;
};
