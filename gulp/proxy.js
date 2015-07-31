'use strict';

var url = require('url');
var proxyMiddleware = require('proxy-middleware');

// Use node-red:
var proxyOptions_loc = url.parse('http://localhost:1880/rest');
proxyOptions_loc.route = '/rest';

var mw_loc = proxyMiddleware(proxyOptions_loc);

module.exports = {
  loc: mw_loc
};
