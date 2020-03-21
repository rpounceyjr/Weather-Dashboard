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
//listener to get current weather
submitButton.on("click", function () {
    event.preventDefault();
    //removes forecast that might already be up
    if (weatherDiv) {
        weatherDiv.remove();
    }
    var input = $(".form-control").val();
    var currentWeatherURL = "https://api.openweathermap.org/data/2.5/weather?q=" + input + "&units=imperial&appid=" + apiKey;
    function getEverything() {
        $.ajax({
            url: currentWeatherURL,
            method: "GET"
        }).then(function (response) {
            console.log(response);
            var cityName = response.name;
            var temperature = response.main.temp;
            var humidity = response.main.humidity;
            var icon = response.weather[0].icon;
            var windSpeed = response.wind.speed;
            var latitude = response.coord.lat;
            var longitude = response.coord.lon;
            //need loop to push cityName into citiesArray if it isn't already there

            citiesArray.push(cityName);

            weatherDiv = $("<div>");
            weatherDiv.addClass("weather-div")
            weatherDiv.html(`<h3>${cityName}</h3> 
        <img src = http://openweathermap.org/img/wn/${icon}@2x.png>
        <h5>${temperature} °F</h5>
        <br>
        Humidity: ${humidity} %
        <br>
        Wind Speed: ${windSpeed} MPH
        <br>`)
            currentWeatherEl.append(weatherDiv);

            //api call for uv index
            var uvURL = "http://api.openweathermap.org/data/2.5/uvi/forecast?appid=" + apiKey + "&lat=" + latitude + "&lon=" + longitude + "&cnt=1"
            $.ajax({
                url: uvURL,
                method: "GET"
            }).then(function (uvResponse) {
                var uv = uvResponse[1].value;
                uvDiv = $("<div>").text(`UV Index: ${uv}`);
                weatherDiv.append(uvDiv);
                if (parseInt(uv) <= 2) {
                    uvDiv.style.backgroundColor = "green";
                } else if (parseInt(uv) >= 3 && parseInt(uv) <= 5) {
                    uvDiv.style.backgroundColor = "yellow";
                } else {
                    uvDiv.style.backgroundColor = "red";
                }
                console.log(parseInt(uv));
            })

            //sets cities-including the one just searched for- to local storage
            for (var i = 0; i < citiesArray.length; i++) {
                localStorage.setItem(i, citiesArray[i]);
            }


            // removes 5-day forecast
            fiveDayEl.empty();

            var fiveDayURL = "https://api.openweathermap.org/data/2.5/forecast?q=" + input + "&units=imperial&appid=" + apiKey + "&cnt=40";
            //call to get 5-day
            $.ajax({
                url: fiveDayURL,
                method: "GET"
            }).then(function (fiveDayResponse) {
                console.log(fiveDayResponse);
                for (var i = 0; i < fiveDayResponse.list.length; i++) {
                    if (fiveDayResponse.list[i].dt_txt.indexOf("15:00:00") !== -1) {
                        var fiveDayDate = fiveDayResponse.list[i].dt_txt;
                        var fiveDayIcon = fiveDayResponse.list[i].weather[0].icon;
                        var fiveDayWeather = fiveDayResponse.list[i].main.temp;
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
                        console.log(fiveDayEl);
                        fiveDayEl.append(fiveDayDiv);
                    }

                }
            })
        })
    }
})

//click listener to get forecast from previously searched div
$(".city-div").on("click", function () {

    console.log($(this).data("city"));
    //removes forecast that might already be up
    if (weatherDiv) {
        weatherDiv.remove();
    }

    var cityData = $(this).data("city");
    var currentWeatherURL = "https://api.openweathermap.org/data/2.5/weather?q=" + cityData + "&units=imperial&appid=" + apiKey;
    $.ajax({
        url: currentWeatherURL,
        method: "GET"
    }).then(function (response) {
        console.log(response);

        var cityName = response.name;
        var temperature = response.main.temp;
        var humidity = response.main.humidity;
        var icon = response.weather[0].icon;
        var windSpeed = response.wind.speed;
        var latitude = response.coord.lat;
        var longitude = response.coord.lon;

        weatherDiv = $("<div>");
        weatherDiv.addClass("weather-div");
        weatherDiv.html(`<h3>${cityName}</h3> <img src = http://openweathermap.org/img/wn/${icon}@2x.png>
        <h5>${temperature} °F</h5>
        <br>
        Humidity: ${humidity} %
        <br>
        Wind Speed: ${windSpeed} MPH
        <br>`)
        currentWeatherEl.append(weatherDiv);

        //gets uv
        var uvURL = "http://api.openweathermap.org/data/2.5/uvi/forecast?appid=" + apiKey + "&lat=" + latitude + "&lon=" + longitude + "&cnt=1"
        $.ajax({
            url: uvURL,
            method: "GET"
        }).then(function (uvResponse) {
            var uv = uvResponse[1].value;
            uvDiv = $("<div>").text(`UV Index: ${uv}`);
            weatherDiv.append(uvDiv);
        })

        var fiveDayURL = "https://api.openweathermap.org/data/2.5/forecast?q=" + cityData + "&units=imperial&appid=" + apiKey + "&cnt=40";
        fiveDayEl.empty();
        //call to get 5-day
        $.ajax({
            url: fiveDayURL,
            method: "GET"
        }).then(function (fiveDayResponse) {
            console.log(fiveDayResponse);
            for (var i = 0; i < fiveDayResponse.list.length; i++) {
                if (fiveDayResponse.list[i].dt_txt.indexOf("15:00:00") !== -1) {
                    var fiveDayDate = fiveDayResponse.list[i].dt_txt;
                    var fiveDayIcon = fiveDayResponse.list[i].weather[0].icon;
                    var fiveDayWeather = fiveDayResponse.list[i].main.temp;
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
                    console.log(fiveDayEl);
                    fiveDayEl.append(fiveDayDiv);
                }

            }
        })
    })
})



