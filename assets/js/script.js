const API_KEY = "b7c3ceee1d6e0350759daab0898f4b00";
const searchForm = document.querySelector(".search-form");
const searchInput = document.getElementById("search-input");
const spinner = document.getElementById("spinner");

searchForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const city = searchInput.ariaValueMax.trim();
  if (!city) return;

  spinner.classList.remove("hidden");

  try {
    const weatherData = await getWeatherData(city);
    console.log(weatherData);
  } catch (error) {
    console.error("Error fetching data:", error);
    alert("Could not find a city. Try another.");
  } finally {
    spinner.classList.add("hidden");
  }
});

 