const { apiGateWayInit } = require('./smartthings.js');

function smartthingsInit(nodes) {
  return new Promise((resolve, reject) => {
    const initData = {
      initialization: new Date().getTime(),
      nodes,
    };
    apiGateWayInit(initData).then(res => resolve(JSON.parse(res))).catch(e => reject(e));
  });
}


module.exports.smartthingsInit = smartthingsInit;
