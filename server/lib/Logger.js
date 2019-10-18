const { debug } = require('../HTTPConfig');

const logger = console;

function debugToLogger(message, optionalParams) {
  if (debug) {
    logger.debug(message, optionalParams);
  }
}

module.exports.info = logger.info;
module.exports.log = logger.log;
module.exports.error = logger.error;
module.exports.debug = debugToLogger;
