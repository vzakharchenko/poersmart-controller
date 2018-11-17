const moment = require('moment');
const {
  nodes,
  gateway,
  modes,
  getNode,
  setTemp,
  actuatorStatus,
  changeMode,
  tmpOverride,
  cancelTmpOverride,
} = require('./poersApi.js');

function addParameters(node) {
  let mode = 'Unknown';
  if (node.WorkMode === modes.AUTO && node.OverrideIsOpen) {
    mode = 'AUTO/MAN';
  } else if (node.WorkMode === modes.MAN) {
    mode = 'MAN';
  } else if (node.WorkMode === modes.AUTO) {
    mode = 'AUTO';
  } else if (node.WorkMode === modes.OFF) {
    mode = 'OFF';
  } else if (node.WorkMode === modes.ECO) {
    mode = 'ECO';
  }

  Object.assign(node, {
    mode,
    currentTemp: node.CurTemperature / 9,
    manTemp: node.ManTemprature / 9,
    ecoTemp: node.EcoTemprature / 9,
    offTemp: node.OffTemprature / 9,
    sptTemp: node.SptTemprature / 9,
  });
}


function gatewayAndNodes(authJson) {
  return new Promise((resolve, reject) => {
    gateway(authJson.url, authJson.token, authJson.authJson).then((gateways) => {
      const gatewayMap = {};
      const nodeMap = {};
      gateways.forEach((g) => {
        gatewayMap[g.Id] = { gateway: g, nodes: {} };
      });

      nodes(authJson.url, authJson.token, authJson.authJson).then((nds) => {
        const actuatorStatuses = [];
        nds.forEach((ns) => {
          actuatorStatuses.push(actuatorStatus(
            ns,
            authJson.url,
            authJson.token,
            authJson.authJson,
          ));
          addParameters(ns);
          const nodeList = gatewayMap[ns.GatewayId].nodes;
          nodeList[ns.Id] = ns;
          nodeMap[ns.Id] = ns;
        });
        Promise.all(actuatorStatuses).then((promises) => {
          promises.forEach((aStatus) => {
            const nodeStatus = nodeMap[aStatus.NodeID];
            nodeStatus.actuatorStatus = aStatus;
          });
          resolve(gatewayMap);
        });
      });
    })
      .catch(e => reject(e));
  });
}

function changeModeApi(authJson, mode, nodeId) {
  return new Promise((resolve, reject) => {
    getNode(nodeId, authJson.url, authJson.token, authJson.authJson).then((node) => {
      console.debug(`node = ${JSON.stringify(node)}`);
      changeMode(node, mode, authJson.url, authJson.token, authJson.authJson).then((res) => {
        resolve(res);
      })
        .catch(e => reject(e));
    }).catch(e => reject(e));
  });
}

function changeTempValue(authJson, tempType, tempValue, nodeId) {
  return new Promise((resolve, reject) => {
    getNode(nodeId, authJson.url, authJson.token, authJson.authJson).then((node) => {
      console.debug(`node = ${JSON.stringify(node)}`);
      setTemp(
        node,
        tempType,
        tempValue,
        authJson.url,
        authJson.token,
        authJson.authJson,
      ).then((res) => {
        resolve(res);
      })
        .catch(e => reject(e));
    }).catch(e => reject(e));
  });
}

function tmpAutoMan(authJson, tempValue, nodeId) {
  return new Promise((resolve, reject) => {
    getNode(nodeId, authJson.url, authJson.token, authJson.authJson).then((node) => {
      console.debug(`node = ${JSON.stringify(node)}`);
      const date = new moment().add(60, 'm').toDate(); // eslint-disable-line new-cap
      tmpOverride(
        node,
        tempValue,
        date.getHours(),
        date.getMinutes(),
        authJson.url,
        authJson.token,
        authJson.authJson,
      ).then((res) => {
        resolve(res);
      })
        .catch(e => reject(e));
    }).catch(e => reject(e));
  });
}

function tmpCancelAutoMan(authJson, nodeId) {
  return new Promise((resolve, reject) => {
    getNode(
      nodeId,
      authJson.url,
      authJson.token,
      authJson.authJson,
    ).then((node) => {
      console.debug(`node = ${JSON.stringify(node)}`);
      cancelTmpOverride(
        node,
        authJson.url,
        authJson.token,
        authJson.authJson,
      ).then((res) => {
        resolve(res);
      })
        .catch(e => reject(e));
    }).catch(e => reject(e));
  });
}

module.exports.gatewayAndNodes = gatewayAndNodes;
module.exports.changeModeApi = changeModeApi;
module.exports.changeTempValue = changeTempValue;
module.exports.tmpAutoMan = tmpAutoMan;
module.exports.tmpCancelAutoMan = tmpCancelAutoMan;
