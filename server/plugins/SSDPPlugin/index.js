
const { ssdpServer, description } = require('./lib/ssdpConnection');
const { httpServer } = require('../../PoerHttpServer');

function start() {
  // start the server
  httpServer.get('/description.xml', (req, res) => {
    description(res);
  });
  ssdpServer.start();
  console.log('ssdp server started');
}

function stop() {
  ssdpServer.stop();
  console.log('ssdp server stopped');
}

module.exports.start = start;
module.exports.stop = stop;
