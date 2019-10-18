import cookie from 'cookie_js';

const language = {
  English: 'english.js',
  Russian: 'russian.js',
};


export function getLanguages() {
  return Object.keys(language);
}

export function getLanguage() {
  return cookie.get('language') ? cookie.get('language') : 'English';
}

export function getLanguageJS() {
  const lang = getLanguage();
  return require(`./${language[lang]}`); // eslint-disable-line global-require, import/no-dynamic-require
}

export function saveLanguage(lang) {
  if (language[lang]) {
    cookie.set('language', lang);
  }
  return getLanguage();
}
