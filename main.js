
const WEATHERAPI_KEY      = '7e6079e943144c088e9194933253007';
const WEATHERAPI_BASE_URL = 'https://api.weatherapi.com/v1';

const hourlyCardsContainer = document.querySelector('.hourly-cards-container');
const cityNameHeader = document.getElementById('city-name');

const DEFAULT_LOCATION = 'Bellevue, WA';


const airQuality = document.querySelector("#air-quality");
const humidity = document.querySelector("#humidity");
const uvIndex = document.querySelector("#uv-index");
const wind = document.querySelector("#wind");
const pressure = document.querySelector("#pressure");
const fact = document.querySelector("#fun-fact");

const weatherForm = document.querySelector('.form-inline');
const cityInput = document.querySelector('.formInput');
const card = document.querySelector('.card');
const apiKey = "e0bda7ed56631cf6f858df8289d218aa";

let city;
// Main input event
weatherForm.addEventListener('submit', async event => {

    event.preventDefault();

    city = cityInput.value;

    if (city) {
        try {
            // Reuhen's section
         // const weatherData = await getWeatherData(city);
         // displayWeatherInfo(weatherData);
          // Jimmy's section
          const city = cityInput.value.trim();
          if (city) loadWeatherData(city);
          // Helen's section
          showWeather(city);
        }
        catch (error) {
            console.error(error)
            displayError(error)
        }
    } 
    else {
        displayError("Please enter a city name.");
    }


});

async function getWeatherData(city) {
    const apiUrl = `http://api.weatherstack.com/current?access_key=${apiKey}&query=${city}`

    const response = await fetch(apiUrl);

    if (!response.ok) {
        throw new Error("Failed to fetch weather data");
    }
    return await response.json();


}
function displayWeatherInfo(data) {
    const { location: { name: city }, current: { temperature: temp, weather_descriptions, weather_code } } = data;

    card.textContent = '';
    card.style.display = 'flex';

    const cityDisplay = document.createElement('h1');
    const tempDisplay = document.createElement('p');
    const weatherEmoji = document.createElement('p');
    const descriptionDisplay = document.createElement('p');

    cityDisplay.textContent = city;
    tempDisplay.textContent = `${Math.round(temp * 9/5 + 32)}°F`;
    weatherEmoji.textContent = getWeatherEmoji(weather_code);
    descriptionDisplay.textContent = weather_descriptions[0];

    cityDisplay.id = 'cityDisplay';
    tempDisplay.classList.add('tempDisplay');
    weatherEmoji.classList.add('weatherEmoji');
    descriptionDisplay.classList.add('weatherDescription');

    card.appendChild(cityDisplay);
    card.appendChild(tempDisplay);
    card.appendChild(weatherEmoji);
    card.appendChild(descriptionDisplay);
}
function getWeatherEmoji(weatherCode) {
    if (weatherCode === 113) return "☀️";
    if (weatherCode === 116) return "⛅";
    if ([119, 122].includes(weatherCode)) return "☁️"; 
    if ([143, 248, 260].includes(weatherCode)) return "🌫️";
    if (weatherCode >= 176 && weatherCode <= 296) return "🌦️"; 
    if (weatherCode >= 179 && weatherCode <= 284) return "🌨️"; 
    if ([200, 386, 389].includes(weatherCode)) return "⛈️"; 
    if (weatherCode >= 299 && weatherCode <= 320) return "🌧️"; 
    if (weatherCode >= 323 && weatherCode <= 395) return "❄️"; 
    return "🌈";
}
function displayError(message) {
    const errorDisplay = document.createElement('p');
    errorDisplay.textContent = message;
    errorDisplay.id = 'errorDisplay';

    card.textContent = '';
    card.style.display = 'flex';
    card.appendChild(errorDisplay);
}


// Fun Fact API
const funFactApi = "https://api.api-ninjas.com/v1/facts?";
const  funFactApiKey = "2PEZcWfNMed2t9E75rD0KA==f0IhxzBGJslzMW7C";

// authenticate the API key
const params = {
    method: "GET",
    headers: {
        "X-Api-Key": funFactApiKey
    }
};

async function fetchFunFact() {
    try {
        const response = await fetch(funFactApi, params);
        console.log("Response from fun fact API:", response);
        return await response.json();
    } catch (error) {
        console.error("Error fetching fun fact:", error);
        fact.textContent = "Could not fetch fun fact. Please try again later.";
    }
}

// fetchFunFact();

async function showFunFact() {
    let facts = await fetchFunFact();
    if (facts && facts.length > 0) {
        fact.textContent = facts[0].fact;
    } else {
        fact.textContent = "No fun fact available at the moment.";
    }
}
showFunFact();

/*** Get Weather Data ***/


