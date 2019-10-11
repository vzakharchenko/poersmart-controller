const actionDevice = {
  action: {},
};


function setAction(nodeMac, fieldName, fieldValue) {
  let element = actionDevice.action[nodeMac];
  if (!element) {
    element = {};
    actionDevice.action[nodeMac] = element;
  }
  element[fieldName] = fieldValue;
  element.mac = nodeMac;
}
function activateAction(nodeMac, type) {
  const element = actionDevice.action[nodeMac];
  if (element) {
    element.status = true;
    element.type = type;
  }
}
function getAction(nodeMac) {
  const element = actionDevice.action[nodeMac];
  if (element) {
    if (element.status) {
      const action = JSON.parse(JSON.stringify(element));
      delete actionDevice.action[nodeMac];
      return action;
    }
  }
  return null;
}
//
// function readStatus() {
//   return JSON.parse(JSON.stringify(actionDevice));
// }
//
// module.exports.actionDevice = readStatus;
module.exports.setAction = setAction;

module.exports.activateAction = activateAction;
module.exports.getAction = getAction;

module.exports.MODE_INTEGER = 'modeInt';
module.exports.OVERRIDE_TEMPERATURE = 'overrideTemperature';
module.exports.MAC = 'mac';
module.exports.DEVICE_CHANGE_TYPE = 'device_type';
module.exports.DEVICE_TEMP_TYPE = 'device_temp_type';
module.exports.TEMP_HOUR = 'temp_hour';
module.exports.TEMP_MINUTE = 'temp_minute';
