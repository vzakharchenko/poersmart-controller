import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'mobx-react';
import poerSmartStore from './stores/PoerSmartStore';
import poerSmartGateWayStore from './stores/PoerSmartGateWayStore';
import tabsStore from './stores/TabsStore';
import languageStore from './stores/LanguageStore';
import schedulerStore from './stores/SchedulerStore';
import App from './components/App';

const stores = {
  poerSmartStore,
  languageStore,
  tabsStore,
  poerSmartGateWayStore,
  schedulerStore,
};

// For easier debugging
window._____APP_STATE_____ = stores; // eslint-disable-line no-underscore-dangle


const Index = () => (
  <Provider {...stores}>
    <App />
  </Provider>
);

ReactDOM.render(<Index />, document.getElementById('index'));
