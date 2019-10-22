
const language = {
  Mac: 'Device Mac',
  HardVersion: 'Hardware Version',
  SoftwareVersion: 'Software Version',
  wifiLevel: 'WiFi Level',
  Update: 'Update',
  curTemp: 'Current Temperature',
  targetTemp: 'Target Temperature',
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
  Sun: 'Sun',
  Mon: 'Mon',
  Tue: 'Tue',
  Wed: 'Wed',
  Thu: 'Thu',
  Fri: 'Fri',
  Sat: 'Sat',
  Scheduler: 'Scheduler',
  Id: 'Id',
  Hour: 'Hour',
  Minute: 'Minute',
  Temperature: 'Temperature',
  saveScheduler: 'Save',
};

export function translate(test) {
  let languageElement = language[test];
  if (!languageElement) {
    language[test] = test;
    languageElement = test;
  }
  return languageElement;
}
