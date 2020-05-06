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
                        if (nResponses === nURLs) { search.sendData(responses); }
                    });
            }
        },
        sendData: function(data) {
            var cityWeather = cityWeather(data[0]);
            var cityForecast = cityForecast(data[1]);
            var cityHistory = cityHistory(data);
        }
    }


});