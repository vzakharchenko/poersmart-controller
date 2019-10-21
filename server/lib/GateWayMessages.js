const { int8ArrayToHex, shiftRight } = require('./Utils');
const { constants } = require('./constant');
const {
  deviceToGateWay,
  deviceAskGateWay,
  deviceConfirmation,
} = require('./GateWayConnections');

const { setDraft, readCurrentStatus } = require('./DeviceStatus');


function gateWaySelector(message) {
  const operation = message.slice(0, 2);
  const messageWithoutHeader = shiftRight(message, 2);
  const eventHex = int8ArrayToHex(operation);
  let event = { operation: eventHex };
  if (eventHex === constants.GATEWAY_DEVICE) {
    event = deviceToGateWay(messageWithoutHeader);
  } else if (eventHex === constants.GATEWAY_ASK_DEVICE) {
    event = deviceAskGateWay(messageWithoutHeader);
  } else if (eventHex === constants.CONFIRM_WRITE_DEVICE) {
    event = deviceConfirmation(messageWithoutHeader);
  } else if (eventHex === constants.CONFIRM_WRITE_TEMP_DEVICE) {
    event = deviceConfirmation(messageWithoutHeader);
  }
  // console.log(`device status ${JSON.stringify(currentStatus())}`);
  return event;
}

function prepareResponse(event) {
  let response = new Uint8Array([]);
  if (event.plugin) {
    response = event.plugin.gateWayToDevice(event);
  }
  return response;
}

function askDevice(event, node) {
  let ret = null;
  if (event.operation !== constants.GATEWAY_ASK_DEVICE) {
    if (event.plugin !== null) {
      ret = event.plugin.gateWayAskDevice(event, node);
    }
  }
  return ret;
}

function getCurrentState(mac, nodeMac) {
  const macState = readCurrentStatus(mac);
  let nodeStatus;
  if (macState && macState.nodes && macState.nodes[nodeMac]) {
    const node = macState.nodes[nodeMac];
    nodeStatus = node.mode;
  }
  return nodeStatus;
}
function sendAction(event, action) {
  let ret = null;
  if (action) {
    if (event.plugin !== null) {
      ret = event.plugin.gateWayActionDevice(event, action);
    }
  }
  return ret;
}


module.exports.gateWaySelector = gateWaySelector;
module.exports.prepareResponse = prepareResponse;
module.exports.askDevice = askDevice;
module.exports.sendAction = sendAction;
module.exports.setDraft = setDraft;
module.exports.getCurrentState = getCurrentState;

