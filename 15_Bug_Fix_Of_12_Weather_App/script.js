const inputBox = document.querySelector(".input-box");
const searchBtn = document.getElementById("searchBtn");
const weather_img = document.querySelector(".weather-img");
const temperature = document.querySelector(".temperature");
const description = document.querySelector(".description");
const humidity = document.getElementById("humidity");
const wind_speed = document.getElementById("wind-speed");

const location_not_found = document.querySelector(".location-not-found");

const weather_body = document.querySelector(".weather-body");

async function checkWeather(city) {
  // Note: In production, API keys should be stored in environment variables or a backend server
  const api_key = "e7ad3e8736c71756ed4197177927a768";
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${api_key}`;

  // Validate input
  if (!city || city.trim() === "") {
    location_not_found.style.display = "flex";
    weather_body.style.display = "none";
    return;
  }

  try {
    const response = await fetch(url);
    const weather_data = await response.json();

    if (weather_data.cod === `404`) {
      location_not_found.style.display = "flex";
      weather_body.style.display = "none";
      return;
    }

    location_not_found.style.display = "none";
    weather_body.style.display = "flex";
    temperature.innerHTML = `${Math.round(weather_data.main.temp - 273.15)}°C`;
    description.innerHTML = `${weather_data.weather[0].description}`;

    humidity.innerHTML = `${weather_data.main.humidity}%`;
    wind_speed.innerHTML = `${weather_data.wind.speed}km/h`;

    switch (weather_data.weather[0].main) {
      case "Clouds":
        weather_img.src = "images/cloud.png";
        break;
      case "Clear":
        weather_img.src = "images/clear.png";
        break;
      case "Rain":
        weather_img.src = "images/rain.png";
        break;
      case "Mist":
        weather_img.src = "images/mist.png";
        break;
      case "Snow":
        weather_img.src = "images/snow.png";
        break;
    }
  } catch (error) {
    location_not_found.style.display = "flex";
    weather_body.style.display = "none";
  }
}

searchBtn.addEventListener("click", () => {
  checkWeather(inputBox.value);
});
