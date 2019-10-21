import React from 'react';
import { Button, Panel, Table } from 'react-bootstrap';
import { observer, inject } from 'mobx-react';
import temps from './TempValues';

export default @inject('poerSmartStore', 'languageStore')
@observer
class PTC10 extends React.Component {
  handleModeChange = (event) => {
    const mode = event.target.value;
    this.props.poerSmartStore.changeMode(event.target.getAttribute('mac'), mode);
  };

  overrideTemperatureChange = (event) => {
    const temp = event.target.value;
    this.props.poerSmartStore.changeTemp(event.target.getAttribute('mac'), 'override', temp);
  };

  offTemperatureChange = (event) => {
    const temp = event.target.value;
    this.props.poerSmartStore.changeTemp(event.target.getAttribute('mac'), 'off', temp);
  };


  ecoTemperatureChange = (event) => {
    const temp = event.target.value;
    this.props.poerSmartStore.changeTemp(event.target.getAttribute('mac'), 'off', temp);
  };

  tempModeClickChange = (event) => {
    const temp = window.document.getElementById('temporaryTemperature').value;
    const holdTime = window.document.getElementById('holdTime').value;
    const timeStrings = holdTime.split(':');
    this.props.poerSmartStore.changeTempTemp(event.target.getAttribute('mac'), temp, timeStrings[0], timeStrings[1]);
  };

