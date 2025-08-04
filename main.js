const airQuality = document.querySelector("#air-quality");
const humidity = document.querySelector("#humidity");
const uvIndex = document.querySelector("#uv-index");
const wind = document.querySelector("#wind");
const pressure = document.querySelector("#pressure");
const fact = document.querySelector("#fun-fact");

const weatherForm = document.querySelector('.form-inline');
const cityInput = document.querySelector('.formInput');
const card = document.querySelector('.card');


// const apiKey = "e0bda7ed56631cf6f858df8289d218aa";
// const apiUrl = `http://api.weatherstack.com/current?access_key=${apiKey}&query=${city}`


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

let city;

weatherForm.addEventListener('submit', async event => {

    event.preventDefault();

    city = cityInput.value;

    if (city) {
        try {
            const weatherData = await getWeatherData(city);
            displayWeatherInfo(weatherData);
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
    const apiUrl = `https://api.weatherapi.com/v1/current.json?key=${weatherApiKey}&query=${city}`
    //const weatherApi = `https://api.weatherapi.com/v1/current.json?key=${weatherApiKey}&aqi=yes&q=`;

    const response = await fetch(apiUrl);

    if (!response.ok) {
        throw new Error("Failed to fetch weather data");
    }
    return await response.json();
}

function displayWeatherInfo(data) {
    // const { location: { name: city }, current: { temperature: temp, weather_descriptions, weather_code } } = data;
    const city = data.location.name;
    const temp = data.current.temp_f;
    const weather_descriptions = data.current.condition.text;
    const weather_code = data.current.condition.code;

    console.log("Weather Code:", weather_code);

    card.textContent = '';
    card.style.display = 'flex';

    const cityDisplay = document.createElement('h1');
    const tempDisplay = document.createElement('p');
    const weatherEmoji = document.createElement('p');
    const descriptionDisplay = document.createElement('p');

    cityDisplay.textContent = city;
    tempDisplay.textContent = `${temp}°F`;
    weatherEmoji.textContent = getWeatherEmoji(weather_code);
    descriptionDisplay.textContent = weather_descriptions;

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
    if (weatherCode === 1000) return "☀️";
    if (weatherCode === 1003) return "⛅";
    if ([1006, 1009].includes(weatherCode)) return "☁️"; 
    if ([1030, 1135, 1147].includes(weatherCode)) return "🌫️";
    if (weatherCode >= 1063 && weatherCode <= 1195) return "🌦️"; 
    if (weatherCode >= 1204 && weatherCode <= 1237) return "🌨️"; 
    if ([1087, 1273, 1276, 1279, 1282].includes(weatherCode)) return "⛈️"; 
    if (weatherCode >= 1240 && weatherCode <= 1264) return "🌧️"; 
    if (weatherCode >= 1279 && weatherCode <= 1282) return "❄️"; 
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



/*** Get Weather Data ***/

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

async function showFunFact() {
    let facts = await fetchFunFact();
    if (facts && facts.length > 0) {
        fact.textContent = facts[0].fact;
    } else {
        fact.textContent = "No fun fact available at the moment.";
    }
}
showFunFact();

