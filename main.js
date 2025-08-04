// my weatherapi API key
const apiKey = "30479ac799194889b47204401253107";
const baseUrl = "http://api.weatherapi.com/v1";
const forecast = "/forecast.json"
const locationInput = "Seattle";//to do query select from search bar
const finalUrl = baseUrl + forecast + "?key=" + apiKey + "&q=" + locationInput + "&days=5";

async function getForcast() {
    try {
        let forecast = await fetch(finalUrl);
        const data = await forecast.json();
        console.log(data);
        return data;
    } catch (error) {
        console.error(error);
    }
}
getForcast();


async function showForecast(){
    let data = await getForcast();
    const forcastRow = document.querySelector("#forecast-row");
    forcastRow.innerHTML = "";

    data.forecast.forecastday.forEach(days => {
        let date = days.date;
        console.log(date);
        let dateOb = new Date(date);
        let weekday = dateOb.toLocaleDateString("en-US", {weekday: "long", timeZone: "UTC"});
        
        let icon = days.day.condition.icon;
        let maxTemp = days.day.maxtemp_f;
        let minTemp = days.day.mintemp_f;

        forcastRow.innerHTML += 
            `<div class = "row">
                <div class = "col-6 text-center">
                    ${weekday} 
                </div>

                <div class = "col-3">
                </div>

                <div class = "col-3">
                    <img src= "${icon}"/> ${maxTemp}°F ${minTemp}°F     
                </div>
            </div>`;
    });
}
showForecast();