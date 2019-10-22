
const language = {
  Mac: 'Mac адрес устройства',
  HardVersion: 'Версия Hardware',
  SoftwareVersion: 'Версия Software',
  wifiLevel: 'Уровень WiFi',
  Update: 'Обновление',
  curTemp: 'Текущая температура',
  targetTemp: 'Ожидаемая температура',
  humidity: 'Влажность',
  battery: 'Батарея',
  actuatorStatus: 'Горелка',
  'mode/new Mode': 'Текущий Режим',
  overrideTemperature: 'Температура для MAN режима',
  offTemperature: 'Температура для Off режима',
  ecoTemperature: 'Температура для ECO режима',
  TemporaryTemperature: 'Установка временной температуры на время',
  Holdtill: ' держать до ',
  setTempMode: 'Установить',
  Sun: 'Воскресенье',
  Mon: 'Понедельник',
  Tue: 'Вторник',
  Wed: 'Среда',
  Thu: 'Четверг',
  Fri: 'Пятница',
  Sat: 'Суббота',
  Scheduler: 'Расписание',
  Id: 'Порядковый номер',
  Hour: 'Часы',
  Minute: 'Минуты',
  Temperature: 'Температура',
  saveScheduler: 'Сохранить расписание',
};

export function translate(test) {
  let languageElement = language[test];
  if (!languageElement) {
    language[test] = test;
    languageElement = test;
  }
  return languageElement;
}
