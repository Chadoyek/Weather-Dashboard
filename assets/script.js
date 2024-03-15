const APIKey = "5ad8a232885778b23684fdf130642996";
var searchBtn = document.querySelector("#search-button");
var userInput = document.querySelector("#user-search-input");
var recentSearch = document.querySelector("#recent-search");


searchBtn.addEventListener("click", () =>{

    var cityInput = userInput.value.trim().toLowerCase();
    city = toTitleCase(cityInput);

    searchCity(city, APIKey);
    getCityGeo(city, APIKey);




});

function searchCity(city, APIKey){
    var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=${APIKey}";
    fetch(queryURL)
    .then(function (response){
        return response.json();

    })
    .then(function (data){

        var cityName = data.name;
        var currentTemp = Math.round(data.main.temp);
        var currentHumidity = data.main.humidity;
        var currentWindSpeed = data.wind.speed;
        var currentWeatherIcon = data.weather[0].icon;




        function displayCurrentWeather(){
            $("city-name-display").text(city);
            $("#temperature").text(currentTemp);
            $("#humidity").text(currentHumidity);
            $("#wind-speed").text(currentWindSpeed);
            var iconTemplate = " ";
            document.getElementById("weather-icon").innerHTML= " ";
            iconTemplate = '<img src="http://openweathermap.org/img/wn/${currentWeatherIcon}.png" alt="weather-icon" id="current-weather-icon">';
            document.getElementById("weather-icon").innerHTML += iconTemplate;
        }

        displayCurrentWeather();






    })

}
