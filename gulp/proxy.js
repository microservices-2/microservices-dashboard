'use strict';

var url = require('url');
var proxyMiddleware = require('proxy-middleware');

// Use node-red:
var proxyOptions_loc = url.parse('http://localhost:8383/dependencies');
proxyOptions_loc.route = '/dependencies';

var mwLoc = proxyMiddleware(proxyOptions_loc);

module.exports = {
  loc: mwLoc
};
