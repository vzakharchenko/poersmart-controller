export const temps = [];
export const hours = [];


export const minutes = [];

function fillTemperatures() {
  for (let i = 0; i < 320; i++) { // eslint-disable-line no-plusplus
    temps.push(i);
  }
}
function fillHours() {
  for (let i = 0; i < 23; i++) { // eslint-disable-line no-plusplus
    hours.push(i);
  }
}
function fillMinutes() {
  for (let i = 0; i < 59; i++) { // eslint-disable-line no-plusplus
    minutes.push(i);
  }
}
fillTemperatures();
fillHours();

fillMinutes();
