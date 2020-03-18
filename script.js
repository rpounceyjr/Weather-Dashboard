var submitButton = $("#basic-addon2");
var currentWeatherEl = $(".current-container");
var apiKey = "9846b5a3775575d834176eed85a62f86";
var citiesArray = [];
var weatherDiv;
var fiveDayDiv;
var uvDiv;
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
    if(weatherDiv){
        weatherDiv.remove();
        }
    var input = $(".form-control").val();
    var currentWeatherURL = "https://api.openweathermap.org/data/2.5/weather?q=" + input + "&units=imperial&appid=" + apiKey;
    
    $.ajax({
        url: currentWeatherURL,
        method: "GET"
    }).then(function (response) {
        console.log(response);
        var cityName = response.name;
        var temperature = response.main.temp;
        var humidity = response.main.humidity;
        var icon = response.weather.icon;
        var windSpeed = response.wind.speed;
        var latitude = response.coord.lat;
        var longitude = response.coord.lon;
        //need loop to push cityName into citiesArray if it isn't already there

        citiesArray.push(cityName);

        weatherDiv = $("<div>");
        weatherDiv.html(`<h3>${cityName}</h3> 
        Temperature: ${temperature} °F
        <br>
        Humidity: ${humidity} %
        <br>
        Wind Speed: ${windSpeed} MPH
        <br>`)
        currentWeatherEl.append(weatherDiv);

                //api call for uv index
        var uvURL = "http://api.openweathermap.org/data/2.5/uvi/forecast?appid="+ apiKey + "&lat="+latitude + "&lon="+ longitude + "&cnt=1"
        $.ajax({
            url: uvURL,
            method: "GET"
        }).then(function(uvResponse){
            var uv = uvResponse[1].value;
            uvDiv = $("<div>").text(uv);
            weatherDiv.append(uvDiv);
        })

        //sets cities-including the one just searched for- to local storage
        for(var i = 0; i < citiesArray.length; i++){
            localStorage.setItem(i, citiesArray[i]);
        }


        //five day forecast call
        fiveDayDiv = $(".five-day-forecast");
    
        // if(fiveDayDiv){
        //     fiveDayDiv.remove();
        // }
        // var fiveDayURL = "https://api.openweathermap.org/data/2.5/forecast?q=" + input + "&units=imperial&appid=" + apiKey;
        // //call to get 5-day
        // $.ajax({
        //     url: fiveDayURL,
        //     method: "GET"
        // }).then(function (fiveDayResponse) {
        //     console.log(fiveDayResponse);
        // })

  
    })
})


//click listener to get forecast from previously searched div
$(".city-div").on("click", function(){

    console.log($(this).data("city"));
    //removes forecast that might already be up
    if(weatherDiv){
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
        var icon = response.weather.icon;
        var windSpeed = response.wind.speed;
       
        weatherDiv = $("<div>");
        weatherDiv.html(`<h3>${cityName}</h3> 
        Temperature: ${temperature} °F
        <br>
        Humidity: ${humidity} %
        <br>
        Wind Speed: ${windSpeed} MPH
        <br>`)
        currentWeatherEl.append(weatherDiv);
    })

})
