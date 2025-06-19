// This is a placeholder file which shows how you can access functions and data defined in other files.
// It can be loaded into index.html.
// Note that when running locally, in order to open a web page which uses modules, you must serve the directory over HTTP e.g. with https://www.npmjs.com/package/http-server
// You can't open the index.html file using a file:// URL.

import { resolveCommemorativeDates } from "./common.mjs";
import daysData from "./days.json" with { type: "json" };

document.addEventListener("DOMContentLoaded", () => {

  const prevBtn = document.getElementById("prev");
  const nextBtn = document.getElementById("next");
  const calendar = document.getElementById("calendar");
  const monthSelect = document.getElementById("month-select");
  const yearSelect = document.getElementById("year-select");

    //Populate month dropDown
    for (let i = 0; i < 12; i++) {
      const option = document.createElement("option");
      option.value = i;
      option.text = new Date(2000, i).toLocaleString("en-GB", { month: "long" });
      monthSelect.appendChild(option);
    }
    //Populate year dropDown from 1900-2100
    for (let y = 1900; y <= 2100; y++) {
      const option = document.createElement("option");
      option.value = y;
      option.text = y;
      yearSelect.appendChild(option);
    }

    let currentMonth = new Date().getMonth();
    let currentYear = new Date().getFullYear();
    monthSelect.value = currentMonth;
    yearSelect.value = currentYear;
  
    renderCalendar(currentMonth, currentYear);

    //eventListener for previous button
    prevBtn.addEventListener("click", () => {
      currentMonth--;
      if (currentMonth < 0) {
        currentMonth = 11;
        currentYear--;
      }
      updateDropdowns();
      renderCalendar(currentMonth, currentYear);
    });
  
    //eventlistener for next button
    nextBtn.addEventListener("click", () => {
      currentMonth++;
      if (currentMonth > 11) {
        currentMonth = 0;
        currentYear++;
      }
      updateDropdowns();
      renderCalendar(currentMonth, currentYear);
    });

    //eventListener for calender to change the date when month or year is changed
  monthSelect.addEventListener("change", () => {
    currentMonth = parseInt(monthSelect.value, 10);
    renderCalendar(currentMonth, currentYear);
  });
    yearSelect.addEventListener("change", () => {
      currentYear = parseInt(yearSelect.value, 10);
      renderCalendar(currentMonth, currentYear);
    });
  
    //renders the current month and years
    renderCalendar(currentMonth, currentYear);
  

  function updateDropdowns() {
    document.getElementById("month-select").value = currentMonth;
    document.getElementById("year-select").value = currentYear;
  }
});

  function renderCalendar(month, year) {
    calendar.innerHTML = "";

    const firstDay = new Date(year, month, 1);
    // JS: Sunday=0 ... Saturday=6
    // We want Monday=0 ... Sunday=6
    const startDay = (firstDay.getDay() + 6) % 7;

    //gets days in a month
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const monthName = new Date(year, month).toLocaleString("en-GB", { month: "long" });
    document.getElementById("current-month").textContent = `${monthName} ${year}`;

    // Gets dates for the year
    const commemorativeDates = resolveCommemorativeDates(daysData, year);

    //creates table
    const table = document.createElement("table");
    table.style.borderCollapse = "collapse";
    table.style.width = "100%";

    // Weekday headers (Monday first)
    const headerRow = document.createElement("tr");
    ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].forEach(day => {
      const th = document.createElement("th");
      th.textContent = day;
      th.style.border = "1px solid black";
      th.style.padding = "5px";
      th.style.backgroundColor = "#f0f0f0";
      headerRow.appendChild(th);
    });
    table.appendChild(headerRow);

    let date = 1 - startDay; // start with negative or zero for empty before first day

    for (let week = 0; week < 6; week++) {
      const row = document.createElement("tr");

      for (let i = 0; i < 7; i++) {
        const cell = document.createElement("td");
        cell.style.border = "1px solid black";
        cell.style.padding = "10px";
        cell.style.height = "80px";
        cell.style.verticalAlign = "top";

        if (date >= 1 && date <= daysInMonth) {
          cell.textContent = date;

          commemorativeDates.forEach(event => {
            if (
              event.date.getFullYear() === year &&
              event.date.getMonth() === month &&
              event.date.getDate() === date
            ) {
              const label = document.createElement("div");
              label.textContent = event.name;
              label.style.fontSize = "9px";
              label.style.color = "blue";
              label.style.marginTop = "5px";
              cell.appendChild(label);
            }
          });
        } else {
          // empty cell before 1st or after last day
          cell.textContent = "";
        }
 
        row.appendChild(cell);
        date++;
      }
 
      table.appendChild(row);

      // Stop creating rows once all days rendered
      if (date > daysInMonth) break;
    }

  
    calendar.appendChild(table);
  }

