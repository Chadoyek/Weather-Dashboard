// API key for OpenWeatherMap API
const APIKey = "5ad8a232885778b23684fdf130642996";

// DOM elements
var searchBtn = document.querySelector("#search-button");
var userInput = document.querySelector("#user-search-input");
var recentSearch = document.querySelector("#recent-search");

// Array to store recently searched cities
var cityArrList = JSON.parse(localStorage.getItem("cities")) || [];

// Default city if none in the array
var city = cityArrList[7] || "San Francisco";

// Event listener for search button click
searchBtn.addEventListener("click", () => {
    // Get user input and format it
    var cityInput = userInput.value.trim().toLowerCase();
    city = toTitleCase(cityInput);

    // Perform city search, retrieve weather data, and save search
    searchCity(city, APIKey);
    getCityGeo(city, APIKey);
    saveRecentSearch(city);
});

// Function to search for city weather
function searchCity(city, APIKey) {
    var queryURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=${APIKey}`;
    fetch(queryURL)
    .then(function(response) {
        return response.json();
    })
    .then(function(data) {
        // Extract relevant weather data
        var cityName = data.name;
        var currentTemp = Math.round(data.main.temp);
        var currentHumidity = data.main.humidity;
        var currentWindSpeed = data.wind.speed;
        var currentWeatherIcon = data.weather[0].icon;

        // Function to display current weather data
        function displayCurrentWeather() {
            $("#city-name-display").text(city);
            $("#temperature").text(currentTemp);
            $("#humidity").text(currentHumidity);
            $("#wind-speed").text(currentWindSpeed);
            var iconTemplate = `<img src="http://openweathermap.org/img/wn/${currentWeatherIcon}.png" alt="weather-icon" id="current-weather-icon">`;
            document.getElementById("weather-icon").innerHTML = iconTemplate;
        }

        displayCurrentWeather();
    });
}

// Function to get city's geographic coordinates
function getCityGeo(city, APIKey) {
    var cityGeoCodeURL = `https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${APIKey}`;
    fetch(cityGeoCodeURL)
    .then(function(response) {
        return response.json();
    })
    .then(function(data) {
        var lat = data[0].lat.toFixed(2);
        var lon = data[0].lon.toFixed(2);
        displayFiveDayForecast(lat, lon);
    });
}

// Function to display five-day forecast
function displayFiveDayForecast(lat, lon) {
    var FiveDayForecastURL = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=imperial&appid=${APIKey}`;
    fetch(FiveDayForecastURL)
    .then(function(response) {
        return response.json();
    })
    .then(function(data) {
        // Generate HTML for forecast and display it
        document.getElementById("forecast").innerHTML = "";
        var template = "";
        for (var i = 0; i < data.list.length; i += 8) {
            var date = data.list[i].dt_txt.substring(0, 10);
            var humidity = data.list[i].main.humidity;
            var windSpeed = data.list[i].wind.speed;
            var temp = Math.round(data.list[i].main.temp);
            template = `
                <ul class="forecast-five-day">
                <li><span class="fs-5 text">${date}</span></li>
                <img src="http://openweathermap.org/img/wn/${data.list[i].weather[0].icon}.png" alt="weather-icon" id="forecast-weather-icon">
                <li> Temp: <span class="fs-5 text">${temp}&#176F</span></li>
                <li> Wind: <span class="fs-5 text">${windSpeed}MPH</span></li>
                <li> Humidity: <span class="fs-5 text">${humidity}%</span></li>
                </ul>
                `;
            document.getElementById("forecast").innerHTML += template;
        }
    });
}

// Function to save recent searches
function saveRecentSearch(city) {
    var cityTitleCase = toTitleCase(city);

    if (city === "") {
        alert("Please enter a city name");
        return;
    }

    if (!cityArrList.includes(cityTitleCase)) {
        cityArrList.push(cityTitleCase);
        if (cityArrList.length > 8) {
            cityArrList.shift();
        }
        buildSearchButtons();
    }

    localStorage.setItem("cities", JSON.stringify(cityArrList));
}

// Function to convert city name to title case
function toTitleCase(city) {
    var cityArr = city.toLowerCase().split(" ");
    for (var i = 0; i < cityArr.length; i++) {
        cityArr[i] = cityArr[i].charAt(0).toUpperCase() + cityArr[i].slice(1);
    }
    return cityArr.join(" ");
}

// Function to build search buttons for recent searches
function buildSearchButtons() {
    recentSearch.innerHTML = "";
    for (var i = 0; i < cityArrList.length; i++) {
        var buttonEl = document.createElement("button");
        buttonEl.textContent = cityArrList[i];
        buttonEl.setAttribute("class", "searched-city-btn btn btn-secondary my-1");
        recentSearch.appendChild(buttonEl);
        buttonEl.addEventListener("click", function(e) {
            e.stopPropagation;
            var buttonText = e.target.textContent;
            searchCity(buttonText, APIKey);
            getCityGeo(buttonText, APIKey);
            saveRecentSearch(buttonText);
        });
    }
}

// Function to display current date and time
function displayTime() {
    $("#current-date").text(dayjs().format("MMM D, YYYY"));
}
setInterval(displayTime, 1000);

// Build search buttons and perform initial city search
buildSearchButtons();
searchCity(city, APIKey);
getCityGeo(city, APIKey);
