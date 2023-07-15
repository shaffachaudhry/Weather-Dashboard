//API SET UP 
var apiKey = 'fc88128cb6939ee5daf5d7b81f47e661';
var apiUrl = 'https://api.openweathermap.org/data/2.5';
//API forecast https://api.openweathermap.org/data/2.5/forecast?q={city name}&appid={API key}
//API Weather (curent) https://api.openweathermap.org/data/2.5/weather?q={city name}&appid={API key}

//setting variables 2/2 DOM
var InputForm = document.getElementById('weather-form');
var cityInput = document.getElementById('city-input');
var WeatherCard = document.getElementById('current-weather-card');
var forecastContainer = document.getElementById('forecast-container');
var searchHistoryList = document.getElementById('search-history');

// submit form via event listenr; using city for parameter instead of long/lat
InputForm.addEventListener('submit', function (event) {
  event.preventDefault();
  var city = cityInput.value;
  if (city) {
    getWeather(city);
    saveSearchHistory(city);
  }
});

// etablish search history items via event listener 
searchHistoryList.addEventListener('click', function (event) {
  if (event.target.tagName === 'LI') {
    var city = event.target.textContent;
    getWeather(city);
  }
});

//fetch current weather / use destructuring assignment to obtain values from object
function getCurrentWeather(city) {
  var currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
  fetch(currentWeatherUrl)
    .then(response => response.json())
    .then(data => {
      var { name, sys, main, weather, wind } = data;
      var country = sys.country;
      var temperature = main.temp;
      var humidity = main.humidity;
      var windSpeed = wind.speed;
      var weatherIcon = weather[0].icon;

      // add to current weather car 
      WeatherCard.innerHTML = `<h2>${name}, ${country}</h2>
        <p>Date: ${getCurrentDate()}</p>
        <p>Temperature: ${temperature}°C</p>
        <p>Humidity: ${humidity}%</p>
        <p>Wind Speed: ${windSpeed} m/s</p>
        <img src="http://openweathermap.org/img/w/${weatherIcon}.png" alt="Weather Icon" width = "100px" height = "100px" >`;
    })
}

// fetch forecast weather 
function getForecastWeather(city) {
  var forecastWeatherUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;
  fetch(forecastWeatherUrl)
    .then(response => response.json())
    .then(data => {
      var forecastList = data.list;
      forecastContainer.innerHTML = '';

      // forecast cards
      for (let i = 0; i < forecastList.length; i += 8) {
        var forecast = forecastList[i];
        var { dt, main, weather } = forecast;
        var date = new Date(dt * 1000);
        var temperature = main.temp;
        var humidity = main.humidity ;
        var weatherIcon = weather[0].icon;

        // make a forecast card
        var card = document.createElement('div');
        card.classList.add('forecast-card');
        card.innerHTML = `<h3>${getFormattedDate(date)}</h3>
          <img src="http://openweathermap.org/img/w/${weatherIcon}.png"alt="Weather Icon" >
          <p>Temperature: ${temperature}°C</p>
          <p>Humidity: ${humidity}%</p>`;
        forecastContainer.appendChild(card);
      }
    })
}

// fetch weather data
function getWeather(city) {
  getCurrentWeather(city);
  getForecastWeather(city);
}

// obtain  current date
function getCurrentDate() {
  var currentDate = new Date();
  return getFormattedDate(currentDate);
}

// date string 

function getFormattedDate(date) {
  var options = { year: 'numeric', month: 'long', day: 'numeric' };
  return date.toLocaleDateString(undefined, options);
}

// save search history
function saveSearchHistory(city) {
  let searchHistory = JSON.parse(localStorage.getItem('searchHistory')) || [];
  if (!searchHistory.includes(city)) {
    searchHistory.push(city);
  }
  localStorage.setItem('searchHistory', JSON.stringify(searchHistory));

  displaySearchHistory();
}
function displaySearchHistory() {
  searchHistoryList.innerHTML = '';
  var searchHistory = JSON.parse(localStorage.getItem('searchHistory')) || [];
    var listItem = document.createElement('li');
    listItem.textContent = city;
    searchHistory.appendChild(listItem);
  }
displaySearchHistory();
