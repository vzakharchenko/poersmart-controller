import { action, observable } from 'mobx';
import { fetchData } from '../utils/restCalls';

const serverUrl = process.env.SERVER_URL;


export class PoerSmartGateWayStore {
  @observable gateways = [];

  @observable error = undefined;

  @observable isGateWaysLoading = false;

  @observable isGateWaysLoaded = false;

  parseState(data) {
    const res = JSON.parse(data);
    this.gateways = res;
    this.isGateWaysLoaded = true;
  }


  @action load() {
    this.isGateWaysLoading = true;
    fetchData(`${serverUrl}gateway/list`).then(action(({ data }) => {
      this.parseState(data);
    })).catch(action(({ data }) => {
      this.error = data;
    })).finally(action(() => {
      this.isGateWaysLoading = false;
    }));
  }
}

export default new PoerSmartGateWayStore();
