const {
  int8ArrayToHex,
  hexToUint8Array,
  arrayToInt16,
  arrayToInt8,
  shiftRight,
  int16ToUint8Array,
  int8ToUint8Array,
} = require('../../lib/Utils');


test('Utils Array->Hex', () => {
  const hex = new Uint8Array([0, 1]);
  const hexString = int8ArrayToHex(hex);
  expect(hexString).toEqual('0001');
});

test('Utils Hex->Array', () => {
  const hex = hexToUint8Array('0002');
  expect(JSON.stringify(hex)).toEqual('{"0":0,"1":2}');
});

test('Utils Hex->Int16', () => {
  const int16 = arrayToInt16(hexToUint8Array('1f00'));
  expect(int16).toEqual(31);
});

test('Utils Hex->Int8', () => {
  const int16 = arrayToInt8(hexToUint8Array('1f'));
  expect(int16).toEqual(31);
});

test('Utils Int->Array', () => {
  const array = int16ToUint8Array(1234);
  expect(JSON.stringify(array)).toEqual('{"0":210,"1":4}');
});

test('Utils Byte->Array', () => {
  const array = int8ToUint8Array(12);
  expect(JSON.stringify(array)).toEqual('{"0":12}');
});

test('Utils shiftRight', () => {
  const message = shiftRight(hexToUint8Array('01020304050607'), 2);
  expect(int8ArrayToHex(message)).toEqual('0304050607');
});
