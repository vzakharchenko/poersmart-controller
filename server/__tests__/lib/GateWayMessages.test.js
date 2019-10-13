const { gateWaySelector } = require('../../lib/GateWayMessages');
const { hexToUint8Array, int8ArrayToHex } = require('../../lib/Utils');


test('GateWay Device-> Cloud', () => {
  const hex = hexToUint8Array('021b1f00fee8922dec1000000000000015008ad00000');
  const event = gateWaySelector(hex);
  expect(event.operation).toEqual('GATEWAY_DEVICE');
  expect(event.count).toEqual(31);
  expect(event.mac).toEqual('fee8922dec10');
  expect(event.softVersion).toEqual(21);
  expect(event.hardVersion).toEqual(10);
  expect(event.wifiLevel).toEqual(-48);
  expect(event.plugin).toBeDefined();
  expect(event.nodes).toBeDefined();
  expect(event.nodes.length).toEqual(0);
  const message = event.plugin.gateWayToDevice(event);
  expect(message).toBeDefined();
});

test('GateWay Device-> Cloud With Node', () => {
  const hex = hexToUint8Array('021b0d02fee8922dec1000000000000015008ac40001fce892000bff007d8a4f3b06b806001d31086207140000007602');
  const event = gateWaySelector(hex);
  expect(event.operation).toEqual('GATEWAY_DEVICE');
  expect(event.count).toEqual(525);
  expect(event.mac).toEqual('fee8922dec10');
  expect(event.softVersion).toEqual(21);
  expect(event.hardVersion).toEqual(10);
  expect(event.hardVersion).toEqual(10);
  expect(event.wifiLevel).toEqual(-60);
  expect(event.plugin).toBeDefined();
  expect(event.nodes).toBeDefined();
  expect(event.nodes.length).toEqual(1);
  const node = event.nodes[0];
  expect(node).toBeDefined();
  expect(node.mac).toEqual('fce892000bff');
  expect(node.softVersion).toEqual(20);
  expect(node.hardVersion).toEqual(10);
  expect(node.battery).toEqual(79);
  expect(node.actuatorStatus).toEqual(false);
  expect(node.humidity).toEqual(59);
  expect(node.curTemp).toEqual(233);
  // expect(node.overrideTemperature).toEqual(210);
  // expect(node.SptTemprature).toEqual(70);
  const message1 = event.plugin.gateWayToDevice(event);
  expect(message1).toBeDefined();
  const message2 = event.plugin.gateWayAskDevice(event, node);
  expect(message2).toBeDefined();
  const arrayToHex = int8ArrayToHex(message2);
  expect(arrayToHex).toEqual('00051a00fee8922dec10000000000000fce892000bff');
});

test('GateWay Device-> Cloud With Node Actuator Active', () => {
  const hex = hexToUint8Array('021b0d02fee8922dec1000000000000015008ac40001fce892000bff007d8a4f3b06b807001d31086207140000007602');
  const event = gateWaySelector(hex);
  expect(event.operation).toEqual('GATEWAY_DEVICE');
  expect(event.count).toEqual(525);
  expect(event.mac).toEqual('fee8922dec10');
  expect(event.softVersion).toEqual(21);
  expect(event.hardVersion).toEqual(10);
  expect(event.hardVersion).toEqual(10);
  expect(event.wifiLevel).toEqual(-60);
  expect(event.plugin).toBeDefined();
  expect(event.nodes).toBeDefined();
  expect(event.nodes.length).toEqual(1);
  const node = event.nodes[0];
  expect(node).toBeDefined();
  expect(node.mac).toEqual('fce892000bff');
  expect(node.softVersion).toEqual(20);
  expect(node.hardVersion).toEqual(10);
  expect(node.battery).toEqual(79);
  expect(node.actuatorStatus).toEqual(true);
  expect(node.humidity).toEqual(59);
  expect(node.curTemp).toEqual(233);
  // expect(node.overrideTemperature).toEqual(210);
  // expect(node.SptTemprature).toEqual(70);
  const message1 = event.plugin.gateWayToDevice(event);
  const arrayToHex1 = int8ArrayToHex(message1);
  expect(message1).toBeDefined();
  const message2 = event.plugin.gateWayAskDevice(event, node);
  expect(message2).toBeDefined();
  const arrayToHex = int8ArrayToHex(message2);
  expect(arrayToHex).toEqual('00051a00fee8922dec10000000000000fce892000bff');
});

