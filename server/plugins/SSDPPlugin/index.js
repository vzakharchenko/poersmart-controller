const logger = require('../../lib/Logger');
const { ssdpServer, description } = require('./lib/ssdpConnection');
const { httpServer } = require('../../PoerHttpServer');

function start() {
  // start the server
  httpServer.get('/description.xml', (req, res) => {
    description(res);
  });
  ssdpServer.start();
  logger.log('ssdp server started');
}

function stop() {
  ssdpServer.stop();
  logger.log('ssdp server stopped');
}

module.exports.start = start;
module.exports.stop = stop;
