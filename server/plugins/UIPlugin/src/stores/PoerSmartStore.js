import { action, observable } from 'mobx';
import { fetchData } from '../utils/restCalls';

const serverUrl = process.env.SERVER_URL;


export class PoerSmartStore {
  @observable mac = '';

  @observable softVersion = '';

  @observable hardVersion = '';

  @observable wifiLevel = 0;

  @observable nodes = {};

  @observable error = undefined;

  @observable isLoading = false;

  @observable isLoaded = false;

  parseState(data) {
    const res = JSON.parse(data);
    this.mac = res.mac;
    this.softVersion = res.softVersion;
    this.hardVersion = res.hardVersion;
    this.wifiLevel = res.wifiLevel;
    this.nodes = res.nodes;
  }


  @action load(mac) {
    this.isLoading = true;
    fetchData(`${serverUrl}gateway/status?mac=${mac}`).then(action(({ data }) => {
      this.parseState(data);
    })).catch(action(({ data }) => {
      this.error = data;
    })).finally(action(() => {
      this.isLoading = false;
      this.isLoaded = true;
    }));
  }

  @action loadSilence(mac) {
    fetchData(`${serverUrl}gateway/status?mac=${mac}`).then(action(({ data }) => {
      this.parseState(data);
    })).catch(action(({ data }) => {
      this.error = data;
    })).finally(action(() => {
      this.isLoading = false;
      this.isLoaded = true;
    }));
  }

  @action changeMode(nodeMac, mode) {
    fetchData(`${serverUrl}action/mode/${mode.toLowerCase()}?node=${nodeMac}`).then(action(() => {
    })).catch(action(({ data }) => {
      this.error = data;
    })).finally(action(() => {
      this.isLoading = false;
      this.isLoaded = true;
    }));
  }


  @action changeTemp(nodeMac, type, temp) {
    fetchData(`${serverUrl}action/temperature/${type.toLowerCase()}?node=${nodeMac}&temp=${temp}`).then(action(() => {
    })).catch(action(({ data }) => {
      this.error = data;
    })).finally(action(() => {
      this.isLoading = false;
      this.isLoaded = true;
    }));
  }
}

export default new PoerSmartStore();
