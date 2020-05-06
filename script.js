$(document).ready(function () {
    const button = document.getElementById("search");
    const calls = ["weather", "forecast"];

    var search = {
        click: button.addEventListener("click", function () {
            var city = document.querySelector("input").value;
            var parameter = search.parameter(city);
            var URLs = search.query(parameter, calls);
            return search.response(URLs);
        }),
        parameter: function (city) {
            var parameter = "?q=" + city + "&appid=18ac44d36d8e6681e3fb54132749a6ea";
            return parameter;
        },
        query: function (parameter, calls) {
            var URLs = [];
            var nCalls = calls.length;
            for (let n = 0; n < nCalls; n++) {
                var queryURL = "http://api.openweathermap.org/data/2.5/"
                    + calls[n]
                    + parameter;
                URLs.push(queryURL);
            }
            return URLs;
        },
        response: function (URLs) {
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
            var cityWeather = process.render.cityWeather(data[0]);
            var cityForecast = process.render.cityForecast(data[1]);
            var cityHistory = process.render.cityHistory(data[0].name);
        },
        render: functions = {
            cityWeather: function (data) {
                console.log(data.name);
                console.log(moment().format('MMMM Do YYYY'));
                console.log(data.weather[0].icon);
                console.log(data.main.temp);
                console.log(data.main.humidity);
                console.log(data.wind.speed);
                //  console.log(UV);
            },
            cityForecast: function (data) {
                console.log(moment().format('MMMM Do YYYY'));
                console.log(data.list[0].weather[0].icon); // make a for loop, n
                console.log(data.list[0].main.temp);
                console.log(data.list[0].main.humidity);
                console.log(data);

            },
            cityHistory: function (data) {
                console.log(data);
            }
        }
    }
});