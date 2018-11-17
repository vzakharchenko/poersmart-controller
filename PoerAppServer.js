const express = require('express');
const base64 = require('base-64');
const url = require('url');
const { config } = require('./lib/env.js');
const { smartthingsInit } = require('./lib/smartthingsConnection.js');
const { newAuth, modeTemp } = require('./lib/poersApi.js');
const {
  gatewayAndNodes,
  changeModeApi,
  changeTempValue,
  tmpAutoMan,
  tmpCancelAutoMan,
} = require('./lib/poerNodes.js');


const server = express();
const port = config.server.port;
// const appId = config.smartapp.appId;
let authJson;

server.get('/health', (req, res) => {
  const status = { status: 'OK' };
  res.send(JSON.stringify(status));
});

server.get('/nodeMap', (req, res) => {
  res.writeHead(200, { 'Content-Type': 'application/json' });
  gatewayAndNodes(authJson).then((gatewayMap) => {
    res.end(JSON.stringify(gatewayMap));
  }).catch((err) => {
    res.end(JSON.stringify({ erroMessage: err }));
  });
});

server.get('/changeMode', (req, res) => {
  res.writeHead(200, { 'Content-Type': 'application/json' });
  console.log(`request: ${req.url}`);
  const q = url.parse(req.url, true).query;
  const mode = q.mode;
  const nodeId = q.nodeId;
  if (!mode) {
    res.end(JSON.stringify({
      status: 'Error',
      message: 'mode name is missing',
    }));
  } else if (!nodeId) {
    res.end(JSON.stringify({
      status: 'Error',
      message: 'Node Id is missing',
    }));
  } else {
    changeModeApi(authJson, mode, nodeId).then((response) => {
      res.end(JSON.stringify(response));
    }).catch((err) => {
      res.end(JSON.stringify({ errorMessage: err }));
    });
  }
});

server.get('/setTemp', (req, res) => {
  res.writeHead(200, { 'Content-Type': 'application/json' });
  console.log(`request: ${req.url}`);
  const q = url.parse(req.url, true).query;
  const tempValue = q.value;
  const nodeId = q.nodeId;
  if (!tempValue || isNaN(Number(tempValue))) {
    res.end(JSON.stringify({
      status: 'Error',
      message: 'Temperature value has incorrect value or missing',
    }));
  }
  const tempType = modeTemp[q.type];
  console.log(`tempType: ${tempType}`);
  const tempValueInt = Number(tempValue) * 9;
  if (q.type === 'AUTO' || q.type === 'AUTO/MAN') {
    tmpAutoMan(authJson, tempValueInt, nodeId).then((response) => {
      res.end(JSON.stringify(response));
    }).catch((err) => {
      res.end(JSON.stringify({ errorMessage: err }));
    });
  } else if (!tempType || ['ManTemprature', 'EcoTemprature', 'OffTemprature'].indexOf(tempType) < 0) {
    res.end(JSON.stringify({
      status: 'Error',
      message: 'Wrong type of temperature, please use one of [\'ManTemprature\',\'EcoTemprature\',\'OffTemprature\']',
    }));
  } else if (!nodeId) {
    res.end(JSON.stringify({
      status: 'Error',
      message: 'Node Id is missing',
    }));
  } else {
    changeTempValue(authJson, tempType, tempValueInt, nodeId).then((response) => {
      res.end(JSON.stringify(response));
    }).catch((err) => {
      res.end(JSON.stringify({ errorMessage: err }));
    });
  }
});

server.get('/overrideTemp', (req, res) => {
  res.writeHead(200, { 'Content-Type': 'application/json' });

  const q = url.parse(req.url, true).query;
  const tempValue = q.value;
  const nodeId = q.nodeId;
  if (!tempValue || isNaN(Number(tempValue))) {
    res.end(JSON.stringify({
      status: 'Error',
      message: 'Temperature value has incorrect value or missing',
    }));
  } else if (!nodeId) {
    res.end(JSON.stringify({
      status: 'Error',
      message: 'Node Id is missing',
    }));
  } else {
    const tempValueInt = Number(tempValue) * 9;
    tmpAutoMan(authJson, tempValueInt, nodeId).then((response) => {
      res.end(JSON.stringify(response));
    }).catch((err) => {
      res.end(JSON.stringify({ errorMessage: err }));
    });
  }
});

server.get('/overrideTempCancel', (req, res) => {
  res.writeHead(200, { 'Content-Type': 'application/json' });

  const q = url.parse(req.url, true).query;
  const nodeId = q.nodeId;
  if (!nodeId) {
    res.end(JSON.stringify({
      status: 'Error',
      message: 'Node Id is missing',
    }));
  } else {
    tmpCancelAutoMan(authJson, nodeId).then((response) => {
      res.end(JSON.stringify(response));
    }).catch((err) => {
      res.end(JSON.stringify({ errorMessage: err }));
    });
  }
});

server.get('/update', (req, res) => {
  res.writeHead(200, { 'Content-Type': 'application/json' });

  gatewayAndNodes(authJson).then(((nodes) => {
    smartthingsInit(nodes).then((resp) => {
      if (resp.status === 'ok') {
        res.end(JSON.stringify(resp));
      } else {
        res.end(JSON.stringify({ errorMessage: `Initialization error: ${JSON.stringify(resp)}` }));
      }
    }).catch((e) => {
      res.end(JSON.stringify({ errorMessage: `Initialization error: ${e}` }));
    });
  })).catch((e) => {
    res.end(JSON.stringify({ errorMessage: `PoersSmart initialized FAILED. ${e}` }));
  });
});

newAuth(
  config.poersmart.url,
  config.poersmart.loginPage,
  config.poersmart.email,
  config.poersmart.password,
  config.poersmart.AppKey,
  config.poersmart.TimezoneOffset,
).then((authResponse) => {
  console.info(`PoersSmart initialized successfully ${JSON.stringify(authResponse)}`);
  authJson = {
    authJson: authResponse,
    url: config.poersmart.url,
    token: `Basic ${base64.encode(`${config.poersmart.email}:${config.poersmart.password}`)}`,
  };

  gatewayAndNodes(authJson).then(((nodes) => {
    smartthingsInit(nodes).then((res) => {
      if (res.status === 'ok') {
        console.info(`PoersSmart initialized successfully authJson = ${JSON.stringify(authJson)} SmarttThings: ${JSON.stringify(res)}`);
        server.listen(port, () => {
          console.info(`HTTP PoersSmart SmartThings Manager listening on port ${port}`);
        });
      } else {
        console.error(`Initialization error: ${JSON.stringify(res)}`);
      }
    }).catch((e) => {
      console.error(`Initialization error: ${e}`);
      console.error('Please first install DTH`s then smartapp, Do not forget to enable OAuth in SmartApp IDE settings!');
      console.error('and after that edit ./config/config.js, and setup smartapp.appId and smartapp.accessToken');
      console.info(`Current appId=${config.smartapp.appId}`);
      console.info(`Current accessToken=${config.smartapp.accessToken}`);
    });
  })).catch((e) => {
    console.error(`PoersSmart initialized FAILED. ${e}`);
  });
}).catch((e) => {
  console.error(`PoersSmart initialized FAILED. ${e}`);
});
