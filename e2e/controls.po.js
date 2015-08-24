'use strict';

var Controls = function() {
  this.controlBar = element(by.css('#control-bar'));
  this.clearButton = this.controlBar.element(by.css('button'));
};

module.exports = new Controls();
