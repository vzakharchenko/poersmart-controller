
const language = {
  Mac: 'Mac адрес устройства',
  HardVersion: 'Версия Hardware',
  SoftwareVersion: 'Версия Software',
  wifiLevel: 'Уровень WiFi',
  Update: 'Обновление',
  curTemp: 'Текущая температура',
  humidity: 'Влажность',
  battery: 'Батарея',
  actuatorStatus: 'Горелка',
  'mode/new Mode': 'Текущий Режим',
  overrideTemperature: 'Температура для MAN режима',
  offTemperature: 'Температура для Off режима',
  ecoTemperature: 'Температура для ECO режима',
};

export function translate(test) {
  let languageElement = language[test];
  if (!languageElement) {
    language[test] = test;
    languageElement = test;
  }
  return languageElement;
}
