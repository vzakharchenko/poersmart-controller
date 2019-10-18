import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'mobx-react';
import poerSmartStore from './stores/PoerSmartStore';
import poerSmartGateWayStore from './stores/PoerSmartGateWayStore';
import tabsStore from './stores/TabsStore';
import languageStore from './stores/LanguageStore';
import App from './components/App';

const stores = {
  poerSmartStore,
  languageStore,
  tabsStore,
  poerSmartGateWayStore,
};

// For easier debugging
window._____APP_STATE_____ = stores; // eslint-disable-line no-underscore-dangle


const Index = () => (
  <Provider {...stores}>
    <App />
  </Provider>
);

ReactDOM.render(<Index />, document.getElementById('index'));
