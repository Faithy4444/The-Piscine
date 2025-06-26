export async function fetchUserData(username) {
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