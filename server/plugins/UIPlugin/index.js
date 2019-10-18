const express = require('express');
const logger = require('../../lib/Logger');
const { httpServer } = require('../../PoerHttpServer');

function start() {
  logger.log('ui started');
  httpServer.use('/',express.static('plugins/UIPlugin/public'));
}

function stop() {
  logger.log('ui stopped');
}

module.exports.start = start;
module.exports.stop = stop;