test('GateWay Device-> Cloud Response AUTO/MAN', () => {
  const hex = hexToUint8Array('02061a00fee8922dec10000000000000fce892000bffba000400171e00000000c20100030000040101b207030000040101b2070000760207000807090054060c0062070e005406101e6207171e760218007602000000000000000000000000000000000000000000007602061e0807081ea0050c00a0050e00a005101e6207161e760218007602000000000000000000000000000000000000000000007602061e0807081ea0050c00a0050e00a005101e6207161e760218007602000000000000000000000000000000000000000000007602061e0807081ea0050c00a0050e00a005101e6207161e760218007602000000000000000000000000000000000000000000007602061e0807081ea0050c00a0050e00a005101e6207161e760218007602000000000000000000000000000000000000000000007602061e0807081ea0050c00a0050e00a005101e6207161e76021800760200000000000000000000000000000000000000000000760207000807090054060c0062070e005406101e6207171e7602180076020000000000000000000000000000000000000000');
  const event = gateWaySelector(hex);
  expect(event.operation).toEqual('GATEWAY_ASK_DEVICE');
  expect(event.count).toEqual(26);
  expect(event.mac).toEqual('fee8922dec10');
  expect(event.nodeMac).toEqual('fce892000bff');
  expect(event.mode).toEqual('AUTO/MAN');
  expect(event.modeInt).toEqual(4);
  expect(event.plugin).toBeDefined();
});

test('GateWay Device-> Cloud Response MAN', () => {
  const hex = hexToUint8Array('02061a00fee8922dec10000000000000fce892000bffbc040100171e00000000c20100030000040101b207030000040101b2070000760207000807090054060c0062070e005406101e6207171e760218007602000000000000000000000000000000000000000000007602061e0807081ea0050c00a0050e00a005101e6207161e760218007602000000000000000000000000000000000000000000007602061e0807081ea0050c00a0050e00a005101e6207161e760218007602000000000000000000000000000000000000000000007602061e0807081ea0050c00a0050e00a005101e6207161e760218007602000000000000000000000000000000000000000000007602061e0807081ea0050c00a0050e00a005101e6207161e760218007602000000000000000000000000000000000000000000007602061e0807081ea0050c00a0050e00a005101e6207161e76021800760200000000000000000000000000000000000000000000760207000807090054060c0062070e005406101e6207171e7602180076020000000000000000000000000000000000000000');
  const event = gateWaySelector(hex);
  expect(event.operation).toEqual('GATEWAY_ASK_DEVICE');
  expect(event.count).toEqual(26);
  expect(event.mac).toEqual('fee8922dec10');
  expect(event.nodeMac).toEqual('fce892000bff');
  expect(event.mode).toEqual('MAN');
  expect(event.modeInt).toEqual(1);
  expect(event.plugin).toBeDefined();
});


