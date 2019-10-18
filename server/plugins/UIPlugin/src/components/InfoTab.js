import React from 'react';
import { inject, observer } from 'mobx-react';
import { Table } from 'react-bootstrap';
import Loading from './Loading';
import PTC10 from './PTC10';
import { dbmToString } from '../utils/wifiDbmUtils';

export default
@inject('poerSmartStore', 'languageStore')
@observer
class InfoTab extends React.Component {
  componentDidMount() {
    const ptc10 = this.props.poerSmartStore;
    const { mac } = this.props;
    if (!ptc10.isLoading) {
      ptc10.load(mac);
    }
    setInterval(() => {
      ptc10.loadSilence(mac);
    }, 10000);
  }

  render() {
    const {
      mac,
      softVersion,
      hardVersion,
      wifiLevel,
      nodes,
      isLoading,
      isLoaded,
    } = this.props.poerSmartStore;
    const { languageJS } = this.props.languageStore;
    //  debugger;
    return (
      isLoading || !isLoaded ? <Loading />
        : (
          <Table striped bordered condensed hover>
            <thead>
              <tr>
                <th style={{
                  'text-align': 'center',
                  'vertical-align': 'middle',
                }}
                >
Poersmart PTG10
                </th>
                <th style={{
                  'text-align': 'center',
                  'vertical-align': 'middle',
                }}
                >
                  {languageJS.translate('Mac')}
                </th>
                <th style={{
                  'text-align': 'center',
                  'vertical-align': 'middle',
                }}
                >
                  {languageJS.translate('HardVersion')}
                </th>
                <th style={{
                  'text-align': 'center',
                  'vertical-align': 'middle',
                }}
                >
                  {languageJS.translate('SoftwareVersion')}
                </th>
                <th style={{
                  'text-align': 'center',
                  'vertical-align': 'middle',
                }}
                >
                  {languageJS.translate('wifiLevel')}
                </th>
              </tr>
            </thead>
            <tbody>
              <tr key={mac}>
                <td style={{
                  'text-align': 'center',
                  'vertical-align': 'middle',
                }}
                >
                  <img
                    src="/assets/PTG10.jpeg"
                    style={{
                      width: 100,
                      height: 100,
                      'text-align': 'center',
                      'vertical-align': 'middle',
                    }}
                    alt="undefined"
                  />
                </td>
                <td style={{
                  'text-align': 'center',
                  'vertical-align': 'middle',
                }}
                >
                  {mac}
                </td>
                <td style={{
                  'text-align': 'center',
                  'vertical-align': 'middle',
                }}
                >
                 v.
                  {' '}
                  {(hardVersion / 10).toFixed(1)}
                </td>
                <td style={{
                  'text-align': 'center',
                  'vertical-align': 'middle',
                }}
                >
                  v.
                  {' '}
                  {(softVersion / 10).toFixed(1)}
                </td>
                <td style={{
                  'text-align': 'center',
                  'vertical-align': 'middle',
                }}
                >
                  {dbmToString(wifiLevel)}
                </td>
              </tr>
              {nodes ? Object.keys(nodes).map(nodeMac => (
                <tr key={`nodes_${mac}`}>
                  <td colSpan="5">
                    <PTC10 node={nodes[nodeMac]} />
                  </td>
                </tr>
              )) : null}

            </tbody>
          </Table>
        )

    );
  }
}
