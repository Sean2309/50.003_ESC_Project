// Handback Controller File
// Datetime
function getDate(date) {
    const day = date.getDate(); // Get the day (1-31)
    const month = date.getMonth() + 1; // Get the month (0-11), add 1 to match the human-readable month (1-12)
    const year = date.getFullYear(); // Get the four-digit year
    const date_out = `${year}${month}${day}`;
    return date_out;
  }
  // Getting Current Date
  const currentDate = getDate(new Date()); // to change into testDate after final implementation
  