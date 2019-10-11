
const { Server } = require('node-ssdp');
const { port } = require('../../HttpPlugin/HTTPConfig');

const ssdpServer = new Server({
  location: {
    port,
    path: '/description.xml',
  },
});

ssdpServer.addUSN('urn:poersmart:device:vassio');

function description(res) {
  res.end('<?xml version=\'1.0\'?>\n'
        + '<root xmlns=\'urn:poersmart:device:vassio:1\'>'
        + '</root>');
}

module.exports.ssdpServer = ssdpServer;
module.exports.description = description;
