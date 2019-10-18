const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { port } = require('./HTTPConfig');
const logger = require('./lib/Logger');
const { readCurrentStatus, gateWayList } = require('./lib/DeviceStatus');
const {
  setAction, activateAction,
  MODE_INTEGER,
  OVERRIDE_TEMPERATURE,
  OFF_TEMPERATURE,
  ECO_TEMPERATURE,
  DEVICE_TEMP_TYPE,
  DEVICE_CHANGE_TYPE,
  TEMP_HOUR,
  TEMP_MINUTE,
  SCHEDULE,
} = require('./lib/ActionDevice');
// const { modes } = require('../../lib/Utils');


const corsOptions = {
  origin(o, callback) {
    callback(null, true);
  },
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  preflightContinue: true,
  credentials: true,
  maxAge: 3600,
};

const server = express();


server.use(bodyParser.json());
server.use(cors(corsOptions));

server.get('/health', cors(corsOptions), (req, res) => {
  const status = { status: 'OK' };
  res.send(JSON.stringify(status));
});

server.get('/gateway/status', cors(corsOptions), (req, res) => {
  const mac = req.query.mac;
  if (!mac) {
    res.end(JSON.stringify({ status: 'FAIL', message: ' Gateway mac is empty' }));
  } else {
    const status = readCurrentStatus(mac);
    res.send(JSON.stringify(status));
  }
});

server.get('/gateway/list', cors(corsOptions), (req, res) => {
  const l = gateWayList();
  res.send(JSON.stringify(l));
});

server.get('/action/tempTemperature', cors(corsOptions), (req, res) => {
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

server.get('/action/mode/man', cors(corsOptions), (req, res) => {
  const temp = req.query.temp;
  const node = req.query.node;
  if (temp && (temp < 0 || temp > 320)) {
    res.end(JSON.stringify({ status: 'FAIL', message: ' Temperature is wrong' }));
  } else if (!node) {
    res.end(JSON.stringify({ status: 'FAIL', message: ' Node Id is empty' }));
  } else {
    if (temp) {
      setAction(node, OVERRIDE_TEMPERATURE, temp);
    }
    setAction(node, MODE_INTEGER, 1);
    activateAction(node, DEVICE_CHANGE_TYPE);
    res.send(JSON.stringify({ status: 'OK' }));
  }
});

server.get('/action/temperature/override', cors(corsOptions), (req, res) => {
  const temp = req.query.temp;
  const node = req.query.node;
  if (!temp || (temp < 0 || temp > 320)) {
    res.end(JSON.stringify({ status: 'FAIL', message: ' Temperature is wrong' }));
  } else if (!node) {
    res.end(JSON.stringify({ status: 'FAIL', message: ' Node Id is empty' }));
  } else {
    setAction(node, OVERRIDE_TEMPERATURE, temp);
    activateAction(node, DEVICE_CHANGE_TYPE);
    res.send(JSON.stringify({ status: 'OK' }));
  }
});

server.get('/action/temperature/off', cors(corsOptions), (req, res) => {
  const temp = req.query.temp;
  const node = req.query.node;
  if (!temp || (temp < 0 || temp > 320)) {
    res.end(JSON.stringify({ status: 'FAIL', message: ' Temperature is wrong' }));
  } else if (!node) {
    res.end(JSON.stringify({ status: 'FAIL', message: ' Node Id is empty' }));
  } else {
    setAction(node, OFF_TEMPERATURE, temp);
    activateAction(node, DEVICE_CHANGE_TYPE);
    res.send(JSON.stringify({ status: 'OK' }));
  }
});

server.get('/action/temperature/eco', cors(corsOptions), (req, res) => {
  const temp = req.query.temp;
  const node = req.query.node;
  if (!temp || (temp < 0 || temp > 320)) {
    res.end(JSON.stringify({ status: 'FAIL', message: ' Temperature is wrong' }));
  } else if (!node) {
    res.end(JSON.stringify({ status: 'FAIL', message: ' Node Id is empty' }));
  } else {
    setAction(node, ECO_TEMPERATURE, temp);
    activateAction(node, DEVICE_CHANGE_TYPE);
    res.send(JSON.stringify({ status: 'OK' }));
  }
});


server.get('/action/mode/off', cors(corsOptions), (req, res) => {
  const temp = req.query.temp;
  const node = req.query.node;
  if (temp && (temp < 0 || temp > 320)) {
    res.end(JSON.stringify({ status: 'FAIL', message: ' Temperature is wrong' }));
  } else if (!node) {
    res.end(JSON.stringify({ status: 'FAIL', message: ' Node Id is empty' }));
  } else {
    if (temp) {
      setAction(node, OFF_TEMPERATURE, temp);
    }
    setAction(node, MODE_INTEGER, 2);
    activateAction(node, DEVICE_CHANGE_TYPE);
    res.send(JSON.stringify({ status: 'OK' }));
  }
});

server.get('/action/mode/eco', cors(corsOptions), (req, res) => {
  const temp = req.query.temp;
  const node = req.query.node;
  if (temp && (temp < 0 || temp > 320)) {
    res.end(JSON.stringify({ status: 'FAIL', message: ' Temperature is wrong' }));
  } else if (!node) {
    res.end(JSON.stringify({ status: 'FAIL', message: ' Node Id is empty' }));
  } else {
    if (temp) {
      setAction(node, ECO_TEMPERATURE, temp);
    }
    setAction(node, MODE_INTEGER, 3);
    activateAction(node, DEVICE_CHANGE_TYPE);
    res.send(JSON.stringify({ status: 'OK' }));
  }
});

server.get('/action/mode/auto', cors(corsOptions), (req, res) => {
  const node = req.query.node;
  if (!node) {
    res.end(JSON.stringify({ status: 'FAIL', message: ' Node Id is empty' }));
  } else {
    setAction(node, MODE_INTEGER, 0);
    activateAction(node, DEVICE_CHANGE_TYPE);
    res.send(JSON.stringify({ status: 'OK' }));
  }
});

server.post('/action/schedule', cors(corsOptions), (req, res) => {
  const node = req.query.node;
  if (!node) {
    res.end(JSON.stringify({ status: 'FAIL', message: ' Node Id is empty' }));
  } else {
    const json = req.body;
    setAction(node, SCHEDULE, json);
    activateAction(node, DEVICE_CHANGE_TYPE);
    res.send(JSON.stringify({ status: 'OK' }));
  }
});

function start() {
  server.listen(port, () => {
    logger.info(`HTTP poer listening on port ${port}`);
  });
}

function stop() {
  server.stop();
}

module.exports.startHttp = start;
module.exports.stopHttp = stop;
module.exports.httpServer = server;
