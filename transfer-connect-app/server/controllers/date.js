function getFormattedDate(format = "standard") {
    const date = new Date();
    date.setDate(date.getDate()); // Subtract a day if requested
    let month = date.getMonth() + 1; // getMonth() is zero-indexed
    let day = date.getDate();
  
    month = month < 10 ? '0' + month : month;
    day = day < 10 ? '0' + day : day;
  
    if (format === "compact") {
      return `${date.getFullYear()}${month}${day}`;
    } else { // "standard" format
      return `${date.getFullYear()}-${month}-${day}`;
    }
  }

module.exports.getFormattedDate = getFormattedDate;