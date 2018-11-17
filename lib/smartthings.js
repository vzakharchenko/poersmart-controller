const { sendData } = require('./restCalls.js');
const { config } = require('./env.js');

const apiGateWay = () => `${config.smartapp.smartThingsUrl}/api/smartapps/installations/`;
const apiSmartInitUrl = () => '/PoerSmart/init?access_token=';


function apiPoerSmartInit(body) {
  return new Promise((resolve, reject) => {
    sendData(
      `${apiGateWay()}${config.smartapp.appId}${apiSmartInitUrl()}${config.smartapp.accessToken}`,
      'POST',
      JSON.stringify(body),
      {
        'Content-Type': 'application/json',
      },
    ).then((res) => {
      resolve(res);
    }).catch((res) => {
      reject(res);
    });
  });
}

module.exports.apiGateWayInit = apiPoerSmartInit;
