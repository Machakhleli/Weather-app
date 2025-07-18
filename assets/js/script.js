const API_KEY = "b7c3ceee1d6e0350759daab0898f4b00";
const searchForm = document.querySelector(".search-form");
const searchInput = document.getElementById("search-input");
const spinner = document.getElementById("spinner");

searchForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const city = searchInput.value.trim();
  if (!city) return;

  spinner.classList.remove("hidden");//for showing loading spinner

  try {
    const weatherData = await getWeatherData(city);
    console.log(weatherData);
  } catch (error) {
    console.error("Error fetching data:", error);
    alert("Could not find a city. Try another.");
  } finally {

    spinner.classList.add("hidden");//for hiding loading spinner
  }
  console.log("Searching for:", city);
});

async function getWeatherData(city) {
  const response = await fetch(`https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(city)}&limit=1&appid=${API_KEY}`);
  const data = await response.json();
  if (!data.length) {
    throw new Error("Location not found");
  }
  const { lat, lon, name, country } = data[0];
  const weatherResponse = await fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=minutely,hourly,alerts&units=metric&appid=${API_KEY}`);
  const weatherData = await weatherResponse.json();

  return {
    location: `${name}, ${country}`,
    current: weatherData.current,
    daily: weatherData.daily,
  };
}

