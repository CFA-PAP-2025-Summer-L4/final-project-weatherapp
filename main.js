const airQuality = document.querySelector("#air-quality");
const humidity = document.querySelector("#humidity");
const uvIndex = document.querySelector("#uv-index");
const wind = document.querySelector("#wind");
const pressure = document.querySelector("#pressure");
const fact = document.querySelector("#fun-fact");



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
let city = "Seattle";
const weatherApi = `https://api.weatherapi.com/v1/current.json?key=${weatherApiKey}&q=${city}&aqi=yes`;

const params2 = {
    method: "GET",
    headers: {
        "X-Api-Key": weatherApiKey
    }
};

async function fetchWeather() {
    try {
        const response = await fetch(weatherApi, params2);
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

async function showWeather() {
    let weatherData = await fetchWeather();

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

showWeather();

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

