
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

function addNodeMode(nodeMac, mode, modeInt) {
  const node = gateWayStatus.nodes[nodeMac];
  if (node) {
    node.mode = mode;
    node.modeInt = modeInt;
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
      return JSON.parse(JSON.stringify(gateWayStatus));
    }
  }
  return {};
}

module.exports.currentStatus = readStatus;
module.exports.readCurrentStatus = readCurrentStatus;
module.exports.addNode = addNode;
module.exports.addNodeMode = addNodeMode;
module.exports.setField = setField;