  render() {
    const {
      nodeMac,
      draft,
      battery,
      humidity,
      curTemp,
      actuatorStatus,
      mode,
      overrideTemperature,
      offTemperature,
      ecoTemperature,
    } = this.props.node;
    const { languageJS } = this.props.languageStore;
    return (
      <Panel>
        <Panel.Body>
          <Table striped bordered condensed hover>
            <thead>
              <tr>
                <th colSpan="13">
Node PoersMart PTC10
                  {draft ? `(${languageJS.translate('Update')}...)` : ''}
                </th>
              </tr>
              <tr>
                <th style={{
                  'text-align': 'center',
                  'vertical-align': 'top',
                }}
                />
                <th style={{
                  'text-align': 'center',
                  'vertical-align': 'top',
                }}
                >
                  {languageJS.translate('Mac')}
                </th>
                <th style={{
                  'text-align': 'center',
                  'vertical-align': 'top',
                }}
                >
                  {languageJS.translate('curTemp')}
                </th>
                <th style={{
                  'text-align': 'center',
                  'vertical-align': 'top',
                }}
                >
                  {languageJS.translate('humidity')}
                </th>
                <th style={{
                  'text-align': 'center',
                  'vertical-align': 'top',
                }}
                >
                  {languageJS.translate('battery')}
                </th>
                <th style={{
                  'text-align': 'center',
                  'vertical-align': 'top',
                }}
                >
                  {languageJS.translate('actuatorStatus')}
                </th>
                <th style={{
                  'text-align': 'center',
                  'vertical-align': 'top',
                }}
                >
                  {languageJS.translate('mode/new Mode')}
                </th>
                <th style={{
                  'text-align': 'center',
                  'vertical-align': 'middle',
                }}
                >
                  {languageJS.translate('overrideTemperature')}
                </th>
                <th style={{
                  'text-align': 'center',
                  'vertical-align': 'middle',
                }}
                >
                  {languageJS.translate('offTemperature')}
                </th>
                <th style={{
                  'text-align': 'center',
                  'vertical-align': 'middle',
                }}
                >
                  {languageJS.translate('ecoTemperature')}
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={{
                  'text-align': 'center',
                  'vertical-align': 'middle',
                }}
                >
                  <img
                    src="/assets/PTC10.png"
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
                  {nodeMac}
                </td>
                <td style={{
                  'text-align': 'center',
                  'vertical-align': 'middle',
                }}
                >
                  {(curTemp / 10).toFixed(1)}
                  {' '}
          °C
                </td>
                <td style={{
                  'text-align': 'center',
                  'vertical-align': 'middle',
                }}
                >
                  {humidity}
%
                </td>
                <td style={{
                  'text-align': 'center',
                  'vertical-align': 'middle',
                }}
                >
                  {battery}
%
                </td>
                <td style={{
                  'text-align': 'center',
                  'vertical-align': 'middle',
                }}
                >
                  {actuatorStatus ? 'active' : 'inactive'}
                </td>
                <td style={{
                  'text-align': 'center',
                  'vertical-align': 'middle',
                }}
                >
                  {mode}
/
                  <select
                    id="mode"
                    name="mode"
                    mac={nodeMac}
                    onChange={this.handleModeChange}
                    style={{ width: '100px' }}
                  >
                    {mode === 'AUTO' ? <option id="mode_AUTO" value="auto" selected>AUTO</option>
                      : <option id="mode_AUTO" value="AUTO">AUTO</option>}
                    {mode === 'MAN' ? <option id="mode_MAN" value="man" selected>MAN</option>
                      : <option id="mode_MAN" value="MAN">MAN</option>}
                    {mode === 'ECO' ? <option id="mode_ECO" value="eco" selected>MAN</option>
                      : <option id="mode_ECO" value="ECO">ECO</option>}
                    {mode === 'OFF' ? <option id="mode_OFF" value="off" selected>MAN</option>
                      : <option id="mode_OFF" value="OFF">OFF</option>}
                    {mode === 'AUTO/MAN' ? <option id="mode_AUTOMAN" value="auto/man" selected>AUTO/MAN</option>
                      : null}
                  </select>
                </td>
                <td style={{
                  'text-align': 'center',
                  'vertical-align': 'middle',
                }}
                >
                  {(overrideTemperature / 10).toFixed(1)}
/
                  <select
                    id="overrideTemperature"
                    name="overrideTemperature"
                    mac={nodeMac}
                    onChange={this.overrideTemperatureChange}
                    style={{ width: '60px' }}
                  >
                    {
              temps.map(t => (
                t === overrideTemperature
                  ? <option id={`override_${t}`} value={t} selected>{(t / 10).toFixed(1)}</option>
                  : <option id={`override_${t}`} value={t}>{(t / 10).toFixed(1)}</option>))
            }
                  </select>
            °C
                </td>
                <td style={{
                  'text-align': 'center',
                  'vertical-align': 'middle',
                }}
                >
                  {(offTemperature / 10).toFixed(1)}
/
                  <select
                    id="offTemperature"
                    name="offTemperature"
                    mac={nodeMac}
                    onChange={this.offTemperatureChange}
                    style={{ width: '60px' }}
                  >
                    {
                temps.map(t => (
                  t === offTemperature
                    ? <option id={`override_${t}`} value={t} selected>{(t / 10).toFixed(1)}</option>
                    : <option id={`override_${t}`} value={t}>{(t / 10).toFixed(1)}</option>))
              }
                  </select>
            °C
                </td>
                <td style={{
                  'text-align': 'center',
                  'vertical-align': 'middle',
                }}
                >
                  {(ecoTemperature / 10).toFixed(1)}
/
                  <select
                    id="ecoTemperature"
                    name="ecoTemperature"
                    mac={nodeMac}
                    onChange={this.ecoTemperatureChange}
                    style={{ width: '60px' }}
                  >
                    {
                temps.map(t => (
                  t === ecoTemperature
                    ? <option id={`override_${t}`} value={t} selected>{(t / 10).toFixed(1)}</option>
                    : <option id={`override_${t}`} value={t}>{(t / 10).toFixed(1)}</option>))
              }
                  </select>
            °C
                </td>
              </tr>
              {mode === 'AUTO'
                ? (
                  <tr>
                    <td colSpan="13">
                      <div>
                        <label id="l1">
                          {languageJS.translate('TemporaryTemperature')}
:
                        </label>
                        <select
                          id="temporaryTemperature"
                          name="temporaryTemperature"
                          style={{ width: '60px' }}
                        >
                          {
                          temps.map(t => (
                            t === overrideTemperature
                              ? <option id={`override_${t}`} value={t} selected>{(t / 10).toFixed(1)}</option>
                              : <option id={`override_${t}`} value={t}>{(t / 10).toFixed(1)}</option>))
                        }
                        </select>
                      °C
                        {' '}
                        {languageJS.translate('Holdtill')}
                        <input type="time" name="holdTime" id="holdTime" value="23:59" />
                        <Button variant="primary" mac={nodeMac} onClick={this.tempModeClickChange}>{languageJS.translate('setTempMode')}</Button>
                      </div>
                    </td>
                  </tr>
                )
                : null
            }
            </tbody>
          </Table>
        </Panel.Body>
      </Panel>
    );
  }
}
