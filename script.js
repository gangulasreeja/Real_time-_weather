let cityInput = document.getElementById('city_input'),
searchBtn = document.getElementById('searchBtn'),
locationBtn=document.getElementById('location'),
api_key=${{secrets.api_key}},
currentWeatherCard=document.querySelectorAll('.weather-left .card')[0],
fiveDaysForecastCard=document.querySelectorAll('.day-forecast')[0],
aqiCard=document.querySelectorAll('.highlights .card')[0],
sunriseCard=document.querySelectorAll('.highlights .card')[1],
humidityVal = document.getElementById('humidityVal'),
pressureVal = document.getElementById('pressureVal'),
visibilityVal = document.getElementById('visibilityVal'),
windspeedVal = document.getElementById('windspeedVal'),
feelsVal = document.getElementById('feelsVal'),
hourlyForecastCard=document.querySelector('.hourly-forecast'),
aqiList=['Good','Fair','Moderate','Poor','Very Poor'];
function getWeatherDetails(name, lat, lon, country, state){
    FORECAST_API_URL = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${api_key}`;
    WEATHER_API_URL = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${api_key}`;
    AIR_POLLUTION_API_URL=`https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${api_key}`;
    days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
    months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

    fetch(AIR_POLLUTION_API_URL).then(res => res.json()).then(data => {
        let {co, no, no2, o3, so2, pm2_5, pm10, nh3} = data.list[0].components;
        aqiCard.innerHTML = `
            <div class="card-head">
                <p>Air Quality Index</p>
                <p class="air-index aqi-${data.list[0].main.aqi}">${aqiList[data.list[0].main.aqi - 1]}</p>
            </div>
            <div class="air-indices">
                <i class="fa-regular fa-wind fa-3x"></i>
                <div class="item">
                    <p>PM2.5</p>
                    <h2>${pm2_5}</h2>
                </div>
                <div class="item">
                    <p>PM10</p>
                    <h2>${pm10}</h2>
                </div>
                <div class="item">
                    <p>SO2</p>
                    <h2>${so2}</h2>
                </div>
                <div class="item">
                    <p>CO</p>
                    <h2>${co}</h2>
                </div>
                <div class="item">
                    <p>NO</p>
                    <h2>${no}</h2>
                </div>
                <div class="item">
                    <p>NO2</p>
                    <h2>${no2}</h2>
                </div>
                <div class="item">
                    <p>NH3</p>
                    <h2>${nh3}</h2>
                </div>
                <div class="item">
                    <p>O3</p>
                    <h2>${o3}</h2>
                </div>
            </div>`;
    }).catch(() => {
        alert('Failed to fetch Air Quality Index');
    });
    

    fetch(WEATHER_API_URL)
    .then(response => response.json())
    .then(data => {
        let date = new Date();
        currentWeatherCard.innerHTML = `
    <div class="current-weather">
      <div class="details">
        <p>Now</p>
        <h2>${(data.main.temp - 273.15).toFixed(2)}&deg;C</h2>
        <p>${data.weather[0].description}</p>    
      </div>
      <div class="weather-icon">
        <img src="https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png" alt="Weather Icon">
      </div>
    </div>
    <hr>
    <div class="card-footer">
      <p><i class="fa-light fa-calendar"></i>${days[date.getDay()]}, ${date.getDate()} ${months[date.getMonth()]}, ${date.getFullYear()}</p>
      <p><i class="fa-light fa-location-dot"></i>${name}, ${country}</p>
    </div>`;

        let {sunrise, sunset} = data.sys,
            {timezone, visibility} = data,
            {humidity, pressure, feels_like} = data.main,
            {speed} = data.wind,
            sRiseTime = moment.utc(sunrise, 'X').add(timezone, 'seconds').format('hh:mm A'),
            sSetTime = moment.utc(sunset, 'X').add(timezone, 'seconds').format('hh:mm A');

        sunriseCard.innerHTML = `
    <div class="card-head">
        <p>Sunrise & Sunset</p>
    </div>
    <div class="sunrise-sunset">
        <div class="item">
            <i class="fa-light fa-sunrise fa-4x"></i>
            <div>
                <p>Sunrise</p>
                <h2>${sRiseTime}</h2>
            </div>
        </div>
        <div class="item">
            <i class="fa-light fa-sunset fa-4x"></i>
            <div>
                <p>Sunset</p>
                <h2>${sSetTime}</h2>
            </div>
        </div>
    </div>`;
//vamshi again here
        humidityVal.innerHTML = `${humidity}%`;
        pressureVal.innerHTML = `${pressure} hPa`;
        visibilityVal.innerHTML = `${(visibility / 1000).toFixed(1)} km`;
        windspeedVal.innerHTML = `${speed} m/s`;
        feelsVal.innerHTML = `${(feels_like - 273.15).toFixed(2)}&deg;C`;
    })
    .catch(() => {
        alert("Failed to fetch weather data");
    });


    fetch(FORECAST_API_URL)
    .then(response => response.json())
    .then(data => {
        let hourlyForecast = data.list.slice(0, 8); // Limit to 8 entries for hourly forecast

        hourlyForecastCard.innerHTML = '';
        hourlyForecast.forEach(entry => {
            let hourlyForecastDate = new Date(entry.dt * 1000);
            let hr = hourlyForecastDate.getHours();
            let period = hr >= 12 ? 'PM' : 'AM';
            hr = hr % 12 || 12; // Convert hour to 12-hour format

            hourlyForecastCard.innerHTML += `
                <div class="card">
                    <p>${hr} ${period}</p>
                    <img src="https://openweathermap.org/img/wn/${entry.weather[0].icon}.png" alt="">
                    <p>${(entry.main.temp - 273.15).toFixed(2)}&deg;C</p>
                </div>`;
        });

        // Filter unique forecast days
        // vamhsi doing this
        let uniqueForecastDays = [];
        let fiveDaysForecast = data.list.filter((forecast, index) => {
            let forecastDate = new Date(forecast.dt_txt).getDate();
            if (!uniqueForecastDays.includes(forecastDate)) {
                uniqueForecastDays.push(forecastDate);
                return true;
            }
            return false;
        });

        fiveDaysForecastCard.innerHTML = '';
        fiveDaysForecast.forEach((forecast, index) => {
            if (index > 0) { // Skip the first entry since it's today's forecast
                let date = new Date(forecast.dt_txt);
                fiveDaysForecastCard.innerHTML += `
                    <div class="forecast-item">
                        <div class="icon-wrapper">
                            <img src="https://openweathermap.org/img/wn/${forecast.weather[0].icon}.png" alt="">
                            <span>${(forecast.main.temp - 273.15).toFixed(2)}&deg;C</span>
                        </div>
                        <p>${date.getDate()} ${months[date.getMonth()]}</p>
                        <p>${days[date.getDay()]}</p>
                    </div>`;
            }
        });
    })
    .catch(() => {
        alert("Failed to fetch forecast data");
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
function getUserCoordinates() {
    navigator.geolocation.getCurrentPosition(
        position => {
            let { latitude, longitude } = position.coords;
            let REVERSE_GEOCODING_URL = `https://api.openweathermap.org/geo/1.0/reverse?lat=${latitude}&lon=${longitude}&limit=1&appid=${api_key}`;
            
            fetch(REVERSE_GEOCODING_URL)
                .then(response => response.json())
                .then(data => {
                    let { name, country, state } = data[0];
                    getWeatherDetails(name, latitude, longitude, country, state);
                })
                .catch(() => {
                    alert('Failed to fetch reverse geocoding data');
                });
        },
        error => {
            if (error.code === error.PERMISSION_DENIED) {
                alert('Geolocation permission denied. Please reset location permission to grant access again');
            }
        }
    );
}


searchBtn.addEventListener('click', getCityCoordinates);
locationBtn.addEventListener('click',getUserCoordinates);
cityInput.addEventListener('keyup',e=>e.key =='Enter' && getCityCoordinates());
window.addEventListener('load',getUserCoordinates);
