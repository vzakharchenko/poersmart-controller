const dgram = require('dgram');
const { int8ArrayToHex } = require('./lib/Utils');
const { startPlugins, stopPlugins } = require('./lib/PluginManager');
const { startHttp, stopHttp } = require('./PoerHttpServer');
const { DEVICE_TEMP_TYPE, DEVICE_CHANGE_TYPE, getAction } = require('./lib/ActionDevice');
const {
  gateWaySelector,
  prepareResponse,
  askDevice,
  sendAction,
} = require('./lib/GateWayMessages');

const SERVER_PORT = 2012;
const SERVER_HOST = '0.0.0.0';

const server = dgram.createSocket('udp4');

server.on('listening', () => {
  const address = server.address();
  console.log(`UDP Server listening on ${address.address}:${address.port}`);
});

server.on('message', (message, remote) => {
  console.log(`${remote.address}:${remote.port} - ${int8ArrayToHex(message)}`);
  const event = gateWaySelector(message);
  const response = prepareResponse(event);
  server.send(response, 0, response.length, remote.port, remote.address, (err) => {
    // server.close();
    if (err) throw err;
    console.log(`UDP message sent to ${remote.address}:${remote.port} - ${int8ArrayToHex(response)}`);
    if (event.nodes) {
      event.nodes.forEach((node) => {
        const a = getAction(node.mac);
        const action = sendAction(event, a);
        if (action) {
          if (a.type === DEVICE_TEMP_TYPE) {
            const actionAuto = {
              mac: a.mac,
              modeInt: 0,
              type: DEVICE_CHANGE_TYPE,
            };
            const actionAutoDevice = event.plugin.gateWayActionDevice(event, actionAuto);
            server.send(
              actionAutoDevice, 0, actionAutoDevice.length, remote.port,
              remote.address, (err1) => {
                if (err1) throw err1;
                console.log(`UDP message sent to ${remote
                  .address}:${remote.port} - ${int8ArrayToHex(action)}`);
                server.send(
                  action, 0,
                  action.length, remote.port, remote.address, (err5) => {
                    if (err5) throw err5;
                    console.log(`UDP message sent to ${remote
                      .address}:${remote.port} - ${int8ArrayToHex(action)}`);
                  },
                );
              },
            );
          } else {
            server.send(action, 0, action.length, remote.port, remote.address, (err2) => {
              if (err2) throw err2;
              console.log(`UDP message sent to ${remote.address}:${remote.port} - ${int8ArrayToHex(action)}`);
            });
          }
        } else {
          const array = askDevice(event, node);
          if (array) {
            server.send(array, 0, array.length, remote.port, remote.address, (err3) => {
              if (err3) throw err3;
              console.log(`UDP message sent to ${remote.address}:${remote.port} - ${int8ArrayToHex(response)}`);
            });
          }
        }
      });
    }
  });
});

server.bind(SERVER_PORT, SERVER_HOST);

startPlugins();

startHttp();


process.on('exit', () => {
  server.stop();
  stopPlugins();
  stopHttp();
});

