const express = require('express');
const bodyParser = require('body-parser');
const { port } = require('./HTTPConfig');
const { readCurrentStatus } = require('../../lib/DeviceStatus');
const {
  setAction, activateAction,
  MODE_INTEGER,
  OVERRIDE_TEMPERATURE,
  DEVICE_TEMP_TYPE,
  DEVICE_CHANGE_TYPE,
  TEMP_HOUR,
  TEMP_MINUTE
} = require('../../lib/ActionDevice');
// const { modes } = require('../../lib/Utils');


const server = express();


server.use(bodyParser.json());


server.get('/health', (req, res) => {
  const status = { status: 'OK' };
  res.send(JSON.stringify(status));
});

server.get('/status', (req, res) => {
  const status = readCurrentStatus();
  res.send(JSON.stringify(status));
});

server.get('/action/changeModeInt', (req, res) => {
  const newMode = req.query.mode;
  const node = req.query.node;
  if (!newMode) {
    res.end(JSON.stringify({ status: 'FAIL', message: ' Mode is empty' }));
  } else if (!node) {
    res.end(JSON.stringify({ status: 'FAIL', message: ' Node Id is empty' }));
  } else {
    setAction(node, MODE_INTEGER, newMode);
    activateAction(node, DEVICE_CHANGE_TYPE);
    res.send(JSON.stringify({ status: 'OK' }));
  }
});

server.get('/action/tempTemperature', (req, res) => {
  const temp = req.query.temp;
  const hour = req.query.hour;
  const minute = req.query.minute;
  const node = req.query.node;
  if (!temp || temp < 0 || temp > 321) {
    res.end(JSON.stringify({ status: 'FAIL', message: ' temp is wrong' }));
  } else if (!node) {
    res.end(JSON.stringify({ status: 'FAIL', message: ' Node Id is empty' }));
  } else if (hour > 24 && hour < 0) {
    res.end(JSON.stringify({ status: 'FAIL', message: ' Node Id is empty' }));
  } else if (minute > 60 && minute < 0) {
    res.end(JSON.stringify({ status: 'FAIL', message: ' Node Id is empty' }));
  } else {
    setAction(node, OVERRIDE_TEMPERATURE, temp);
    setAction(node, TEMP_HOUR, hour);
    setAction(node, TEMP_MINUTE, minute);
    activateAction(node, DEVICE_TEMP_TYPE);
    res.send(JSON.stringify({ status: 'OK' }));
  }
});

server.get('/action/changeOverrideTemperature', (req, res) => {
  const temp = req.query.temp;
  const node = req.query.node;
  if (!temp || temp < 0 || temp > 321) {
    res.end(JSON.stringify({ status: 'FAIL', message: ' Mode is empty' }));
  } else if (!node) {
    res.end(JSON.stringify({ status: 'FAIL', message: ' Node Id is empty' }));
  } else {
    setAction(node, OVERRIDE_TEMPERATURE, temp);
    activateAction(node, DEVICE_CHANGE_TYPE);
    res.send(JSON.stringify({ status: 'OK' }));
  }
});

function start() {
  server.listen(port, () => {
    console.info(`HTTP poer listening on port ${port}`);
  });
}

function stop() {
  server.stop();
}

module.exports.start = start;
module.exports.stop = stop;
module.exports.httpServer = server;