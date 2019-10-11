const {
  int8ArrayToHex,
  hexToUint8Array,
  shiftRight,
  arrayToInt16,
  arrayToInt8,
  int16ToUint8Array,
  int8ToUint8Array,
  modes,
} = require('./Utils');
const { constants } = require('./constant');
const { setField } = require('./DeviceStatus');
const { addNode } = require('./DeviceStatus');
const { addNodeMode, currentStatus } = require('./DeviceStatus');
const {
  MODE_INTEGER,
  OVERRIDE_TEMPERATURE,
  DEVICE_CHANGE_TYPE,
  TEMP_HOUR,
  TEMP_MINUTE,
} = require('./ActionDevice');

function readEventNumber(message) {
  const numberHex = message.slice(0, 3);
  return arrayToInt16(numberHex);
}

function readMac(message) {
  const macHex = message.slice(0, 6);
  return int8ArrayToHex(macHex);
}

function readModeInt(message) {
  const mode = message.slice(0, 1);
  return arrayToInt8(mode);
}

function readMode(message) {
  const i = readModeInt(message);
  return modes[i];
}

function readSoftVersion(message) {
  const softHex = message.slice(0, 2);
  return arrayToInt16(softHex);
}

function readTemp(message) {
  const softHex = message.slice(0, 2);
  return arrayToInt16(softHex) / 9;
}

function readWiFI(message) {
  const wifiHex = message.slice(0, 1);
  return arrayToInt8(wifiHex);
}


function readBattery(message) {
  const wifiHex = message.slice(0, 1);
  return arrayToInt8(wifiHex);
}

function readHumidity(message) {
  const wifiHex = message.slice(0, 1);
  return arrayToInt8(wifiHex);
}

function readActuatorStatus(message) {
  const actuatorStatusHex = message.slice(0, 1);
  const actuatorStatus = arrayToInt8(actuatorStatusHex);
  return (1 & actuatorStatus) === 1;
}

function readCountNodes(message) {
  const countHex = message.slice(0, 1);
  return arrayToInt8(countHex);
}

function readHardVersion(message) {
  const hardHex = message.slice(0, 1);
  return (hardHex[0] | 240) - 240;
}

function readNode(message) {
  const mac = readMac(message);
  let updatedMessage = shiftRight(message, 8);
  const hardVersion = readHardVersion(updatedMessage);
  updatedMessage = shiftRight(updatedMessage, 1);
  const battery = readBattery(updatedMessage);
  updatedMessage = shiftRight(updatedMessage, 1);
  const humidity = readHumidity(updatedMessage);
  updatedMessage = shiftRight(updatedMessage, 3);
  const actuatorStatus = readActuatorStatus(updatedMessage);
  updatedMessage = shiftRight(updatedMessage, 3);
  const curTemp = readTemp(updatedMessage);
  updatedMessage = shiftRight(updatedMessage, 2);
  const overrideTemperature = readTemp(updatedMessage);
  updatedMessage = shiftRight(updatedMessage, 2);
  const softVersion = readSoftVersion(updatedMessage);
  updatedMessage = shiftRight(updatedMessage, 4);
  const SptTemprature = readTemp(updatedMessage);
  return {
    mac,
    hardVersion,
    battery,
    humidity,
    curTemp,
    overrideTemperature,
    softVersion,
    actuatorStatus,
    SptTemprature,
  };
}

function readNodes(message, count) {
  const nodes = [];
  for (let i = 0; i < count; i++) {
    const node = readNode(message);
    nodes.push(node);
    addNode(node);
  }
  return nodes;
}

