let cityInput = document.getElementById('city_input');
let searchBtn = document.getElementById('searchBtn');
let api_key = '9987a65804421b965b0279dd5ae4233c';
function getWeatherDetails(name, lat, lon, country, state){
    FORECAST_API_URL = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${api_key}`;
    WEATHER_API_URL = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${api_key}`;
    days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
    months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

    fetch(WEATHER_API_URL)
        .then(response => response.json())
        .then(data => {
            console.log(data);
            // You can process the weather data here
        })
        .catch(() => {
            alert("Failed to fetch weather data");
        });
}
function getCityCoordinates(){
    let cityName = cityInput.value.trim();
    cityInput.value = '';
    if (!cityName) return;
    
    let GEOCODING_API_URL = `http://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=${api_key}`;
    
    fetch(GEOCODING_API_URL)
        .then(response => response.json())
        .then(data => {
            let {name,lat,lon,country,state}=data[0];
            getWeatherDetails(name,lat,lon,country,state);

        })
        .catch(() => {
            alert(`Failed to fetch coordinates for ${cityName}`);
        });
}

searchBtn.addEventListener('click', getCityCoordinates);
