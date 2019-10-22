import { observable, action } from 'mobx';

export class TabsStore {
    @observable tabId = null;

    @observable schedulerTab = {};

    @action setTab(tabId) {
      this.tabId = tabId;
    }

    @action setSchedulerTab(nodeMAc, tabId) {
      this.schedulerTab[nodeMAc] = tabId;
    }
}

export default new TabsStore();
