// This is a placeholder file to show how you can "mock" fetch requests using
// the nock library.
// You can delete the contents of the file once you have understood how it
// works.

/**export function makeFetchRequest() {
  return fetch("https://example.com/test");
}**/

const form = document.getElementById("user-form");
let userListInput = form["usernames"];
let langSelectDropdown = document.getElementById("language-select");
const leaderboardTableBody = document.getElementById("leaderboard-body");
const langSelectContainer = document.getElementById("language-select-container");
const unHideLeaderboardTable = document.getElementById("leaderboard-table")

let usersData = []; //array to store the data fetched

//fetching Data from Api

import { fetchUserData } from "./fetchUserData.mjs";

//Handling the form submit
form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const usernames = userListInput.value.split(",").map(u =>
    u.trim()) 
    .filter(Boolean);
  if (usernames.length === 0) {
    alert(`Please enter at least one username`);
    return;
  }

  try {
    usersData = await Promise.all(usernames.map(fetchUserData));
    console.log("Fetched usersData:", usersData);
    populateLanguageDropDown(usersData)
    leaderboardTable("overall")
  } catch (error) {
    console.error("Error fetching user data:", error);
    alert("Failed to fetch user data. Please check usernames and try again.");
  }
})


//Function to poplulate the LanguageDrop down

export function populateLanguageDropDown(users) {
  const languages = new Set();
  users.forEach(user => {
    if (user && user.ranks && user.ranks.languages) {
      
      Object.keys(user.ranks.languages).forEach(lang => {
        languages.add(lang); //looping through the languages
        
      });
    };
  });

      langSelectDropdown.innerHTML = ""; //clearing the drop down

      const overallOption = document.createElement("option");
      overallOption.value = "overall";
      overallOption.textContent = "overall";
      langSelectDropdown.appendChild(overallOption);

  Array.from(languages).sort().forEach((lang) => {
    const langOption = document.createElement("option");
    langOption.value = lang;
    langOption.textContent = lang;
    langSelectDropdown.appendChild(langOption)
  });

  langSelectContainer.hidden = false;
  
};
    

//Leaderboard table

function leaderboardTable(selectedLanguage) {
  leaderboardTableBody.innerHTML = "";

  //for when the user has no rank or if the user does not exist
  const filteredUsers = usersData.filter(user => {
    if (!user || !user.ranks) return false;

    if (selectedLanguage === "overall") {
      return user.ranks.overall && typeof user.ranks.overall.score === "number";
    } else {
      return user.ranks.languages && user.ranks.languages[selectedLanguage]
    }
  });

  //Sorting the not filtered usersData in descending order
   filteredUsers.sort((a, b) => {
    const scoreA = selectedLanguage === "overall" ? a.ranks.overall.score : a.ranks.languages[selectedLanguage].score;
    const scoreB = selectedLanguage === "overall" ? b.ranks.overall.score : b.ranks.languages[selectedLanguage].score;
    return scoreB - scoreA;
   });
  
  if (filteredUsers.length === 0) {
    const row = document.createElement("tr");
    const noDataCell = document.createElement("td");
    noDataCell.colSpan = 3;
    noDataCell.textContent = "No users have a ranking for this language.";
    row.appendChild(noDataCell);
    leaderboardTableBody.appendChild(row);
    return;

  }
   const topScore = selectedLanguage === "overall"
    ? filteredUsers[0].ranks.overall.score
    : filteredUsers[0].ranks.languages[selectedLanguage].score;
  
  //Making the table rows for each user
  filteredUsers.forEach(user => {
    const tr = document.createElement("tr");

      const usernameTd = document.createElement("td");
    usernameTd.textContent = user.username;

    const clanTd = document.createElement("td");
    clanTd.textContent = user.clan || "-";

    const scoreTd = document.createElement("td");
    const score = selectedLanguage === "overall"
      ? user.ranks.overall.score
      : user.ranks.languages[selectedLanguage].score;
    scoreTd.textContent = score;


    tr.append(usernameTd, clanTd, scoreTd);
    leaderboardTableBody.appendChild(tr);

  })
  unHideLeaderboardTable.hidden = false;
}

langSelectDropdown.addEventListener("change", () => {
  const selectedLang = langSelectDropdown.value;
  leaderboardTable(selectedLang);
});


//console.log(fetchUserData('some_user'))