// Weather Api
const weatherApiKey = "e1116162e8bb4d738bc190848253107";
// let city = "Seattle";
const weatherApi = `https://api.weatherapi.com/v1/current.json?key=${weatherApiKey}&aqi=yes&q=`;

const params2 = {
    method: "GET",
    headers: {
        "X-Api-Key": weatherApiKey
    }
};

async function fetchWeather(city) {
    try {
        const response = await fetch(weatherApi + city, params2);
        console.log("Response from weather API:", response);
        const data = await response.json();
        console.log("Full weather data:", data);
        return data;
    } catch (error) {
        console.error("Error fetching weather data:", error);
        airQuality.textContent = "Could not fetch air quality data. Please try again later.";
        uvIndex.textContent = "Could not fetch UV data. Please try again later.";
        humidity.textContent = "Could not fetch humidity data. Please try again later.";
        wind.textContent = "Could not fetch wind data. Please try again later.";
        pressure.textContent = "Could not fetch pressure data. Please try again later.";
    }
}

async function showWeather(city) {
    let weatherData = await fetchWeather(city);

    if (weatherData && weatherData.current) {
        const epaIndex = weatherData.current.air_quality["us-epa-index"];
        airQuality.textContent = `${epaIndex} - ${epaStatus(epaIndex)}`;
        uvIndex.textContent = `${weatherData.current.uv}`;
        humidity.textContent = `${weatherData.current.humidity}%`;
        wind.textContent = `${weatherData.current.wind_mph} mph ${weatherData.current.wind_dir}`;
        pressure.textContent = `${weatherData.current.pressure_in} inHg`;
    } else {
        airQuality.textContent = "No air quality data available.";
        humidity.textContent = "No humidity data available.";
        uvIndex.textContent = "No UV index data available.";
        wind.textContent = "No wind data available.";
        pressure.textContent = "No pressure data available.";
    }
}


function epaStatus(epaIndex) {
    if (epaIndex === 1) {
        return "Good";
    } else if (epaIndex === 2) {
        return "Moderate";
    } else if (epaIndex === 3 || epaIndex === 4) {
        return "Unhealthy";
    } else if (epaIndex === 5) {
        return "Very Unhealthy";
    } else if (epaIndex === 6) {
        return "Hazardous";
    } else {
        return "Unknown";
    }
}
document.addEventListener('DOMContentLoaded', () => {
  // loadWeatherData(DEFAULT_LOCATION);
  setupScrollNavigation();
});

function setupScrollNavigation() {
  const container = hourlyCardsContainer;
  container.style.scrollBehavior = 'smooth';
  container.addEventListener('wheel', e => {
    e.preventDefault(); container.scrollLeft += e.deltaY;
  });
  document.addEventListener('keydown', e => {
    const amt = 200;
    if (e.key === 'ArrowLeft') {
      e.preventDefault(); container.scrollLeft -= amt;
    } else if (e.key === 'ArrowRight') {
      e.preventDefault(); container.scrollLeft += amt;
    }
  });
}

async function loadWeatherData(locationQuery) {
  try {
    const url = `${WEATHERAPI_BASE_URL}/forecast.json`
      + `?key=${WEATHERAPI_KEY}`
      + `&q=${encodeURIComponent(locationQuery)}`
      + `&days=1&aqi=no&alerts=no`;

    const res  = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();

    cityNameHeader.textContent =
      `${data.location.name}, ${data.location.country} — Hourly Forecast`;

    const hours = data.forecast.forecastday[0].hour;

    const nowEpoch           = data.current.last_updated_epoch;
    const currentHourEpoch   = Math.floor(nowEpoch / 3600) * 3600;

    const upcoming = hours
      .filter(h => h.time_epoch >= currentHourEpoch)

    const displayCount = Math.min(upcoming.length, 12);
    const nextHours = upcoming.slice(0, displayCount);

    updateHourlyForecast(nextHours);
  } catch (err) {
    console.error('Fetch failed:', err);
  }
}


function updateHourlyForecast(hourlyArray) {
  hourlyCardsContainer.innerHTML = '';
  hourlyArray.forEach(h => {
    const timePart = h.time.split(' ')[1]; 
    const hourNum  = parseInt(timePart.split(':')[0], 10);
    const timeLabel = formatHour(hourNum);
    const tempF     = Math.round(h.temp_f);
    const iconUrl   = h.condition.icon;

    const card = document.createElement('div');
    card.className = 'hourly-card';
    card.innerHTML = `
      <div class="time">${timeLabel}</div>
      <div class="weather-icon">
        <img src="https:${iconUrl}" alt="${h.condition.text}" />
      </div>
      <div class="temperature">${tempF}°</div>
    `;
    hourlyCardsContainer.appendChild(card);
  });
}

function formatHour(h) {
  if (h === 0)   return '12 AM';
  if (h === 12)  return '12 PM';
  if (h > 12)    return `${h - 12} PM`;
  return `${h} AM`;
}




