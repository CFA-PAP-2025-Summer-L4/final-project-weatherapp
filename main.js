const WEATHERAPI_KEY      = '7e6079e943144c088e9194933253007';
const WEATHERAPI_BASE_URL = 'https://api.weatherapi.com/v1';

const hourlyCardsContainer = document.querySelector('.hourly-cards-container');
const cityNameHeader = document.getElementById('city-name');
const cityInput = document.getElementById('city-input');
const searchBtn = document.getElementById('search-btn');

const DEFAULT_LOCATION = 'Bellevue, WA';

document.addEventListener('DOMContentLoaded', () => {
  loadWeatherData(DEFAULT_LOCATION);
  setupScrollNavigation();
  searchBtn.addEventListener('click', () => {
    const city = cityInput.value.trim();
    if (city) loadWeatherData(city);
  });
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