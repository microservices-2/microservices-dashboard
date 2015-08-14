"use strict";

var MSGSet = function() {
  this.array = [];
};

MSGSet.prototype.add = function(element) {
  if (this.array.indexOf(element) === - 1) {
    this.array.push(element);
  }
};

MSGSet.prototype.has = function(element) {
  return this.array.indexOf(element) > -1;
};

MSGSet.prototype.values = function() {
  return this.array;
};

MSGSet.prototype.length = function() {
  return this.array.length;
};

MSGSet.prototype.shift = function() {
  return this.array.shift();
};
