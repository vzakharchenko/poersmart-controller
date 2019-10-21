
const language = {
  Mac: 'Device Mac',
  HardVersion: 'Hardware Version',
  SoftwareVersion: 'Software Version',
  wifiLevel: 'WiFi Level',
  Update: 'Update',
  curTemp: 'Current Temperature',
  humidity: 'Humidity',
  battery: 'Battery',
  actuatorStatus: 'Actuator Status',
  'mode/new Mode': 'current Mode/new Mode',
  overrideTemperature: 'Override Temperature',
  offTemperature: 'Off Temperature',
  ecoTemperature: 'Eco Temperature',
  TemporaryTemperature: 'Temporary Temperature',
  Holdtill: 'hold till',
  setTempMode: 'Set',
};

export function translate(test) {
  let languageElement = language[test];
  if (!languageElement) {
    language[test] = test;
    languageElement = test;
  }
  return languageElement;
}
