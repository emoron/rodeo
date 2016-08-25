'use strict';

const bluebird = require('bluebird'),
  express = require('express'),
  log = require('./log').asInternal(__filename),
  defaultHostname = 'localhost',
  defaultBacklog = 511;
let PlotServer;

/**
 * @param {number} port
 * @constructor
 * @property {Map} urls
 * @property {Map} routes
 */
PlotServer = function (port) {
  this.port = port;
  this.app = express();
  this.urls = new Map();
  this.routes = new Map();
};
PlotServer.prototype = {
  listen() {
    const app = this.app,
      port = this.port,
      listen = bluebird.promisify(app.listen, {context: app});

    return listen(port, defaultHostname, defaultBacklog).return(port);
  },
  /**
   * Add route to file
   * @param {string} filename
   * @param {string} route
   * @returns {string}
   */
  addRouteToFile(filename, route) {
    const app = this.app,
      port = this.port,
      url = 'http://localhost:' + port + route,
      urls = this.urls,
      routes = this.routes;

    app.get(route, function (req, res) {
      log('info', 'sending file', {filename, route, port});
      res.sendFile(filename, function (err) {
        log('info', 'sending file result', err);
        if (err) {
          log('error', 'sending file', filename);
          res.status(err.status).end();
        }
      });
    });
    urls.set(url, filename);
    routes.set(route, filename);

    return url;
  }
};

module.exports = PlotServer;