function deviceAskGateWay(message) {
  const number = readEventNumber(message);
  let updatedMessage = shiftRight(message, 2);
  const mac = readMac(updatedMessage);
  updatedMessage = shiftRight(updatedMessage, 12);
  const nodeMac = readMac(updatedMessage);
  updatedMessage = shiftRight(updatedMessage, 8);
  // let arrayToHex = int8ArrayToHex(updatedMessage);
  const mode = readMode(updatedMessage);
  const modeInt = readModeInt(updatedMessage);
  addNodeMode(nodeMac, mode, modeInt);
  return {
    operation: constants[constants.GATEWAY_ASK_DEVICE],
    count: number,
    mac,
    nodeMac,
    mode,
    modeInt,
    plugin: require('./GateWayConnections'),
  };
}

function deviceToGateWay(message) {
  const number = readEventNumber(message);
  let updatedMessage = shiftRight(message, 2);
  const mac = readMac(updatedMessage);
  setField('mac', mac);
  updatedMessage = shiftRight(updatedMessage, 12);
  const softVersion = readSoftVersion(updatedMessage);
  setField('softVersion', softVersion);
  updatedMessage = shiftRight(updatedMessage, 2);
  const hardVersion = readHardVersion(updatedMessage);
  setField('hardVersion', hardVersion);
  updatedMessage = shiftRight(updatedMessage, 1);
  const wifiLevel = readWiFI(updatedMessage);
  setField('wifiLevel', wifiLevel);
  updatedMessage = shiftRight(updatedMessage, 2);
  const countNodes = readCountNodes(updatedMessage);
  updatedMessage = shiftRight(updatedMessage, 1);
  const nodes = readNodes(updatedMessage, countNodes);
  setField('read', true);
  return {
    operation: constants[constants.GATEWAY_DEVICE],
    count: number,
    mac,
    softVersion,
    hardVersion,
    wifiLevel,
    plugin: require('./GateWayConnections'),
    nodes,
  };
}

function deviceConfirmation(message) {
  const number = readEventNumber(message);
  const updatedMessage = shiftRight(message, 2);
  const mac = readMac(updatedMessage);
  return {
    operation: constants[constants.CONFIRM_WRITE_DEVICE],
    count: number,
    mac,
    plugin: require('./GateWayConnections'),
  };
}

function gateWayToDevice(event) {
  const array = new Uint8Array(44);
  array.set(hexToUint8Array('0002'));
  array.set(int16ToUint8Array(event.count), 2);
  array.set(hexToUint8Array(event.mac), 4);
  const date = new Date();
  const minutes = date.getMinutes();
  const hour = date.getHours();
  const dayOfWeek = date.getDay();
  const year = date.getFullYear();
  const dayOfMonth = date.getDate();
  const month = date.getMonth() + 1;
  array.set(int8ToUint8Array(hour), 17);
  array.set(int8ToUint8Array(minutes), 18);
  array.set(int8ToUint8Array(56), 19);
  array.set(int8ToUint8Array(dayOfWeek), 20);
  array.set(int8ToUint8Array(month), 21);
  array.set(int8ToUint8Array(dayOfMonth), 22);
  // array.set(hexToUint8Array('0a06'), 22);
  array.set(int16ToUint8Array(year), 23);
  array.set(hexToUint8Array('000'), 25);
  const arrayToHex = int8ArrayToHex(array);
  return array;
}

function gateWayAskDevice(event, node) {
  const array = new Uint8Array(22);
  array.set(hexToUint8Array('00051a00'));
  array.set(hexToUint8Array(event.mac), 4);
  array.set(hexToUint8Array(event.mac), 4);
  array.set(hexToUint8Array(node.mac), 16);
  return array;
}

