import React from 'react';
import { inject, observer } from 'mobx-react';
import { Tab, TabContent, Tabs } from 'react-bootstrap';
import InfoTab from './InfoTab';

export default
@inject('tabsStore', 'poerSmartGateWayStore')
@observer
class PoersSmartTabs extends React.Component {
  // handleChange = (event, value) => {
  //   this.props.tabsStore.setTab(value);
  // };
  //
  // selectInfo() {
  //   this.props.tabsStore.setTab('Info');
  // }

  render() {
    const { tabId } = this.props.tabsStore;
    const { gateways } = this.props.poerSmartGateWayStore;
    return gateways ? (
      <div>
        <Tabs defaultActiveKey={tabId || `tab_${gateways.get(0)}`} id="uncontrolled-tab-example">
          {gateways.map(mac => (
            <Tab eventKey={`tab_${mac}`} title={`PTG10 (${mac})`}>
              <TabContent>
                <InfoTab mac={mac} />
              </TabContent>
            </Tab>
          ))}

        </Tabs>
      </div>
    ) : null;
  }
}
