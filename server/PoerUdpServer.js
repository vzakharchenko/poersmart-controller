
const dgram = require('dgram');
const { int8ArrayToHex } = require('./lib/Utils');
const { startPlugins, stopPlugins } = require('./lib/PluginManager');
const { startHttp, stopHttp } = require('./PoerHttpServer');
const logger = require('./lib/Logger');
const {
  DEVICE_TEMP_TYPE,
  DEVICE_CHANGE_TYPE,
  MODE_INTEGER,
  getAction,
} = require('./lib/ActionDevice');
const {
  gateWaySelector,
  prepareResponse,
  askDevice,
  sendAction,
  setDraft,
  getCurrentState,
} = require('./lib/GateWayMessages');
const { getNodeByMac } = require('./lib/DeviceStatus');

const SERVER_PORT = 2012;
const SERVER_HOST = '0.0.0.0';

const server = dgram.createSocket('udp4');

server.on('listening', () => {
  const address = server.address();
  logger.info(`UDP Server listening on ${address.address}:${address.port}`);
});

server.on('message', (message, remote) => {
  logger.debug(`From Device ${remote.address}:${remote.port} - ${int8ArrayToHex(message)}`);
  const event = gateWaySelector(message);
  const response = prepareResponse(event);
  server.send(response, 0, response.length, remote.port, remote.address, (err) => {
    // server.close();
    if (err) throw err;
    logger.debug(`To Device UDP message sent to ${remote.address}:${remote.port} - ${int8ArrayToHex(response)}`);
    if (event.nodes) {
      event.nodes.forEach((node) => {
        let a = null;
        let action = null;
        const nodeInfo = getNodeByMac(node.mac);
        const state = getCurrentState(event.mac, node.mac);
        if (state && nodeInfo && !nodeInfo.draft) {
          a = getAction(node.mac);
          action = sendAction(event, a);
        }
        if (action) {
          if (a.type === DEVICE_TEMP_TYPE && (state !== 'AUTO' && state !== 'AUTO/MAN')) {
            const actionAuto = {
              mac: a.mac,
              modeInt: 0,
              type: DEVICE_CHANGE_TYPE,
            };
            const actionAutoDevice = event.plugin.gateWayActionDevice(event, actionAuto);
            server.send(
              actionAutoDevice, 0, actionAutoDevice.length, remote.port,
              remote.address, (err1) => {
                setDraft(node.mac);
                if (err1) throw err1;
                logger.debug(`To Device UDP message sent to ${remote
                  .address}:${remote.port} - ${int8ArrayToHex(action)}`);
                server.send(
                  action, 0,
                  action.length, remote.port, remote.address, (err5) => {
                    if (err5) throw err5;
                    logger.debug(`To Device UDP message sent to ${remote
                      .address}:${remote.port} - ${int8ArrayToHex(action)}`);
                  },
                );
              },
            );
          } else if (a[MODE_INTEGER] === 0 && state === 'AUTO/MAN') {
            const actionAuto = {
              mac: a.mac,
              temp_action_type: 0,
            };
            const actionAutoDevice = event.plugin.gateWayActionDevice(event, actionAuto);
            server.send(
              actionAutoDevice, 0,
              actionAutoDevice.length, remote.port, remote.address, (err2) => {
                setDraft(node.mac);
                if (err2) throw err2;
                logger.debug(`To Device UDP message sent to ${remote.address}:
              ${remote.port} - ${int8ArrayToHex(actionAutoDevice)}`);
              },
            );
          } else {
            server.send(action, 0, action.length, remote.port, remote.address, (err2) => {
              setDraft(node.mac);
              if (err2) throw err2;
              logger.debug(`To Device UDP message sent to ${remote.address}:${remote.port} - ${int8ArrayToHex(action)}`);
            });
          }
        } else {
          const array = askDevice(event, node);
          if (array) {
            server.send(array, 0, array.length, remote.port, remote.address, (err3) => {
              if (err3) throw err3;
              logger.debug(`To Device UDP message sent to ${remote.address}:${remote.port} - ${int8ArrayToHex(response)}`);
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