function gateWayActionDevice(event, action) {
  const date = new Date();
  const seconds = date.getSeconds();
  const minutes = date.getMinutes();
  const hour = date.getHours();
  const dayOfWeek = date.getDay();
  if (action.type === DEVICE_CHANGE_TYPE) {
    const array = new Uint8Array(415);
    array.set(hexToUint8Array('00031a00'));
    // array.set(hexToUint8Array('fee8922dec10000000000000fce892000bff010003001800400bde03760200030000040101b207030000040101b2070000760207000807090054060c0062070e005406101e6207171e760200000000000000000000000000000000000000000000000000007602061e0807081ea0050c00a0050e00a005101e6207161e760200000000000000000000000000000000000000000000000000007602061e0807081ea0050c00a0050e00a005101e6207161e760200000000000000000000000000000000000000000000000000007602060fe907081ea0050c00a0050e00a005101e6207161e760200000000000000000000000000000000000000000000000000007602061e0807081ea0050c00a0050e00a005101e6207161e760200000000000000000000000000000000000000000000000000007602061e0807081ea0050c00a0050e00a005101e6207161e76020000000000000000000000000000000000000000000000000000760207000807090054060c0062070e005406101e6207171e7602000000000000000000000000000000000000000000000000'),4);
    array.set(hexToUint8Array(event.mac), 4);
    array.set(hexToUint8Array(action.mac), 16);
    array.set(int16ToUint8Array((hour + minutes + seconds) * dayOfWeek), 22);
    // array.set(hexToUint8Array('3502'), 22);
    if (action[MODE_INTEGER]) {
      array.set(int8ToUint8Array(action[MODE_INTEGER]), 24);
    } else {
      array.set(int8ToUint8Array(currentStatus().nodes[action.mac].modeInt), 24);
    }
    array.set(hexToUint8Array('1800'), 26);
    // array.set(hexToUint8Array('161e'), 26);
    if (action[OVERRIDE_TEMPERATURE]) {
      array.set(int16ToUint8Array(action[OVERRIDE_TEMPERATURE] * 9), 28);
    } else {
      array.set(int16ToUint8Array(currentStatus().nodes[action.mac].overrideTemperature * 9), 28);
    }
    array.set(hexToUint8Array('de03'), 30);// EcoTemperature
    array.set(hexToUint8Array('7602'), 32);// OffTemperature
    array.set(hexToUint8Array('00030000040101b207030000040101b2070000760207000807090054060c0062070e005406101e6207171e760200000000000000000000000000000000000000000000000000007602061e0807081ea0050c00a0050e00a005101e6207161e760200000000000000000000000000000000000000000000000000007602061e0807081ea0050c00a0050e00a005101e6207161e760200000000000000000000000000000000000000000000000000007602060fe907081ea0050c00a0050e00a005101e6207161e760200000000000000000000000000000000000000000000000000007602061e0807081ea0050c00a0050e00a005101e6207161e760200000000000000000000000000000000000000000000000000007602061e0807081ea0050c00a0050e00a005101e6207161e76020000000000000000000000000000000000000000000000000000760207000807090054060c0062070e005406101e6207171e7602000000000000000000000000000000000000000000000000'), 34);// ?
    // let arrayToHex = int8ArrayToHex(array);
    return array;
  }

  const array = new Uint8Array(28);
  array.set(hexToUint8Array('000f'));
  array.set(int16ToUint8Array((hour + minutes + seconds) * dayOfWeek), 2);
  array.set(hexToUint8Array(event.mac), 4);
  array.set(hexToUint8Array(action.mac), 16);
  array.set(int8ToUint8Array(1), 22);
  array.set(int8ToUint8Array(action[TEMP_HOUR]), 23);
  array.set(int8ToUint8Array(action[TEMP_MINUTE]), 24);
  array.set(int8ToUint8Array(1), 25);
  array.set(int16ToUint8Array(action[OVERRIDE_TEMPERATURE] * 9), 26);
  return array;
}

module.exports.deviceToGateWay = deviceToGateWay;
module.exports.deviceAskGateWay = deviceAskGateWay;
module.exports.gateWayToDevice = gateWayToDevice;
module.exports.gateWayAskDevice = gateWayAskDevice;
module.exports.gateWayActionDevice = gateWayActionDevice;
module.exports.deviceConfirmation = deviceConfirmation;
