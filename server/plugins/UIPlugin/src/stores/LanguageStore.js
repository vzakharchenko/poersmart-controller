import { observable, action } from 'mobx';

import {
  getLanguages, getLanguage, saveLanguage, getLanguageJS,
} from '../language/LanguageSelector';

export class LanguageStore {
  @observable language = '';

  @observable languageJS = {};

  @observable languages = [];

  @action.bound setLanguage(lang) {
    this.language = saveLanguage(lang);
    this.languageJS = getLanguageJS();
  }

  @action.bound getLang() {
    this.language = getLanguage();
    this.languageJS = getLanguageJS();
  }

  @action.bound getLangs() {
    this.languages = getLanguages();
  }
}

export default new LanguageStore();
