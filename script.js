var submitButton = $("#basic-addon2");
var currentWeatherEl = $(".current-container");
var apiKey = "9846b5a3775575d834176eed85a62f86";
var citiesArray = [];
var weatherDiv;
var uvDiv;
var fiveDayEl = $("#five-day-forecast");

//function to populate citiesArray from localStorage
for (var i = 0; i < localStorage.length; i++) {
    citiesArray.push(localStorage.getItem(i));
}
//function to create buttons from citiesArray
for (var i = 0; i < citiesArray.length; i++) {
    var cityDiv = $("<div>");
    cityDiv.addClass("city-div");
    cityDiv.data("city", citiesArray[i]);
    cityDiv.text(citiesArray[i]);
    $(".previous-searches").prepend(cityDiv);
}
//function that makes api calls for current forecast, 5-day forecast, and uv index
function getEverything(searchTerm){
    var currentWeatherURL = "https://api.openweathermap.org/data/2.5/weather?q=" + searchTerm + "&units=imperial&appid=" + apiKey;
    $.ajax({
        url: currentWeatherURL,
        method: "GET"
    }).then(function (response) {
        var cityName = response.name;
        var temperature = Math.floor(parseInt(response.main.temp));
        var humidity = response.main.humidity;
        var icon = response.weather[0].icon;
        var windSpeed = Math.floor(parseInt(response.wind.speed));
        var latitude = response.coord.lat;
        var longitude = response.coord.lon;
        var currentDate = moment().format("MMM Do YYYY");
        // //loop to check if city is in city array, push if not
        // if (citiesArray.indexOf(cityName) === -1){
        // citiesArray.push(cityName);
        // }
        citiesArray.push(cityName)

        weatherDiv = $("<div>");
        weatherDiv.addClass("weather-div")
        weatherDiv.html(`
        <h3>${cityName}</h3> 
        <h5>${currentDate}</h5>
    <img src = http://openweathermap.org/img/wn/${icon}@2x.png>
    <h5>${temperature} °F</h5>
    <br>
    Humidity: ${humidity} %
    <br>
    Wind Speed: ${windSpeed} MPH
    <br>`)
        currentWeatherEl.append(weatherDiv);

        //api call for uv index
        var uvURL = "https://api.openweathermap.org/data/2.5/uvi/forecast?appid=" + apiKey + "&lat=" + latitude + "&lon=" + longitude + "&cnt=1"
        $.ajax({
            url: uvURL,
            method: "GET"
        }).then(function (uvResponse) {
            var uv = Math.floor(parseInt(uvResponse[1].value));
            uvDiv = $("<div>").text(`UV Index: ${uv}`);
            uvDiv.addClass("uv-div");
            if(parseInt(uv) <= 2){
                uvDiv.attr("style", "background-color:green");
            }else if(parseInt(uv) > 2 && parseInt(uv) < 6){
                uvDiv.attr("style", "background-color:yellow");
            }else{
                uvDiv.attr("style", "background-color:red");
            }
            weatherDiv.append(uvDiv);
        })

        //sets cities-including the one just searched for- to local storage
        for (var i = 0; i < citiesArray.length; i++) {
            localStorage.setItem(i, citiesArray[i]);
        }

        // removes 5-day forecast
        fiveDayEl.empty();

        var fiveDayURL = "https://api.openweathermap.org/data/2.5/forecast?q=" + searchTerm + "&units=imperial&appid=" + apiKey + "&cnt=40";
        //call to get 5-day
        $.ajax({
            url: fiveDayURL,
            method: "GET"
        }).then(function (fiveDayResponse) {
            for (var i = 0; i < fiveDayResponse.list.length; i++) {
                if (fiveDayResponse.list[i].dt_txt.indexOf("15:00:00") !== -1) {
                    var fiveDayDate = fiveDayResponse.list[i].dt_txt;
                    var fiveDayIcon = fiveDayResponse.list[i].weather[0].icon;
                    var fiveDayWeather = Math.floor(parseInt(fiveDayResponse.list[i].main.temp));
                    var fiveDayHumidity = fiveDayResponse.list[i].main.humidity;
                    var fiveDayDiv = $("<div>");
                    var fiveDayFormatted = fiveDayDate.replace(" ", "-").split("-")[1] + "/" + fiveDayDate.replace(" ", "-").split("-")[2];
                    fiveDayDiv.addClass("five-day-div");
                    fiveDayDiv.html(`${fiveDayFormatted}
        <br>
        <img src = http://openweathermap.org/img/wn/${fiveDayIcon}@2x.png>
        <br>
        <h5>${fiveDayWeather} °F</h5>
        <br>
        Humidity: ${fiveDayHumidity} %`);
                    fiveDayEl.append(fiveDayDiv);
                }
            }
        })
    })
}
//listener to get current weather
submitButton.on("click", function () {
    event.preventDefault();
    //removes forecast that might already be up
    if (weatherDiv) {
        weatherDiv.remove();
    }
    var input = $(".form-control").val();
    getEverything(input);
})

//click listener to get forecast from previously searched div
$(".city-div").on("click", function () {
    //removes forecast that might already be up
    if (weatherDiv) {
        weatherDiv.remove();
    }
    var cityData = $(this).data("city");
    getEverything(cityData)
})

var lastSearch = localStorage[localStorage.length - 1];
if(localStorage){
getEverything(lastSearch);}