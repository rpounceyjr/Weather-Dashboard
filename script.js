var submitButton = $("#basic-addon2");

var currentWeatherEl = $(".current-container");

var apiKey  = "9846b5a3775575d834176eed85a62f86";

var citiesArray = [];


submitButton.on("click", function() {
    event.preventDefault();
    var input = $(".form-control").val();
    var queryURL = "https://api.openweathermap.org/data/2.5/weather?q="+ input + "&appid=" + apiKey;
    $.ajax({
        url : queryURL,
        method : "GET"
    }).then(function(response){
        console.log(response);
        var cityName = response.name;
        var temperature = response.main.temp;
        var windSpeed = response.wind.speed;
        
        citiesArray.push(cityName);
        
        var weatherDiv = $("<div>");
        weatherDiv.html(`<h3>${cityName}</h3> 
        <br>
        ${temperature}  
        <br>
        ${windSpeed}`)
        currentWeatherEl.append(weatherDiv);

        for(var i = 0; i < citiesArray.length; i++){
            localStorage.setItem(i, citiesArray[i]);
        }
    })
})