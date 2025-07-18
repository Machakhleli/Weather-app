const API_KEY = "b7c3ceee1d6e0350759daab0898f4b00";

const weatherIcons = {
  Clear: ""
}
const searchForm = document.querySelector(".search-form");
const searchInput = document.getElementById("search-input");
const spinner = document.getElementById("spinner");

searchForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const city = searchInput.value.trim();
  if (!city) return;

  spinner.classList.remove("hidden"); //for showing loading spinner

  try {
    const weatherData = await getWeatherData(city);
    getCurrentWeather(weatherData.current);
    getLongTermForecast(weatherData.forecast);
    console.log(weatherData);
  } catch (error) {
    console.error("Error fetching data:", error);
    alert("Could not find a city. Try another.");
  } finally {
    spinner.classList.add("hidden"); //for hiding loading spinner
  }
  console.log("Searching for:", city);
});

async function getWeatherData(city) {
  const currentRes = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(
      city
    )}&units=metric&appid=${API_KEY}`
  );
  if (!currentRes.ok) throw new Error("City not found");
  const currentData = await currentRes.json();

  const forecastRes = await fetch(
    `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(
      city
    )}&units=metric&appid=${API_KEY}`
  );
  if (!forecastRes.ok) throw new Error("Forecast fetch failed");
  const forecastData = await forecastRes.json();

  return {
    location: `${currentData.name}, ${currentData.sys.country}`,
    current: currentData,
    forecast: forecastData,
  };
}

function getCurrentWeather(current) {
  document.querySelector("#weather-main-info h1").textContent = `${Math.round(
    current.main.temp
  )}°C`;
  document.querySelector("#weather-main-info h2").textContent = current.name;
  document.querySelector("#weather-main-info span").textContent =
    current.weather[0].description;

  document.getElementById("temp-max").textContent = `${Math.round(
    current.main.temp_max
  )}°C`;
  document.getElementById("temp-min").textContent = `${Math.round(
    current.main.temp_min
  )}°C`;
  document.getElementById("humidity").textContent = `${current.main.humidity}%`;
  document.getElementById("cloudiness").textContent = `${current.clouds.all}%`;
  document.getElementById("wind").textContent = `${current.wind.speed} m/s`;
}

function getLongTermForecast(forecast) {
  const weekDaysContainer = document.querySelector(".week-days");
  weekDaysContainer.innerHTML = "";

  const dailyMap = {};

  forecast.list.forEach((item) => {
    const date = item.dt_txt.split(" ")[0];
    const hour = item.dt_txt.split(" ")[1];

    if (hour === "12:00:00") {
      dailyMap[date] = item;
    }
  });
  const dailyEntries = Object.entries(dailyMap);

  const maxDays = 7;
  dailyEntries.slice(0, maxDays).forEach(([date, data]) => {
    const dayName = new Date(date).toLocaleString("en-US", {
      weekday: "short",
    });

    const icon = ""; // here need to use local icons.
    const description = data.weather[0].description;
    const temp = Math.round(data.main.temp);

    const card = document.createElement("div");
    card.innerHTML = `<h3>${dayName}</h3>
    <img src="https://openweathermap.org/img/wn/${icon}@2x.png" alt="${description}"/>
    <p> ${temo}°C</p>
    <p>${description}</p> `;

    weekDaysContainer.appendChild(card);
  });
}
