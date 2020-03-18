var submitButton = $("#basic-addon2");
var currentWeatherEl = $(".current-container");
var apiKey = "9846b5a3775575d834176eed85a62f86";
var citiesArray = [];
var weatherDiv;
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

submitButton.on("click", function () {
    event.preventDefault();
    var input = $(".form-control").val();
    var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + input + "&appid=" + apiKey;
    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function (response) {
        console.log(response);
        var cityName = response.name;
        var temperature = response.main.temp;
        var windSpeed = response.wind.speed;
        //need loop to push cityName into citiesArray if it isn't already there

        citiesArray.push(cityName);

        weatherDiv = $("<div>");
        weatherDiv.html(`<h3>${cityName}</h3> 
        <br>
        ${temperature}  
        <br>
        ${windSpeed}`)
        currentWeatherEl.append(weatherDiv);

        //sets cities-including the one just searched for- to local storage
        for(var i = 0; i < citiesArray.length; i++){
            localStorage.setItem(i, citiesArray[i]);
        }
  
    })
})

//click listener to get forecast from previously searched div
$(".city-div").on("click", function(){

    console.log($(this).data("city"));
    if(weatherDiv){
    weatherDiv.remove();
    }
    // var input = $(".form-control").val();
    var cityData = $(this).data("city");
    var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + cityData + "&appid=" + apiKey;
    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function (response) {
        console.log(response);
        
        var cityName = response.name;
        var temperature = response.main.temp;
        var windSpeed = response.wind.speed;

        weatherDiv = $("<div>");
        weatherDiv.html(`<h3>${cityName}</h3> 
        <br>
        ${temperature}  
        <br>
        ${windSpeed}`)
        currentWeatherEl.append(weatherDiv);
    })

})
