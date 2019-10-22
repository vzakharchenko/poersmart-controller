import React from 'react';
import { inject, observer } from 'mobx-react';
import {
  Button, Table,
} from 'react-bootstrap';
import { temps, hours, minutes } from './TempValues';
import { formatIntTwoChar } from '../utils/intUtils';


export default
@inject('poerSmartStore', 'tabsStore', 'languageStore', 'schedulerStore')
@observer
class DayTab extends React.Component {
  onChangeHour = (event) => {
    const mac = event.target.getAttribute('mac');
    const index = event.target.getAttribute('schedulerIndex');
    const dayOfWeek = event.target.getAttribute('dayOfWeek');
    const field = event.target.getAttribute('field');
    this.props.schedulerStore.updateDaySchedule(mac, dayOfWeek, index, field, event.target.value);
  };

  schedulerClickChange =(event) => {
    const nodeMac = event.target.getAttribute('mac');
    this.props.schedulerStore.save(nodeMac);
  }


  render() {
    const { languageJS } = this.props.languageStore;
    // eslint-disable-next-line prefer-destructuring
    const schedulerDay = this.props.schedulerDay;
    const dayOfWeek = this.props.index;
    const { nodeMac } = this.props.node;
    return (
      <div>
        <Table striped bordered condensed hover>
          <thead>
            <tr>
              <th style={{
                'text-align': 'center',
                'vertical-align': 'top',
              }}
              >
                {languageJS.translate('Id')}
              </th>
              <th style={{
                'text-align': 'center',
                'vertical-align': 'top',
              }}
              >
                {languageJS.translate('Hour')}
              </th>
              <th style={{
                'text-align': 'center',
                'vertical-align': 'top',
              }}
              >
                {languageJS.translate('Minute')}
              </th>
              <th style={{
                'text-align': 'center',
                'vertical-align': 'top',
              }}
              >
                {languageJS.translate('Temperature')}
              </th>
            </tr>
          </thead>
          <tbody>
            {schedulerDay.map((hourDay, index) => (
              <tr>
                <td style={{
                  'text-align': 'center',
                  'vertical-align': 'middle',
                }}
                >
                  {index}
                </td>
                <td style={{
                  'text-align': 'center',
                  'vertical-align': 'middle',
                }}
                >
                  <select
                    id={`minute_${dayOfWeek}_${index}`}
                    name={`minute_${dayOfWeek}_${index}`}
                    style={{ width: '60px' }}
                    mac={nodeMac}
                    schedulerIndex={index}
                    dayOfWeek={dayOfWeek}
                    field="hour"
                    onChange={this.onChangeHour}
                  >
                    {
                    hours.map(t => (
                      t === hourDay.hour
                        ? <option id={`minute_${dayOfWeek}_${index}${t}`} value={t} selected>{formatIntTwoChar(t)}</option>
                        : <option id={`minute_${dayOfWeek}_${index}${t}`} value={t}>{formatIntTwoChar(t)}</option>))
                  }
                  </select>
                </td>
                <td style={{
                  'text-align': 'center',
                  'vertical-align': 'middle',
                }}
                >
                  <select
                    id={`minute_${dayOfWeek}_${index}`}
                    name={`minute_${dayOfWeek}_${index}`}
                    mac={nodeMac}
                    schedulerIndex={index}
                    dayOfWeek={dayOfWeek}
                    field="minute"
                    onChange={this.onChangeHour}
                    style={{ width: '60px' }}
                  >
                    {
                    minutes.map(t => (
                      t === hourDay.minute
                        ? <option id={`minute_${dayOfWeek}_${index}${t}`} value={t} selected>{formatIntTwoChar(t)}</option>
                        : <option id={`minute_${dayOfWeek}_${index}${t}`} value={t}>{formatIntTwoChar(t)}</option>))
                  }
                  </select>
                </td>
                <td style={{
                  'text-align': 'center',
                  'vertical-align': 'middle',
                }}
                >
                  <select
                    id={`temp_${dayOfWeek}_${index}`}
                    name={`temp_${dayOfWeek}_${index}`}
                    style={{ width: '60px' }}
                    mac={nodeMac}
                    schedulerIndex={index}
                    dayOfWeek={dayOfWeek}
                    field="temp"
                    onChange={this.onChangeHour}
                  >
                    {
                    temps.map(t => (
                      t === hourDay.temp
                        ? <option id={`temp_${dayOfWeek}_${index}_${t}`} value={t} selected>{(t / 10).toFixed(1)}</option>
                        : <option id={`temp_${dayOfWeek}_${index}_${t}`} value={t}>{(t / 10).toFixed(1)}</option>))
                  }
                  </select>
                </td>
              </tr>
            ))}
            <tr>
              <td
                style={{
                  'text-align': 'center',
                  'vertical-align': 'middle',
                }}
                colSpan="4"
              >
                <Button
                  variant="primary"
                  mac={nodeMac}
                  onClick={this.schedulerClickChange}
                >
                  {languageJS.translate('saveScheduler')}
                </Button>
              </td>
            </tr>
          </tbody>
        </Table>
      </div>
    );
  }
}
