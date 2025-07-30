const airQuality = document.querySelector("#air-quality");
const humidity = document.querySelector("#humidity");
const uvIndex = document.querySelector("#uv-index");
const wind = document.querySelector("#wind");
const fact = document.querySelector("#fun-fact");



// Fetch Fun Fact from the API
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

// Get user's location

// Open Meteo API URL for current weather data
const lat = 47.6062; // Latitude for Seattle
const lon = -122.3321; // Longitude for Seattle
const weatherApiUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,wind_speed_10m&hourly=temperature_2m,relative_humidity_2m,wind_speed_10m`;


// Fetch Weather Data
async function fetchWeather() {
    try {
        const response = await fetch(weatherApiUrl);
        console.log("Response from weather API:", response);
        return await response.json();
    } catch (error) {
        console.error("Error fetching weather data:", error);
        airQuality.textContent = "Could not fetch air quality data. Please try again later.";
    }
}
// fetchWeather();

async function showWeather() {
    let weatherData = await fetchWeather();

    if (weatherData && weatherData.current) {
        const humidityValue = weatherData.hourly.relative_humidity_2m[0]; // first hour
        const windSpeed = weatherData.current.wind_speed_10m;

        // airQuality.textContent = `Air Quality: ${humidityValue}`;
        humidity.textContent = `${humidityValue}%`;
        wind.textContent = `${windSpeed} km/h`;
    } else {
        // airQuality.textContent = "No air quality data available.";
        humidity.textContent = "No humidity data available.";
        uvIndex.textContent = "No UV index data available.";
        wind.textContent = "No wind data available.";
    }
}
showWeather();


// UV Index API
const openMeteoUrl = "https://api.open-meteo.com/v1/forecast?latitude=47.6062&longitude=-122.3321&current=uv_index";

async function fetchUV() {
    try {
        const response = await fetch(openMeteoUrl);
        console.log("Response from UV API:", response);

        const data = await response.json();
        console.log("Full UV data:", data);
        return data;
    } catch (error) {
        console.error("Error fetching weather data:", error);
        uvIndex.textContent = "Could not fetch air quality data. Please try again later.";
    }
}

// fetchUV();

async function showUV() {
    let uvData = await fetchUV();

    if (uvData && uvData.current) {
        uvIndex.textContent = `${uvData.current.uv_index}`;
    } else {
        uvIndex.textContent = "No UV index data available.";
    }

}
showUV();

// Fetch Air Quality Data
const airQualityApiUrl = "https://air-quality-api.open-meteo.com/v1/air-quality?latitude=47.6062&longitude=-122.3321&hourly=pm10,pm2_5,us_aqi";

async function fetchAir() {
    try {
        const response = await fetch(airQualityApiUrl);
        console.log("Response from air quality API:", response);
        const data = await response.json();
        console.log("Full Air Quality data:", data);
        return data;
    } catch (error) {
        console.error("Error fetching air quality data:", error);
        airQuality.textContent = "Could not fetch air quality data. Please try again later.";
    }
}

async function showAir() {
    const airData = await fetchAir();

    if (airData && airData.hourly && airData.hourly.us_aqi && airData.hourly.us_aqi.length > 0) {
        // Get the latest AQI value (assumes first entry is the most recent)
        const latestAQI = airData.hourly.us_aqi[0];
        airQuality.textContent = `${latestAQI}`;
    } else {
        airQuality.textContent = "No air quality data available.";
    }
}
showAir();