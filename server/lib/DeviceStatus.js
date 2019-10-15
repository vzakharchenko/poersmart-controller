const {
  int8ArrayToHex,
  arrayToInt16,
  int8ToUint8Array,
  int16ToUint8Array,
} = require('./Utils');

const gateWayStatuses = {
};


function getGateWayStatus(mac) {
  let gateWayStatus = gateWayStatuses[mac];
  if (!gateWayStatus) {
    gateWayStatus = {
      read: false,
      nodes: {},
    };
    gateWayStatuses[mac] = gateWayStatus;
  }
  return gateWayStatus;
}

function setField(mac, fieldName, fieldValue) {
  const gateWayStatus = getGateWayStatus(mac);
  gateWayStatus[fieldName] = fieldValue;
}

function addNode(mac, node) {
  const gateWayStatus = getGateWayStatus(mac);
  const n = gateWayStatus.nodes[node.mac];
  if (!n) {
    gateWayStatus.nodes[node.mac] = Object.assign({}, { read: node.battery > 0 }, node);
  } else {
    Object.assign(gateWayStatus.nodes[node.mac], { read: node.battery > 0 }, node);
  }
}

function parseScheduler(scheduler) {
  const res = [];
  for (let dayOfWeek = 0; dayOfWeek < 7; dayOfWeek++) { // eslint-disable-line no-plusplus
    const dayOfWeekScheduler = scheduler.slice(dayOfWeek * 4 * 13, (dayOfWeek + 1) * 4 * 13);
    const schDay = [];
    res.push(schDay);
    for (let t = 0; t < 13; t++) { // eslint-disable-line no-plusplus
      const slice = dayOfWeekScheduler.slice(t * 4, (t + 1) * 4);
      schDay.push({
        hour: slice[0],
        minute: slice[1],
        temp: arrayToInt16(slice.slice(2, 4)) / 9,
      });
    }
  }
  return res;
}

function schedulerToHex(json) {
  const array = new Uint8Array(4 * 13 * 7);
  json.forEach((day, dayi) => {
    const dayH = new Uint8Array(4 * 13);
    day.forEach((dh, dhi) => {
      const adh = new Uint8Array(4);
      adh.set(int8ToUint8Array(dh.hour), 0);
      adh.set(int8ToUint8Array(dh.minute), 1);
      adh.set(int16ToUint8Array(dh.temp * 9), 2);
      dayH.set(adh, dhi * 4);
    });
    array.set(dayH, 4 * 13 * dayi);
  });
  return array;
}

function addNodeMode(mac, nodeMac, mode, modeInt, message) {
  const gateWayStatus = getGateWayStatus(mac);
  const node = gateWayStatus.nodes[nodeMac];
  if (node) {
    node.mode = mode;
    node.modeInt = modeInt;
    node.message = int8ArrayToHex(message);
    const overrideTemperatureHex = message.slice(26, 28);
    const offTemperatureHex = message.slice(28, 30);
    const ecoTemperatureHex = message.slice(30, 32);
    const scheduler = message.slice(49, (4 * 13 * 7) + 49);
    const schedulerJson = parseScheduler(scheduler);
    const overrideTemperature = arrayToInt16(overrideTemperatureHex) / 9;
    const offTemperature = arrayToInt16(offTemperatureHex) / 9;
    const ecoTemperature = arrayToInt16(ecoTemperatureHex) / 9;
    node.message = int8ArrayToHex(message);
    node.overrideTemperature = overrideTemperature;
    node.offTemperature = offTemperature;
    node.ecoTemperature = ecoTemperature;
    node.scheduler = schedulerJson;
    node.readMode = true;
  }
}

function readStatus(mac) {
  return JSON.parse(JSON.stringify(getGateWayStatus(mac)));
}

function readCurrentStatus(mac) {
  const gateWayStatus = gateWayStatuses[mac];
  if (gateWayStatus && gateWayStatus.read) {
    let allNodeRead = true;
    Object.keys(gateWayStatus.nodes).forEach((nodeMac) => {
      allNodeRead &= gateWayStatus.nodes[nodeMac].read // eslint-disable-line no-bitwise
        && gateWayStatus.nodes[nodeMac].readMode;
    });
    if (allNodeRead) {
      const parse = JSON.parse(JSON.stringify(gateWayStatus));
      delete parse.read;
      Object.keys(parse.nodes).forEach((nodeMac) => {
        const n = parse.nodes[nodeMac];
        delete n.read;
        delete n.readMode;
        delete n.message;
      });
      return parse;
    }
  }
  return {};
}

function gateWayList() {
  return Object.keys(gateWayStatuses);
}


module.exports.currentStatus = readStatus;
module.exports.gateWayList = gateWayList;
module.exports.readCurrentStatus = readCurrentStatus;
module.exports.addNode = addNode;
module.exports.addNodeMode = addNodeMode;
module.exports.setField = setField;
module.exports.schedulerToHex = schedulerToHex;
