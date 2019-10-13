const { int8ArrayToHex, arrayToInt16 } = require('./Utils');

const gateWayStatus = {
  mac: '',
  softVersion: '',
  hardVersion: '',
  wifiLevel: 0,
  read: false,
  nodes: {},
};


function setField(fieldName, fieldValue) {
  gateWayStatus[fieldName] = fieldValue;
}

function addNode(node) {
  const n = gateWayStatus.nodes[node.mac];
  if (!n) {
    gateWayStatus.nodes[node.mac] = Object.assign({}, { read: node.battery > 0 }, node);
  } else {
    Object.assign(gateWayStatus.nodes[node.mac], { read: node.battery > 0 }, node);
  }
}

function addNodeMode(nodeMac, mode, modeInt, message) {
  const node = gateWayStatus.nodes[nodeMac];
  if (node) {
    node.mode = mode;
    node.modeInt = modeInt;
    node.message = int8ArrayToHex(message);
    const overrideTemperatureHex = message.slice(26, 28);
    const offTemperatureHex = message.slice(28, 30);
    const ecoTemperatureHex = message.slice(30, 32);
    const overrideTemperature = arrayToInt16(overrideTemperatureHex) / 9;
    const offTemperature = arrayToInt16(offTemperatureHex) / 9;
    const ecoTemperature = arrayToInt16(ecoTemperatureHex) / 9;
    node.message = int8ArrayToHex(message);
    node.overrideTemperature = overrideTemperature;
    node.offTemperature = offTemperature;
    node.ecoTemperature = ecoTemperature;
    node.readMode = true;
  }
}

function readStatus() {
  return JSON.parse(JSON.stringify(gateWayStatus));
}

function readCurrentStatus() {
  if (gateWayStatus.read) {
    let allNodeRead = true;
    Object.keys(gateWayStatus.nodes).forEach((mac) => {
      allNodeRead &= gateWayStatus.nodes[mac].read // eslint-disable-line no-bitwise
        && gateWayStatus.nodes[mac].readMode;
    });
    if (allNodeRead) {
      const parse = JSON.parse(JSON.stringify(gateWayStatus));
      delete parse.read;
      Object.keys(parse.nodes).forEach((mac) => {
        const n = parse.nodes[mac];
        delete n.read;
        delete n.readMode;
        delete n.message;
      });
      return parse;
    }
  }
  return {};
}

module.exports.currentStatus = readStatus;
module.exports.readCurrentStatus = readCurrentStatus;
module.exports.addNode = addNode;
module.exports.addNodeMode = addNodeMode;
module.exports.setField = setField;
