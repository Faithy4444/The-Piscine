// This is a placeholder file which shows how you can define functions which can be used from both a browser script and a node script. You can delete the contents of the file once you have understood how it works.

export function resolveCommemorativeDates(daysData, year) {
  return daysData.map(event => {
    return {
      date: new Date(year, event.month, event.day),
      name: event.name
    };
  });
}
