export function formatIntTwoChar(number) {
  return number < 10 ? `0${number}` : number;
}
