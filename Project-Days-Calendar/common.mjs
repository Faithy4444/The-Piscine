// This is a placeholder file which shows how you can define functions which can be used from both a browser script and a node script. You can delete the contents of the file once you have understood how it works.

// common.mjs

const monthNameToNumber = {
  January: 0, February: 1, March: 2, April: 3, May: 4, June: 5,
  July: 6, August: 7, September: 8, October: 9, November: 10, December: 11
};

const dayNameToNumber = {
  Sunday: 0, Monday: 1, Tuesday: 2, Wednesday: 3,
  Thursday: 4, Friday: 5, Saturday: 6
};


// Get the date of the nth occurrence of a weekday in a given month/year.
function getNthWeekdayOfMonth(year, month, weekday, occurrence) {
  let date;

  if (occurrence === "last") {
    // Start from last day of month, go backwards to find weekday
    const lastDay = new Date(Date.UTC(year, month + 1, 0));
    let day =  lastDay.getUTCDate();

    while (true) {
      date = new Date(Date.UTC(year, month, day));
     if (date.getUTCDay() === weekday) break;
      day--;
    }
    return date;
  }

  const occurrenceMap = {
    first: 1,
    second: 2,
    third: 3,
    fourth: 4
  };

  const n = occurrenceMap[occurrence.toLowerCase()];
  if (!n) throw new Error(`Invalid occurrence: ${occurrence}`);

  const firstDay =  new Date(Date.UTC(year, month, 1));
  const firstDayWeekday = firstDay.getUTCDay();


  // Calculate offset to first occurrence of weekday
  let day = 1 + ((7 + weekday - firstDayWeekday) % 7) + (7 * (n - 1));

  return new Date(Date.UTC(year, month, day));
}


 //Converts commemorative days data into actual Date objects for the given year.
 
export function resolveCommemorativeDates(daysData, year) {
  return daysData.map(event => {
    const month = monthNameToNumber[event.monthName];
    const weekday = dayNameToNumber[event.dayName];
    const occurrence = event.occurence;

    const date = getNthWeekdayOfMonth(year, month, weekday, occurrence);

    return {
      date,
      name: event.name,
      descriptionURL: event.descriptionURL
    };
  });
}



