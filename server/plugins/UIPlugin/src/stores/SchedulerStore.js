import { observable, action } from 'mobx';
import { sendData } from '../utils/restCalls';

const serverUrl = process.env.SERVER_URL;

export class SchedulerStore {
    @observable scheduler = {};

    @action setScheduler(nodeMac, scheduler) {
      this.scheduler[nodeMac] = scheduler;
    }

    @action updateDaySchedule(nodeMac, dayOfWeek, index, field, value) {
      const schedulerElement = this.scheduler[nodeMac];
      if (schedulerElement) {
        const dayOfWeekElem = schedulerElement[dayOfWeek];
        const indexElem = dayOfWeekElem[index];
        indexElem[field] = value;
      }
    }

  @action save(nodeMac) {
      const schedulerElement = this.scheduler[nodeMac];
      if (schedulerElement) {
        sendData(
          `${serverUrl}action/schedule?node=${nodeMac}`,
          'POST',
          JSON.stringify(schedulerElement),
          { 'Content-Type': 'application/json' },
        ).then(action(() => {
        })).catch(action(({ data }) => {
          this.error = data;
        }));
      }
    }
}

export default new SchedulerStore();
