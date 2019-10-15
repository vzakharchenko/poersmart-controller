const { schedulerToHex } = require('../../lib/DeviceStatus');
const { int8ArrayToHex } = require('../../lib/Utils');

test('schedulerToHex test', () => {
  const json = [
    [
      {
        hour: 0,
        minute: 0,
        temp: 70,
      },
      {
        hour: 7,
        minute: 0,
        temp: 200,
      },
      {
        hour: 9,
        minute: 0,
        temp: 180,
      },
      {
        hour: 12,
        minute: 0,
        temp: 210,
      },
      {
        hour: 14,
        minute: 0,
        temp: 180,
      },
      {
        hour: 16,
        minute: 30,
        temp: 210,
      },
      {
        hour: 23,
        minute: 30,
        temp: 70,
      },
      {
        hour: 0,
        minute: 0,
        temp: 0,
      },
      {
        hour: 0,
        minute: 0,
        temp: 0,
      },
      {
        hour: 0,
        minute: 0,
        temp: 0,
      },
      {
        hour: 0,
        minute: 0,
        temp: 0,
      },
      {
        hour: 0,
        minute: 0,
        temp: 0,
      },
      {
        hour: 0,
        minute: 0,
        temp: 0,
      },
    ],
    [
      {
        hour: 0,
        minute: 0,
        temp: 70,
      },
      {
        hour: 6,
        minute: 30,
        temp: 200,
      },
      {
        hour: 8,
        minute: 30,
        temp: 160,
      },
      {
        hour: 12,
        minute: 0,
        temp: 160,
      },
      {
        hour: 14,
        minute: 0,
        temp: 160,
      },
      {
        hour: 16,
        minute: 30,
        temp: 210,
      },
      {
        hour: 22,
        minute: 30,
        temp: 70,
      },
      {
        hour: 0,
        minute: 0,
        temp: 0,
      },
      {
        hour: 0,
        minute: 0,
        temp: 0,
      },
      {
        hour: 0,
        minute: 0,
        temp: 0,
      },
      {
        hour: 0,
        minute: 0,
        temp: 0,
      },
      {
        hour: 0,
        minute: 0,
        temp: 0,
      },
      {
        hour: 0,
        minute: 0,
        temp: 0,
      },
    ],
    [
      {
        hour: 0,
        minute: 0,
        temp: 70,
      },
      {
        hour: 6,
        minute: 30,
        temp: 200,
      },
      {
        hour: 8,
        minute: 30,
        temp: 160,
      },
      {
        hour: 12,
        minute: 0,
        temp: 160,
      },
      {
        hour: 14,
        minute: 0,
        temp: 160,
      },
      {
        hour: 16,
        minute: 30,
        temp: 210,
      },
      {
        hour: 22,
        minute: 30,
        temp: 70,
      },
      {
        hour: 0,
        minute: 0,
        temp: 0,
      },
      {
        hour: 0,
        minute: 0,
        temp: 0,
      },
      {
        hour: 0,
        minute: 0,
        temp: 0,
      },
      {
        hour: 0,
        minute: 0,
        temp: 0,
      },
      {
        hour: 0,
        minute: 0,
        temp: 0,
      },
      {
        hour: 0,
        minute: 0,
        temp: 0,
      },
    ],
    [
      {
        hour: 0,
        minute: 0,
        temp: 70,
      },
      {
        hour: 6,
        minute: 15,
        temp: 225,
      },
      {
        hour: 8,
        minute: 30,
        temp: 160,
      },
      {
        hour: 12,
        minute: 0,
        temp: 160,
      },
      {
        hour: 14,
        minute: 0,
        temp: 160,
      },
      {
        hour: 16,
        minute: 30,
        temp: 210,
      },
      {
        hour: 22,
        minute: 30,
        temp: 70,
      },
      {
        hour: 0,
        minute: 0,
        temp: 0,
      },
      {
        hour: 0,
        minute: 0,
        temp: 0,
      },
      {
        hour: 0,
        minute: 0,
        temp: 0,
      },
      {
        hour: 0,
        minute: 0,
        temp: 0,
      },
      {
        hour: 0,
        minute: 0,
        temp: 0,
      },
      {
        hour: 0,
        minute: 0,
        temp: 0,
      },
    ],
    [
      {
        hour: 0,
        minute: 0,
        temp: 70,
      },
      {
        hour: 6,
        minute: 30,
        temp: 200,
      },
      {
        hour: 8,
        minute: 30,
        temp: 160,
      },
      {
        hour: 12,
        minute: 0,
        temp: 160,
      },
      {
        hour: 14,
        minute: 0,
        temp: 160,
      },
      {
        hour: 16,
        minute: 30,
        temp: 210,
      },
      {
        hour: 22,
        minute: 30,
        temp: 70,
      },
      {
        hour: 0,
        minute: 0,
        temp: 0,
      },
      {
        hour: 0,
        minute: 0,
        temp: 0,
      },
      {
        hour: 0,
        minute: 0,
        temp: 0,
      },
      {
        hour: 0,
        minute: 0,
        temp: 0,
      },
      {
        hour: 0,
        minute: 0,
        temp: 0,
      },
      {
        hour: 0,
        minute: 0,
        temp: 0,
      },
    ],
    [
      {
        hour: 0,
        minute: 0,
        temp: 70,
      },
      {
        hour: 6,
        minute: 30,
        temp: 200,
      },
      {
        hour: 8,
        minute: 30,
        temp: 160,
      },
      {
        hour: 12,
        minute: 0,
        temp: 160,
      },
      {
        hour: 14,
        minute: 0,
        temp: 160,
      },
      {
        hour: 16,
        minute: 30,
        temp: 210,
      },
      {
        hour: 22,
        minute: 30,
        temp: 70,
      },
      {
        hour: 0,
        minute: 0,
        temp: 0,
      },
      {
        hour: 0,
        minute: 0,
        temp: 0,
      },
      {
        hour: 0,
        minute: 0,
        temp: 0,
      },
      {
        hour: 0,
        minute: 0,
        temp: 0,
      },
      {
        hour: 0,
        minute: 0,
        temp: 0,
      },
      {
        hour: 0,
        minute: 0,
        temp: 0,
      },
    ],
    [
      {
        hour: 0,
        minute: 0,
        temp: 70,
      },
      {
        hour: 7,
        minute: 0,
        temp: 200,
      },
      {
        hour: 9,
        minute: 0,
        temp: 180,
      },
      {
        hour: 12,
        minute: 0,
        temp: 210,
      },
      {
        hour: 14,
        minute: 0,
        temp: 180,
      },
      {
        hour: 16,
        minute: 30,
        temp: 210,
      },
      {
        hour: 23,
        minute: 30,
        temp: 70,
      },
      {
        hour: 0,
        minute: 0,
        temp: 0,
      },
      {
        hour: 0,
        minute: 0,
        temp: 0,
      },
      {
        hour: 0,
        minute: 0,
        temp: 0,
      },
      {
        hour: 0,
        minute: 0,
        temp: 0,
      },
      {
        hour: 0,
        minute: 0,
        temp: 0,
      },
      {
        hour: 0,
        minute: 0,
        temp: 0,
      },
    ],
  ];
  const array = schedulerToHex(json);
  const hex = int8ArrayToHex(array);
  expect(hex).toEqual('0000760207000807090054060c0062070e005406101e6207171e760200000000000000000000000000000000000000000000000000007602061e0807081ea0050c00a0050e00a005101e6207161e760200000000000000000000000000000000000000000000000000007602061e0807081ea0050c00a0050e00a005101e6207161e760200000000000000000000000000000000000000000000000000007602060fe907081ea0050c00a0050e00a005101e6207161e760200000000000000000000000000000000000000000000000000007602061e0807081ea0050c00a0050e00a005101e6207161e760200000000000000000000000000000000000000000000000000007602061e0807081ea0050c00a0050e00a005101e6207161e76020000000000000000000000000000000000000000000000000000760207000807090054060c0062070e005406101e6207171e7602000000000000000000000000000000000000000000000000');
});
