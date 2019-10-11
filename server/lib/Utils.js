
function hexToUint8Array(hexString) {
  return Uint8Array.from(Buffer.from(hexString, 'hex'));
}

function arrayToHex(hex) {
  return Buffer.from(hex).toString('hex');
}

function arrayToInt16(hex) {
  return Buffer.from(hex).readInt16LE(0);
}

function arrayToInt8(hex) {
  return Buffer.from(hex).readInt8(0);
}

function shiftRight(message, bytes) {
  return message.subarray(bytes, message.length);
}

function int16ToUint8Array(int) {
  const buf = Buffer.allocUnsafe(2);
  buf.writeUInt16LE(int);
  return Uint8Array.from(buf);
}

function int8ToUint8Array(int) {
  return new Uint8Array([int]);
}

const modes = {
  0: 'AUTO',
  1: 'MAN',
  2: 'OFF',
  3: 'ECO',
  4: 'AUTO/MAN',
};


module.exports.hexToUint8Array = hexToUint8Array;
module.exports.int8ArrayToHex = arrayToHex;
module.exports.arrayToInt16 = arrayToInt16;
module.exports.arrayToInt8 = arrayToInt8;
module.exports.shiftRight = shiftRight;
module.exports.int16ToUint8Array = int16ToUint8Array;
module.exports.int8ToUint8Array = int8ToUint8Array;
module.exports.modes = modes;
