import React from 'react';
import { inject, observer } from 'mobx-react';
import {
  Panel, Tab, TabContent, Tabs,
} from 'react-bootstrap';
import DayTab from './DayTab';

export default
@inject('languageStore', 'poerSmartStore', 'tabsStore', 'schedulerStore')
@observer
class PoersPTC10Scheduler extends React.Component {
  componentDidMount() {
    const {
      scheduler,
      nodeMac,
    } = this.props.node;
    this.props.schedulerStore.setScheduler(nodeMac, scheduler);
  }

  handleChange = (event) => {
    this.props.tabsStore.setTab(this.props.node.nodeMac, event);
  };

  render() {
    // eslint-disable-next-line prefer-destructuring
    const node = this.props.node;
    const { languageJS } = this.props.languageStore;
    const {
      scheduler,
      nodeMac,
      mode,
    } = this.props.node;
    if (mode === 'AUTO' || mode === 'AUTO/MAN') {
      return (
        <div>
          <Panel>
            <Panel.Heading>
              <div>
                <label>{languageJS.translate('Scheduler')}</label>
              </div>
            </Panel.Heading>
            <Panel.Body>
              <Tabs id="uncontrolled-tab-example" onSelect={this.handleChange}>
                <Tab eventKey={`tab_${nodeMac}_Sun`} title={languageJS.translate('Sun')}>
                  <TabContent>
                    <DayTab schedulerDay={scheduler[0]} index={0} node={node} />
                  </TabContent>
                </Tab>
                <Tab eventKey={`tab_${nodeMac}_Mon`} title={languageJS.translate('Mon')}>
                  <TabContent>
                    <DayTab schedulerDay={scheduler[1]} index={1} node={node} />
                  </TabContent>
                </Tab>
                <Tab eventKey={`tab_${nodeMac}_Tue`} title={languageJS.translate('Tue')}>
                  <TabContent>
                    <DayTab schedulerDay={scheduler[2]} index={2} node={node} />
                  </TabContent>
                </Tab>
                <Tab eventKey={`tab_${nodeMac}_Wed`} title={languageJS.translate('Wed')}>
                  <TabContent>
                    <DayTab schedulerDay={scheduler[3]} index={3} node={node} />
                  </TabContent>
                </Tab>
                <Tab eventKey={`tab_${nodeMac}_Thu`} title={languageJS.translate('Thu')}>
                  <TabContent>
                    <DayTab schedulerDay={scheduler[4]} index={4} node={node} />
                  </TabContent>
                </Tab>
                <Tab eventKey={`tab_${nodeMac}_Fri`} title={languageJS.translate('Fri')}>
                  <TabContent>
                    <DayTab schedulerDay={scheduler[5]} index={5} node={node} />
                  </TabContent>
                </Tab>
                <Tab eventKey={`tab_${nodeMac}_Sat`} title={languageJS.translate('Sat')}>
                  <TabContent>
                    <DayTab schedulerDay={scheduler[6]} index={6} node={node} />
                  </TabContent>
                </Tab>

              </Tabs>
            </Panel.Body>
          </Panel>
        </div>
      );
    }
    return null;
  }
}
