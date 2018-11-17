const { sendData } = require('./restCalls.js');

const modes = {
  AUTO: 0,
  MAN: 1,
  OFF: 2,
  ECO: 3,
  'AUTO/MAN': 4,
};

const modeTemp = {
  MAN: 'ManTemprature',
  OFF: 'OffTemprature',
  ECO: 'EcoTemprature',
};

function newAuth(url, loginPage, email, password, appKey, timezone) {
  return new Promise((resolve, reject) => {
    const authData = {
      Email: email,
      Passwd: password,
      AppKey: appKey,
      TimezoneOffset: timezone || 0,
    };
    sendData(`${url}${loginPage}`, 'POST', JSON.stringify(authData), {
      'Content-Type': 'application/json',
    }).then(response => resolve(JSON.parse(response))).catch(e => reject(e));
  });
}

function gateway(url, token, authJson) {
  return new Promise((resolve, reject) => {
    sendData(`${url}/newUsers/${authJson.Id}/${authJson.LocateId}/gateway`, 'GET', null, {
      Authorization: token,
    }).then(response => resolve(JSON.parse(response))).catch(e => reject(e));
  });
}


function nodes(url, token, authJson) {
  return new Promise((resolve, reject) => {
    sendData(`${url}/newUsers/${authJson.Id}/${authJson.LocateId}/nodes`, 'GET', null, {
      Authorization: token,
    }).then(response => resolve(JSON.parse(response))).catch(e => reject(e));
  });
}


function getNode(nodeId, url, token, authJson) {
  return new Promise((resolve, reject) => {
    sendData(`${url}/newUsers/${authJson.Id}/nodeList/${nodeId}/NodeSetting`, 'GET', null, {
      Authorization: token,
      'content-type': 'application/json',
    }).then(response => resolve(JSON.parse(response))).catch(e => reject(e));
  });
}

function actuatorStatus(node, url, token, authJson) {
  return new Promise((resolve, reject) => {
    sendData(
      `${url}/newUsers/${authJson.Id}/nodeList/${node.Id}/actuatorStatus`, 'GET',
      null, {
        Authorization: token,
      },
    ).then(response => resolve(JSON.parse(response))).catch(e => reject(e));
  });
}

function tmpOverride(node, temp, hour, min, url, token, authJson) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify({ Temperature: temp, Hour: hour, Min: min });
    console.log(`override Data: ${data}`);
    sendData(
      `${url}/newUsers/${authJson.Id}/nodeList/${node.Id}/tmpOverride`, 'POST',
      data, {
        Authorization: token,
        'content-type': 'application/json',
      },
    ).then((response) => {
      const json = JSON.parse(response);
      if (json.Flag) {
        resolve(json);
      } else {
        reject('Incorrect Answer');
      }
    }).catch(e => reject(e));
  });
}

function cancelTmpOverride(node, url, token, authJson) {
  return new Promise((resolve, reject) => {
    sendData(
      `${url}/newUsers/${authJson.Id}/nodeList/${node.Id}/OverrideSetting`, 'POST',
      JSON.stringify({
        enable: false,
        hour: 16,
        min: 0,
        temperature: 1800,
      }), {
        Authorization: token,
        'content-type': 'application/json',
      },
    ).then((response) => {
      const json = JSON.parse(response);
      if (json.Message === 'Success') {
        resolve(json);
      } else {
        reject('Incorrect Answer');
      }
    }).catch(e => reject(e));
  });
}


function nodeSetting(node, url, token, authJson, updateNode) {
  return new Promise((resolve, reject) => {
    sendData(
      `${url}/newUsers/${authJson.Id}/nodeList/${node.Id}/NodeSetting`, 'POST',
      JSON.stringify(Object.assign({ HolidayEnable: false }, node, updateNode(node))), {
        Authorization: token,
        'content-type': 'application/json',
      },
    ).then(response => resolve(JSON.parse(response))).catch(e => reject(e));
  });
}


function changeMode(node, mode, url, token, authJson) {
  return nodeSetting(node, url, token, authJson, () => ({
    DisplayMode: 0,
    WorkMode: modes[mode] || modes.AUTO,
    BackWorkMode: 0,
    HolidayEnable: false,
  }));
}

function setTemp(node, tempType, tempValue, url, token, authJson) {
  return nodeSetting(node, url, token, authJson, () => {
    const currentNode = {};
    currentNode[tempType] = tempValue;
    return currentNode;
  });
}

module.exports.newAuth = newAuth;
module.exports.gateway = gateway;
module.exports.nodes = nodes;
module.exports.changeMode = changeMode;
module.exports.getNode = getNode;
module.exports.setTemp = setTemp;
module.exports.actuatorStatus = actuatorStatus;
module.exports.tmpOverride = tmpOverride;
module.exports.cancelTmpOverride = cancelTmpOverride;
module.exports.modes = modes;
module.exports.modeTemp = modeTemp;

