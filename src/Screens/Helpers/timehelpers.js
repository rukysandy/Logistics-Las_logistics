
const MONTHS = {
    "1": "January",
    "2": "February",
    "3": "March",
    "4": "April",
    "5": "May",
    "6": "June",
    "7": "July",
    "8": "August",
    "9": "September",
    "10": "October",
    "11": "November",
    "12": "December",
};

const Days = {
    0: "Sun",
    1: "Mon",
    2: "Tue",
    3: "Wed",
    4: "Thur",
    5: "Fri",
    6: "Sat",
  };

  
 const dateMonthYearTimeFormat = (seconds, nanoseconds) => {
    const milliseconds =
        seconds * 1000 +
        nanoseconds / 1000000;
    const dateTime = new Date(milliseconds);
    const timeFormat =
        dateTime.getDate() +
        " " +
        MONTHS[dateTime.getMonth() + 1] +
        " " +
        dateTime.getFullYear();
    return timeFormat
}



function getFullDate(RST) {
    let rideDate = convertScheduledDate(RST);
    var RIDE_DATE = new Date(rideDate);
    var newDATE = RIDE_DATE.toLocaleDateString(undefined, {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
    return Days[RIDE_DATE.getDay()] + " " + newDATE;
  }

  const convertScheduledDate = (time) => {
    let a = time.split("/");
    return `${a[1]}/${a[0]}/${a[2]}`;
  };

  export {dateMonthYearTimeFormat, getFullDate, convertScheduledDate}