const apiKey = "d61dc394c58141d3866192741250207";

// DOM Elements
const searchForm = document.querySelector(".search-form");
const searchInput = document.getElementById("search-input");

const unitSwitch = document.getElementById("unit-switch");
let currentUnit = "metric"; // or 'imperial'

const spinner = document.getElementById("spinner");
const mainContainer = document.getElementById("main-container");

const cityNameEl = document.querySelector("#weather-main-info h1");
const cityDescEl = document.querySelector(".searched_location_weather_info h2");
const cityTimeEl = document.querySelector(
  ".searched_location_weather_info span"
);
const weatherIconEl = document.querySelector("#weather-main-info img");

const detailContainers = document.querySelectorAll(".current-weather-info");
const forecastTitleEl = document.querySelector(".long-term-weather-details h2");
const forecastContainer = document.querySelector(".week-days");

// Weather backgrounds
const backgrounds = {
  Clear: "url('./assets/media/backgrounds/clear.jpg')",
  Clouds: "url('./assets/media/backgrounds/clouds.jpg')",
  Rain: "url('./assets/media/backgrounds/rain.jpg')",
  Snow: "url('./assets/media/backgrounds/snow.jpg')",
  Thunderstorm: "url('./assets/media/backgrounds/thunderstorm.jpg')",
  Drizzle: "url('./assets/media/backgrounds/drizzle.jpg')",
  Mist: "url('./assets/media/backgrounds/mist.jpg')",
  Default: "url('./assets/media/backgrounds/default.jpg')",
};

// Event Listeners
searchForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const city = searchInput.value.trim();
  if (city) {
    localStorage.setItem("lastCity", city);
    getWeatherData(city);
  }
});

unitSwitch.addEventListener("change", () => {
  currentUnit = unitSwitch.checked ? "imperial" : "metric";
  const lastCity = localStorage.getItem("lastCity");
  if (lastCity) getWeatherData(lastCity);
});

window.addEventListener("DOMContentLoaded", () => {
  const lastCity = localStorage.getItem("lastCity");
  if (lastCity) getWeatherData(lastCity);
});

// Main Function
async function getWeatherData(city) {
  try {
    toggleSpinner(true);
    resetUI();

    const geoRes = await fetch(
      `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(
        city
      )}&limit=1&appid=${apiKey}`
    );
    const geoData = await geoRes.json();
    if (!geoData.length) {
      alert("City not found.");
      return;
    }

    const { lat, lon, name, country } = geoData[0];
    const weatherRes = await fetch(
      `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&units=${currentUnit}&exclude=minutely,hourly,alerts&appid=${apiKey}`
    );
    const weatherData = await weatherRes.json();

    displayCurrentWeather(name, country, weatherData.current);
    displayForecast(weatherData.daily);

    const mainWeather = weatherData.current.weather[0]?.main || "Default";
    setBackground(mainWeather);
  } catch (err) {
    alert("Something went wrong.");
    console.error(err);
  } finally {
    toggleSpinner(false);
  }
}

