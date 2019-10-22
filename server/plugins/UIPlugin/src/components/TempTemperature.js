import React from 'react';
import { inject, observer } from 'mobx-react';
import { Button } from 'react-bootstrap';
import { temps } from './TempValues';
import { formatIntTwoChar } from '../utils/intUtils';

export default
@inject('languageStore', 'poerSmartStore')
@observer
class PoersPTC10Temp extends React.Component {
  tempModeClickChange = (event) => {
    const temp = window.document.getElementById('temporaryTemperature').value;
    const holdTime = window.document.getElementById('holdTime').value;
    const timeStrings = holdTime.split(':');
    this.props.poerSmartStore.changeTempTemp(event.target.getAttribute('mac'), temp, timeStrings[0], timeStrings[1]);
  };

  render() {
    const { languageJS } = this.props.languageStore;
    const {
      SptTemprature,
      tempHour,
      tempMinute,
      nodeMac,
      mode,
    } = this.props.node;
    if (mode === 'AUTO') {
      return (
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
                  t === SptTemprature
                    ? <option id={`override_${t}`} value={t} selected>{(t / 10).toFixed(1)}</option>
                    : <option id={`override_${t}`} value={t}>{(t / 10).toFixed(1)}</option>))
              }
          </select>
            °C
          {' '}
          {languageJS.translate('Holdtill')}
          <input type="time" name="holdTime" id="holdTime" defaultValue={`${formatIntTwoChar(tempHour)}:${formatIntTwoChar(tempMinute)}`} />
          <Button
            variant="primary"
            mac={nodeMac}
            onClick={this.tempModeClickChange}
          >
            {languageJS.translate('setTempMode')}
          </Button>
        </div>
      );
    } if (mode === 'AUTO/MAN') {
      return (
        <div>
          <label id="l1">
            {languageJS.translate('TemporaryTemperature')}
            :
            {(SptTemprature / 10).toFixed(1)}
            °C
            {` ${languageJS.translate('Holdtill')} `}
            {formatIntTwoChar(tempHour)}
:
            {formatIntTwoChar(tempMinute)}
          </label>
        </div>
      );
    }
    return null;
  }
}
