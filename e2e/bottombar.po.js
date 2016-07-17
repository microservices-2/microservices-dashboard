/* global by element */

var BottomBar = function() {
  'use strict';

  this.bottomBar = element(by.css('#bottombar'));
  this.buttons = element.all(by.css('.button-div'));
};

module.exports = new BottomBar();
