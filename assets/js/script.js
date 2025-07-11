// const apiKey = "d61dc394c58141d3866192741250207";
// const container = document.getElementById("container");

// async function weatherData() {
//     try {
//         const resposnse = await fetch(`https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=Batumi&aqi=no`);
//         const data = await resposnse.json();
//         console.log(data);
//     } catch (error) {
//         console.error("Error fetching weather data:", error);
//     }

// }
// weatherData();

// const apiUrl =
//   "https://api.weatherapi.com/v1/current.json?key=d61dc394c58141d3866192741250207&q=Batumi&aqi=no";

// fetch(apiUrl)
//   .then((res) => res.json())
//   .then((data) => {
//     document.getElementById("city").textContent = data.location.name;
//     document.getElementById(
//       "time"
//     ).textContent = `Local time: ${data.location.localtime}`;
//     document.getElementById("icon").src =
//       "https:" + data.current.condition.icon;
//     document.getElementById("condition").textContent =
//       data.current.condition.text;
//     document.getElementById(
//       "temperature"
//     ).textContent = `Temperature: ${data.current.temp_c}°C`;
//   })
//   .catch((err) => {
//     console.error("Failed to fetch weather data:", err);
//   });
