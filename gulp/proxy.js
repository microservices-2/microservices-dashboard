'use strict';

var url = require('url');
var proxyMiddleware = require('proxy-middleware');

// Use node-red:
var proxyOptionsLoc = url.parse('http://localhost:8383/dependencies');
proxyOptionsLoc.route = '/dependencies';

var mwLoc = proxyMiddleware(proxyOptionsLoc);

module.exports = {
  loc: mwLoc
};