// Display Current Weather
function displayCurrentWeather(city, country, current) {
  const temp = Math.round(current.temp);
  const icon = current.weather[0]?.icon || "01d";
  const desc = current.weather[0]?.description || "Clear";
  const now = new Date();

  cityNameEl.textContent = `${temp}° ${city}, ${country}`;
  cityDescEl.textContent = desc.toUpperCase();
  cityTimeEl.textContent =
    now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) +
    " - " +
    now.toLocaleDateString("en-GB", {
      weekday: "short",
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

  weatherIconEl.src = `https://openweathermap.org/img/wn/${icon}@2x.png`;
  weatherIconEl.alt = desc;

  const [tempMax, tempMin, humidity, clouds, wind] = [
    Math.round(current.temp_max || current.temp),
    Math.round(current.temp_min || current.temp),
    current.humidity,
    current.clouds,
    current.wind_speed,
  ];

  if (detailContainers.length >= 5) {
    detailContainers[0].querySelector("span").textContent = `${tempMax}°`;
    detailContainers[1].querySelector("span").textContent = `${tempMin}°`;
    detailContainers[2].querySelector("span").textContent = `${humidity}%`;
    detailContainers[3].querySelector("span").textContent = `${clouds}%`;
    detailContainers[4].querySelector("span").textContent = `${wind}${
      currentUnit === "metric" ? "km/h" : "mph"
    }`;
  }
}

// Display Forecast
function displayForecast(daily) {
  forecastTitleEl.textContent = "Weather Forecast";
  forecastContainer.innerHTML = "";

  daily.slice(1, 8).forEach((day) => {
    const date = new Date(day.dt * 1000);
    const weekday = date.toLocaleDateString("en-GB", { weekday: "short" });
    const icon = day.weather[0]?.icon || "01d";
    const desc = day.weather[0]?.main || "Clear";
    const temp = Math.round(day.temp.day);

    const card = document.createElement("div");
    card.innerHTML = `
      <h3>${weekday}</h3>
      <span>${desc}</span>
      <img src="https://openweathermap.org/img/wn/${icon}@2x.png" alt="${desc}" />
    `;
    forecastContainer.appendChild(card);
  });
}

// Reset UI
function resetUI() {
  cityNameEl.textContent = "";
  cityDescEl.textContent = "";
  cityTimeEl.textContent = "";
  weatherIconEl.src = "";
  weatherIconEl.alt = "";
  forecastContainer.innerHTML = "";
  detailContainers.forEach((c) => {
    const span = c.querySelector("span");
    if (span) span.textContent = "";
  });
}

// Spinner toggle
function toggleSpinner(isVisible) {
  spinner.classList.toggle("hidden", !isVisible);
}

// Background setter
function setBackground(condition) {
  const bg = backgrounds[condition] || backgrounds["Default"];
  mainContainer.style.backgroundImage = bg;
  mainContainer.style.backgroundSize = "cover";
  mainContainer.style.backgroundPosition = "center";
}

// const apiKey = "d61dc394c58141d3866192741250207";
// const searchForm = document.querySelector(".search-form");
// const searchInput = document.getElementById("search-input");

// // DOM elements for current weather
// const cityName = document.querySelector("#weather-main-info h1");
// const cityTemp = document.querySelector("#weather-main-info h2");
// const cityTime = document.querySelector("#weather-main-info span");
// const weatherIcon = document.querySelector("#weather-main-info img");

// // DOM for weather details
// const detailContainers = document.querySelectorAll(".current-weather-info");

// // DOM for long-term forecast
// const forecastTitle = document.querySelector(".long-term-weather-details h2");
// const forecastContainer = document.querySelector(".week-days");

// // Listen to search
// searchForm.addEventListener("submit", (e) => {
//   e.preventDefault();
//   const city = searchInput.value.trim();
//   if (city) {
//     getWeatherData(city);
//   }
// });

// async function getWeatherData(city) {
//   try {
//     //  Get lat/lon from city
//     const geoRes = await fetch(
//       `https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${apiKey}`
//     );
//     const geoData = await geoRes.json();
//     if (!geoData.length) {
//       alert("City not found");
//       return;
//     }

//     const { lat, lon, name, country } = geoData[0];

//     //  Get weather using lat/lon
//     const weatherRes = await fetch(
//       `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&units=metric&exclude=minutely,hourly,alerts&appid=${apiKey}`
//     );
//     const weatherData = await weatherRes.json();

//     // Show current + forecast
//     displayCurrentWeather(name, country, weatherData.current);
//     displayForecast(weatherData.daily);
//   } catch (error) {
//     console.error("Weather fetch error:", error);
//   }
// }

// function displayCurrentWeather(city, country, current) {
//   const temp = Math.round(current.temp);
//   const icon = current.weather[0].icon;
//   const desc = current.weather[0].description;
//   const now = new Date();

//   cityName.textContent = `${temp}° ${city}`;
//   cityTemp.textContent = `${desc.toUpperCase()}`;
//   cityTime.textContent =
//     now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) +
//     " - " +
//     now.toLocaleDateString("en-GB", {
//       weekday: "short",
//       day: "2-digit",
//       month: "short",
//       year: "numeric",
//     });

//   weatherIcon.src = `https://openweathermap.org/img/wn/${icon}@2x.png`;
//   weatherIcon.alt = desc;

//   // Optional: Update weather detail cards here
//   const [tempMax, tempMin, humidity, clouds, wind] = [
//     Math.round(current.temp_max || current.temp), // fallback
//     Math.round(current.temp_min || current.temp),
//     current.humidity,
//     current.clouds,
//     current.wind_speed,
//   ];

//   detailContainers[0].querySelector("span").textContent = `${tempMax}°`;
//   detailContainers[1].querySelector("span").textContent = `${tempMin}°`;
//   detailContainers[2].querySelector("span").textContent = `${humidity}%`;
//   detailContainers[3].querySelector("span").textContent = `${clouds}%`;
//   detailContainers[4].querySelector("span").textContent = `${wind}km/h`;
// }

// function displayForecast(daily) {
//   forecastTitleEl.textContent = "7-Day Forecast";
//   forecastContainer.innerHTML = ""; // Clear previous results

//   // Slice first 7 days (excluding today if you prefer)
//   daily.slice(1, 8).forEach((day) => {
//     const date = new Date(day.dt * 1000);
//     const weekday = date.toLocaleDateString("en-GB", { weekday: "short" });
//     const icon = day.weather[0].icon;
//     const desc = day.weather[0].main;
//     const temp = Math.round(day.temp.day);

//     const card = document.createElement("div");
//     card.innerHTML = `
//       <h3>${weekday}</h3>
//       <span>${desc}</span>
//       <img src="https://openweathermap.org/img/wn/${icon}@2x.png" alt="${desc}" />
//     `;

//     forecastContainer.appendChild(card);
//   });
// }

// // const apiKey = "d61dc394c58141d3866192741250207";
// // const searchForm = document.querySelector(".search-form");
// // const searchInput = document.getElementById("search-input");

// // const temperature = document.querySelector("#weather-main-info h1");
// // const searchedCity = document.querySelector(".searched_location_weather_info h2");
// // const currentDate = document.querySelector(".searched_location_weather_info span");
// // const currentWeatherIcon = document.querySelector("weather-main-info img");

// // const currentWeatherDetails = document.querySelectorAll(".current-weather-info span");

// // searchForm.addEventListener("submit", (e) => {
// //     e.preventDefault();
// //     const city = searchInput.value.trim();
// //     if (city) fetchWeather(city);
// // });

// // async function weatherData(city) {
// //     try {
// //         const resposnse = await fetch(`https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${city}&aqi=no`);
// //         const data = await resposnse.json();
// //        updateMain(data);
// //         updateDetails(data);
// //     } catch (error) {
// //         console.error("Error fetching weather data:", error);
// //     }

// // }
// // weatherData();

// // const apiUrl =
// //   "https://api.weatherapi.com/v1/current.json?key=d61dc394c58141d3866192741250207&q=Batumi&aqi=no";

// // fetch(apiUrl)
// //   .then((res) => res.json())
// //   .then((data) => {
// //     document.getElementById("city").textContent = data.location.name;
// //     document.getElementById(
// //       "time"
// //     ).textContent = `Local time: ${data.location.localtime}`;
// //     document.getElementById("icon").src =
// //       "https:" + data.current.condition.icon;
// //     document.getElementById("condition").textContent =
// //       data.current.condition.text;
// //     document.getElementById(
// //       "temperature"
// //     ).textContent = `Temperature: ${data.current.temp_c}°C`;
// //   })
// //   .catch((err) => {
// //     console.error("Failed to fetch weather data:", err);
// //   });
