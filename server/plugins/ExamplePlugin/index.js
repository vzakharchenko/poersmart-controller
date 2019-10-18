const logger = require('../../lib/Logger');

function start() {
  logger.info('example start');
}

function stop() {
  logger.info('example stop');
}

module.exports.start = start;
module.exports.stop = stop;
