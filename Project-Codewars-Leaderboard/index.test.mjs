// This is a placeholder file which shows how you use the nock library to
// "mock" fetch requests, replacing real requests with fake ones that you
// control in the test. This means you can "force" the fetch request to return
// data in the format that you want.
// IMPORTANT: You _must_ run npm install within the Project-Codewars-Leaderboard
// folder for this to work.
// You can change or delete the contents of the file once you have understood
// how it works.

import test from "node:test";
import assert from "node:assert";
import nock from "nock";
import { fetchUserData } from "./fetchUserData.mjs";
nock.disableNetConnect();

//my tests

test("fetchUserData returns mocked user data", async () => {
 const mockUsername = "testuser";
  const mockUserResponse = {
    username: "testuser",
    clan: "TestClan",
    ranks: {
      overall: { score: 1500 },
      languages: {
        javascript: { score: 1600 },
        python: { score: 1400 },
      },
    },
  };


    const scope = nock("https://www.codewars.com")
    .get(`/api/v1/users/${mockUsername}`)
    .reply(200, mockUserResponse);

  // Calling the function under test
  const data = await fetchUserData(mockUsername);

  // Assert the returned data matches the mocked response
  assert.deepEqual(data, mockUserResponse, "Fetched user data does not match expected");

  // Verify that the mocked API endpoint was called
  assert(scope.isDone(), "Expected fetch call was not made");
});

   