test('GateWay Device-> Cloud Response AUTO', () => {
  const hex = hexToUint8Array('02061a00fee8922dec10000000000000fce892000bffbe010000171e00000000c20100030000040101b207030000040101b2070000760207000807090054060c0062070e005406101e6207171e760218007602000000000000000000000000000000000000000000007602061e0807081ea0050c00a0050e00a005101e6207161e760218007602000000000000000000000000000000000000000000007602061e0807081ea0050c00a0050e00a005101e6207161e760218007602000000000000000000000000000000000000000000007602061e0807081ea0050c00a0050e00a005101e6207161e760218007602000000000000000000000000000000000000000000007602061e0807081ea0050c00a0050e00a005101e6207161e760218007602000000000000000000000000000000000000000000007602061e0807081ea0050c00a0050e00a005101e6207161e76021800760200000000000000000000000000000000000000000000760207000807090054060c0062070e005406101e6207171e7602180076020000000000000000000000000000000000000000');
  const event = gateWaySelector(hex);
  expect(event.operation).toEqual('GATEWAY_ASK_DEVICE');
  expect(event.count).toEqual(26);
  expect(event.mac).toEqual('fee8922dec10');
  expect(event.nodeMac).toEqual('fce892000bff');
  expect(event.mode).toEqual('AUTO');
  expect(event.modeInt).toEqual(0);
  expect(event.plugin).toBeDefined();
});

test('GateWay Device-> Cloud Response ECO', () => {
  const hex = hexToUint8Array('02061a00fee8922dec10000000000000fce892000bffc0010300171e00000000c20100030000040101b207030000040101b2070000760207000807090054060c0062070e005406101e6207171e760218007602000000000000000000000000000000000000000000007602061e0807081ea0050c00a0050e00a005101e6207161e760218007602000000000000000000000000000000000000000000007602061e0807081ea0050c00a0050e00a005101e6207161e760218007602000000000000000000000000000000000000000000007602061e0807081ea0050c00a0050e00a005101e6207161e760218007602000000000000000000000000000000000000000000007602061e0807081ea0050c00a0050e00a005101e6207161e760218007602000000000000000000000000000000000000000000007602061e0807081ea0050c00a0050e00a005101e6207161e76021800760200000000000000000000000000000000000000000000760207000807090054060c0062070e005406101e6207171e7602180076020000000000000000000000000000000000000000');
  const event = gateWaySelector(hex);
  expect(event.operation).toEqual('GATEWAY_ASK_DEVICE');
  expect(event.count).toEqual(26);
  expect(event.mac).toEqual('fee8922dec10');
  expect(event.nodeMac).toEqual('fce892000bff');
  expect(event.mode).toEqual('ECO');
  expect(event.modeInt).toEqual(3);
  expect(event.plugin).toBeDefined();
});


test('GateWay Device-> Cloud Response OFF', () => {
  const hex = hexToUint8Array('02061a00fee8922dec10000000000000fce892000bffc2030200171e00000000c20100030000040101b207030000040101b2070000760207000807090054060c0062070e005406101e6207171e760218007602000000000000000000000000000000000000000000007602061e0807081ea0050c00a0050e00a005101e6207161e760218007602000000000000000000000000000000000000000000007602061e0807081ea0050c00a0050e00a005101e6207161e760218007602000000000000000000000000000000000000000000007602061e0807081ea0050c00a0050e00a005101e6207161e760218007602000000000000000000000000000000000000000000007602061e0807081ea0050c00a0050e00a005101e6207161e760218007602000000000000000000000000000000000000000000007602061e0807081ea0050c00a0050e00a005101e6207161e76021800760200000000000000000000000000000000000000000000760207000807090054060c0062070e005406101e6207171e7602180076020000000000000000000000000000000000000000');
  const event = gateWaySelector(hex);
  expect(event.operation).toEqual('GATEWAY_ASK_DEVICE');
  expect(event.count).toEqual(26);
  expect(event.mac).toEqual('fee8922dec10');
  expect(event.nodeMac).toEqual('fce892000bff');
  expect(event.mode).toEqual('OFF');
  expect(event.modeInt).toEqual(2);
  expect(event.plugin).toBeDefined();
});

