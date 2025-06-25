// This is a placeholder file to show how you can "mock" fetch requests using
// the nock library.
// You can delete the contents of the file once you have understood how it
// works.

/**export function makeFetchRequest() {
  return fetch("https://example.com/test");
}**/

const form = document.getElementById("user-form");
let userListInput = form["usernames"];
const submitBtn = form["button"];
let langSelectDropdown = document.getElementById("language-select");
const leaderboardTableBody = document.getElementById("leaderboard-body");
const langSelectContainer = document.getElementById("language-select-container");

let usersData = []; //array to store the data fetched

//fetching Data from Api

async function fetchUserData(username) {
  const url = `https://www.codewars.com/api/v1/users/${username}`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Error!: ${response.status} `);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`Error fetching user data:', ${error}`)
  }
}

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
  } catch (error) {
    console.error("Error fetching user data:", error);
    alert("Failed to fetch user data. Please check usernames and try again.");
  }
})


//Function to poplulate the LanguageDrop down

function populateLanguageDropDown(users) {
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
  

}
//console.log(fetchUserData('some_user'))