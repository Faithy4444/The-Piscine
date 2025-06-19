import { resolveCommemorativeDates } from "./common.mjs";
import assert from "node:assert";
import test from "node:test";

function formatDate(date) {
  return date.toISOString().split('T')[0];
} 

test("First Monday of January 2025", () => {
  const data = [{
    name: "Test Day 1",
    monthName: "January",
    dayName: "Monday",
    occurence: "first",
    descriptionURL: "https://example.com/1"
  }];
  const result = resolveCommemorativeDates(data, 2025);
  assert.strictEqual(formatDate(result[0].date), "2025-01-06");
});

test("Second Friday of March 2025", () => {
  const data = [{
    name: "Test Day 2",
    monthName: "March",
    dayName: "Friday",
    occurence: "second",
    descriptionURL: "https://example.com/2"
  }];
  const result = resolveCommemorativeDates(data, 2025);
  assert.strictEqual(formatDate(result[0].date), "2025-03-14");
});

test("Third Wednesday of July 2025", () => {
  const data = [{
    name: "Test Day 3",
    monthName: "July",
    dayName: "Wednesday",
    occurence: "third",
    descriptionURL: "https://example.com/3"
  }];
  const result = resolveCommemorativeDates(data, 2025);
  assert.strictEqual(formatDate(result[0].date), "2025-07-16"); // ✅ fixed
});

test("Last Sunday of May 2025", () => {
  const data = [{
    name: "Test Day 4",
    monthName: "May",
    dayName: "Sunday",
    occurence: "last",
    descriptionURL: "https://example.com/4"
  }];
  const result = resolveCommemorativeDates(data, 2025);
  assert.strictEqual(formatDate(result[0].date), "2025-05-25"); // ✅ fixed
});

test("Invalid occurrence throws error", () => {
  const data = [{
    name: "Invalid Day",
    monthName: "April",
    dayName: "Tuesday",
    occurence: "fifth",
    descriptionURL: "https://example.com/bad"
  }];
  assert.throws(() => resolveCommemorativeDates(data, 2025), {
    message: /Invalid occurrence/
  });
});

test("Multiple events resolve correctly", () => {
  const data = [
    {
      name: "First Thursday",
      monthName: "February",
      dayName: "Thursday",
      occurence: "first",
      descriptionURL: "https://example.com/5"
    },
    {
      name: "Last Saturday",
      monthName: "October",
      dayName: "Saturday",
      occurence: "last",
      descriptionURL: "https://example.com/6"
    }
  ];
  const result = resolveCommemorativeDates(data, 2025);
  assert.strictEqual(formatDate(result[0].date), "2025-02-06");
  assert.strictEqual(formatDate(result[1].date), "2025-10-25"); // ✅ fixed
});
