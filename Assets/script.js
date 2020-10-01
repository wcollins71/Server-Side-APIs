$(document).ready(function () {
    console.clear();
    $("#mainPanel").hide();
    $("#cityTextSearch").focus().select();
});


function weatherSearch(city) {
    var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&units=metric&appid=fa83f868b44583cfef9d1a24e9512db4";
    $.ajax({
        url: queryURL,
        method: "GET",
        statusCode: {
            404: function () {
                alert("City not found");
            }
        }
    }).then(function (response) {
        $("#cityAndDate").text(response.name + " " + new Date().toLocaleDateString("en-GB"));
        var currentWeatherCode = response.weather[0].icon;
        $("#currentWeatherIcon").attr("src", "http://openweathermap.org/img/wn/" + currentWeatherCode + ".png")
        var currentTemp = response.main.temp;
        $("#currentTemp").text("Temperature: " + currentTemp.toFixed(1) + "°C");
        var currentHumidity = response.main.humidity;
        $("#currentHumidity").text("Humidity: " + currentHumidity + "%");
        var currentWind = response.wind.speed;
        $("#currentWind").text("Wind Speed: " + currentWind + " km/h");
        var lat = response.coord.lat;
        var lon = response.coord.lon;
        fiveDayandUVSearch(lon, lat);
        addToCityList(response.name);
    });

};

function fiveDayandUVSearch(lon, lat) {
    var queryURL = "https://api.openweathermap.org/data/2.5/onecall?lon=" + lon + "&lat=" + lat + "&units=metric&exclude=hourly,minutely,alerts&appid=fa83f868b44583cfef9d1a24e9512db4";
    console.log(queryURL);
    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function (response) {
        console.log(response);
        var currentUV = response.current.uvi;
        console.log(parseFloat(currentUV))
        if (currentUV < 3) {
            $("#currentUV").attr("style", "background-color: green;")
        } else if (currentUV >= 3 && currentUV < 6){
            $("#currentUV").attr("style", "background-color: yellow;")
        } else if (currentUV >= 6 && currentUV < 8){
            $("#currentUV").attr("style", "background-color: orange;")
        } else if (currentUV >= 8 && currentUV < 11){
            $("#currentUV").attr("style", "background-color: red;")
        } else {
            $("#currentUV").attr("style", "background-color: violet;")
        }

        $("#currentUV").text(currentUV);
        const cardDeck = $(".card-deck");
        cardDeck.empty();
        for (var i = 1; i < 6; i++) {
            const card = $("<div>");
            card.attr("class", "card text-white bg-primary mb-1");
            card.attr("style", "padding-left: 5px;");
            cardDeck.append(card);

            const cardBody = $("<div>");
            cardBody.attr("class", "card-body");
            card.append(cardBody);

            const h5El = $("<h5>");
            h5El.attr("class", "h5El");
            const timestamp = response.daily[i].dt;
            const selectedDate = new Date(timestamp * 1000).toLocaleDateString("en-GB");
            h5El.text(selectedDate);
            cardBody.append(h5El);

            const imgIcon = $("<img>");
            var currentWeatherCode = response.daily[i].weather[0].icon;
            imgIcon.attr("src", "https://openweathermap.org/img/wn/" + currentWeatherCode + ".png")
            const pTemp = $("<p>");
            pTemp.text("Temp: " + response.daily[i].temp.max.toFixed(1) + "°C");
            const pHumidity = $("<p>");
            pHumidity.text("Humidity: " + response.daily[i].humidity + "%");
            cardBody.append(imgIcon, pTemp, pHumidity);
        }
    });
};

function addToCityList(city) {
    const $buttonGroup = $("#btnGroup");
    const $button = $("<button>");
    if (!$("button:contains('" + city + "')").length) {
        $button.attr("class", "btn btn-light btnCity");
        $button.attr("id", city);
        $button.text(city);
        $buttonGroup.prepend($button);
    } else {

    }


}

$("#btnSearch").on("click", function (event) {
    event.preventDefault();
    $("#mainPanel").show();
    var city = $("#cityTextSearch").val();
    console.log(city)
    weatherSearch(city);
    $("#cityTextSearch").focus().select();
});

$("#cityTextSearch").on("keyup", function (e) {
    if (e.key == "Enter") {
        event.preventDefault();
        $("#mainPanel").show();
        weatherSearch(e.target.value);
        $("#cityTextSearch").focus().select();
    }
});

$("#btnGroup").on("click", ".btnCity", function (event) {
    event.preventDefault();
    var city = $(this).text();
    console.log(city)
    weatherSearch(city);
    $("#cityTextSearch").val("");
})
