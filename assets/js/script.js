const apiKey = "d61dc394c58141d3866192741250207";
const searchForm = document.querySelector(".search-form");
const searchInput = document.getElementById("search-input");

const temperature = document.querySelector("#weather-main-info h1");
const searchedCity = document.querySelector(".searched_location_weather_info h2");
const currentDate = document.querySelector(".searched_location_weather_info span");
const currentWeatherIcon = document.querySelector("weather-main-info img");

const currentWeatherDetails = document.querySelectorAll(".current-weather-info span");

searchForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const city = searchInput.value.trim();
    if (city) fetchWeather(city);
});

async function weatherData(city) {
    try {
        const resposnse = await fetch(`https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${city}&aqi=no`);
        const data = await resposnse.json();
       updateMain(data);
        updateDetails(data);
    } catch (error) {
        console.error("Error fetching weather data:", error);
    }


}
weatherData();


