$(document).ready(function () {
    const button = document.getElementById("search");
    const calls = ["weather", "forecast"];
    const apiKey = "appid=18ac44d36d8e6681e3fb54132749a6ea";

    var search = {
        click: button.addEventListener("click", function () {
            var city = document.querySelector("input").value;
            search.query(search.builder(city, calls));
        }),

        builder: function (city, calls) {
            var URLs = [];
            var nCalls = calls.length;
            var parameter = "?q=" + city + "&" + apiKey;
            for (let n = 0; n < nCalls; n++) {
                var queryURL = "https://api.openweathermap.org/data/2.5/"
                    + calls[n]
                    + parameter;
                URLs.push(queryURL);
            }
            return URLs;
        },

        query: function (URLs) {
            var responses = [];
            var nURLs = URLs.length;
            for (let n = 0; n < nURLs; n++) {
                var queryURL = URLs[n];
                fetch(queryURL)
                    .then(req => req.json())
                    .then(function (response) {
                        responses.push(response);
                        var nResponses = responses.length
                        if (nResponses === nURLs) { process.send(responses); }
                    });
            }
        }
    }

    var process = {
        send: function (data) {
            var weatherData = data[0];
            var forecastData = data[1];
            var latLon = process.uv.builder(weatherData.coord);
            var uvData = process.uv.query(latLon);
            var weather = process.render.weather(weatherData);
            var forecast = process.render.forecast(forecastData);
            var history = process.render.history(weatherData.name);
        },

        uv: kinds = {

            builder: function (latLon) {
                var p1 = "https://api.openweathermap.org/data/2.5/uvi";
                var p2 = "?" + apiKey;
                var p3 = "&lat=" + latLon.lat + "&lon=" + latLon.lon;
                var weather = p1 + p2 + p3
                var forecast = p1 + "/forecast" + p2 + p3 + "&cnt=" + 4;
                var uvURLs = [weather, forecast];
                return uvURLs;
            },

            query: function (uvURLs) {
                var responses = [];
                var nUvURLS = uvURLs.length;
                for (let n = 0; n < nUvURLS; n++) {
                    var queryURL = uvURLs[n];
                    fetch(queryURL)
                        .then(req => req.json())
                        .then(function (response) {
                            responses.push(response);
                            var nResponses = responses.length
                            if (nResponses === nUvURLS) {
                                console.log(responses);
                            }
                        });
                }
            }
        },

        render: functions = {
            weather: function (data) {
                console.log(data);
                console.log(data.name);
                console.log(moment().format('MMMM Do YYYY'));
                console.log(data.weather[0].icon);
                console.log(data.main.temp);
                console.log(data.main.humidity);
                console.log(data.wind.speed);
                //  console.log(UV);
            },

            forecast: function (data) {
                console.log(moment().format('MMMM Do YYYY'));
                console.log(data.list[0].weather[0].icon); // make a for loop, n
                console.log(data.list[0].main.temp);
                console.log(data.list[0].main.humidity);
                console.log(data);

            },

            history: function (name) {
                console.log("Button: " + name);
            }
        }
    }
})