

const weatherForm = document.querySelector('.form-inline');
const cityInput = document.querySelector('.formInput');
const card = document.querySelector('.card');
const apiKey = "e0bda7ed56631cf6f858df8289d218aa";

weatherForm.addEventListener('submit', async event => {

    event.preventDefault();

    const city = cityInput.value;

    if (city) {
        try {
            const weatherData = await getWeatherData(city);
            displayWeatherInfo(weatherData);
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