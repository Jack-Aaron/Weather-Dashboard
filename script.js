$(document).ready(function () {
    const button = document.getElementById("search");
    const calls = ["weather", "forecast"];
    const apiKey = "appid=18ac44d36d8e6681e3fb54132749a6ea";

    var search = {
        click: button.addEventListener("click", function () {
            var city = document.querySelector("input").value;
            var parameter = search.parameter(city);
            var URLs = search.query(parameter, calls);
            return search.response(URLs);
        }),
        parameter: function (city) {
            var parameter = "?q=" + city + "&" + apiKey;
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
            var weatherData = data[0];
            var forecastData = data[1];
            var latLon = weatherData.coord;
            var weatherUV = process.uv.weather(latLon);
            //           var forecastUV = process.uv.forecast(latLon);
  //          var weather = process.render.weather(weatherData);
     //       var forecast = process.render.forecast(forecastData);
    //        var history = process.render.history(weatherData.name);
        },
        uv: kinds = {
            weather: function (latLon) {
                var URLs = [];
                var lat = latLon.lat;
                var lon = latLon.lon;
                console.log(lat);
                console.log(lon);
                var queryURL =
                    "http://api.openweathermap.org/data/2.5/uvi?" + apiKey
                    + "&lat=" + lat
                    + "&lon=" + lon;
                fetch(queryURL)
        .then(req => req.json())
        .then(function (response) {
            var currentUV = response;
            console.log(currentUV);
            })
        },
            forecast: function (latLon) {
                var URLs = [];
                var lat = latLon.lat;
                var lon = latLon.lon;
                console.log(lat);
                console.log(lon);
                var queryURL =
                    "http://api.openweathermap.org/data/2.5/uvi/forecast?" + apiKey + "&lat="
                    + lat
                    + "&lon="
                    + lon
                    + "&cnt="
                    + cnt;
                fetch(queryURL)
        .then(req => req.json())
        .then(function (response) {
            var forecastUV = response;
            console.log(forecastUV);
            })
        }
    }
}
})
        


            /*
            var responses = [];
            var nURLs = URLs.length;
            for(let n = 0; n<nURLs; n++) {
    fetch(queryURL)
        .then(req => req.json())
        .then(function (response) {
            responses.push(response);
            var nResponses = responses.length
            if (nResponses === nURLs) { process.send(responses); }
        }); 
},
forecast: function () {

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
}*/