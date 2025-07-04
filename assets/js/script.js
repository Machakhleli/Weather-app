const apiKey = "d61dc394c58141d3866192741250207";
const container = document.getElementById("container");

async function weatherData() {
    try {
        const resposnse = await fetch(`https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=Batumi&aqi=no`);
        const data = await resposnse.json();
        console.log(data);
    } catch (error) {
        console.error("Error fetching weather data:", error);
    }

}
weatherData();


