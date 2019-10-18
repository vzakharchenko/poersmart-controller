export function dbmToString(dbm) {
  if (dbm < -80) {
    return 'Unusable';
  } if (dbm < -70) {
    return 'Not Good';
  } if (dbm < -50) {
    return 'Okay';
  } if (dbm < -30) {
    return 'Very Good';
  }
  return 'Amazing';
}