test('Cloud-> Device Action change mode ', () => {
  const hex = hexToUint8Array('021b0d02fee8922dec1000000000000015008ac40001fce892000bff007d8a4f3b06b807001d31086207140000007602');
  const event = gateWaySelector(hex);
  const hex1 = hexToUint8Array('02061a00fee8922dec10000000000000fce892000bffc2030200171e00000000c20100030000040101b207030000040101b2070000760207000807090054060c0062070e005406101e6207171e760218007602000000000000000000000000000000000000000000007602061e0807081ea0050c00a0050e00a005101e6207161e760218007602000000000000000000000000000000000000000000007602061e0807081ea0050c00a0050e00a005101e6207161e760218007602000000000000000000000000000000000000000000007602061e0807081ea0050c00a0050e00a005101e6207161e760218007602000000000000000000000000000000000000000000007602061e0807081ea0050c00a0050e00a005101e6207161e760218007602000000000000000000000000000000000000000000007602061e0807081ea0050c00a0050e00a005101e6207161e76021800760200000000000000000000000000000000000000000000760207000807090054060c0062070e005406101e6207171e7602180076020000000000000000000000000000000000000000');
  const event2 = gateWaySelector(hex1);

  expect(event.operation).toEqual('GATEWAY_DEVICE');
  expect(event.count).toEqual(525);
  expect(event.mac).toEqual('fee8922dec10');
  expect(event.softVersion).toEqual(21);
  expect(event.hardVersion).toEqual(10);
  expect(event.hardVersion).toEqual(10);
  expect(event.wifiLevel).toEqual(-60);
  expect(event.plugin).toBeDefined();
  expect(event.nodes).toBeDefined();
  expect(event.nodes.length).toEqual(1);
  const node = event.nodes[0];
  expect(node).toBeDefined();
  expect(node.mac).toEqual('fce892000bff');
  expect(node.softVersion).toEqual(20);
  expect(node.hardVersion).toEqual(10);
  expect(node.battery).toEqual(79);
  expect(node.actuatorStatus).toEqual(true);
  expect(node.humidity).toEqual(59);
  expect(node.curTemp).toEqual(233);
  // expect(node.overrideTemperature).toEqual(210);
  // expect(node.SptTemprature).toEqual(70);
  const action = {
    mac: node.mac,
    modeInt: 1,
    type: 'device_type',
  };
  const message1 = event.plugin.gateWayActionDevice(event, action);
  expect(message1).toBeDefined();
});


test('Cloud-> Device Action TempTemperature ', () => {
  const hex = hexToUint8Array('021b0d02fee8922dec1000000000000015008ac40001fce892000bff007d8a4f3b06b807001d31086207140000007602');
  const event = gateWaySelector(hex);
  expect(event.operation).toEqual('GATEWAY_DEVICE');
  expect(event.count).toEqual(525);
  expect(event.mac).toEqual('fee8922dec10');
  expect(event.softVersion).toEqual(21);
  expect(event.hardVersion).toEqual(10);
  expect(event.hardVersion).toEqual(10);
  expect(event.wifiLevel).toEqual(-60);
  expect(event.plugin).toBeDefined();
  expect(event.nodes).toBeDefined();
  expect(event.nodes.length).toEqual(1);
  const node = event.nodes[0];
  expect(node).toBeDefined();
  expect(node.mac).toEqual('fce892000bff');
  expect(node.softVersion).toEqual(20);
  expect(node.hardVersion).toEqual(10);
  expect(node.battery).toEqual(79);
  expect(node.actuatorStatus).toEqual(true);
  expect(node.humidity).toEqual(59);
  expect(node.curTemp).toEqual(233);
  // expect(node.overrideTemperature).toEqual(210);
  // expect(node.SptTemprature).toEqual(70);
  const action = {
    mac: node.mac,
    modeInt: 1,
    overrideTemperature: 210,
    type: 'device_temp_type',
    temp_hour: 19,
    temp_minute: 15,
  };
  const message1 = event.plugin.gateWayActionDevice(event, action);
  const arrayToHex = int8ArrayToHex(message1.subarray(4));
  expect(arrayToHex).toEqual('fee8922dec10000000000000fce892000bff01130f016207');
});
