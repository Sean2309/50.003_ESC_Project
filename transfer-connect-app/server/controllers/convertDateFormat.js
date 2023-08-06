// Function for converting date format: e.g 15/2/2020 -> 2020/2/15
function convertDateFormat(date) {
  const dateArr = date.split('/');
  const year = dateArr[2];
  const month = dateArr[1];
  const day = dateArr[0];
  return `${year}-${month}-${day}`;
}
module.exports.convertDateFormat = convertDateFormat;
