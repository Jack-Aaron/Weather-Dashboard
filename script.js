const searchedCities = [];

$(document).ready(function () {
    const button = document.getElementById("search");
    const calls = ["weather", "forecast"];
    const apiKey = "appid=18ac44d36d8e6681e3fb54132749a6ea";

    function builder(city, calls) {
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
    }

    function query(URLs) {
        var responses = [];
        var nURLs = URLs.length;
        for (let n = 0; n < nURLs; n++) {
            var queryURL = URLs[n];
            fetch(queryURL)
                .then(req => req.json())
                .then(function (response) {
                    responses.push(response);
                    var nResponses = responses.length;
                    if (nResponses === nURLs) { send(responses) }
                });
        }
    }

    function send(data) {
        var weatherData = data[0];
        var forecastData = data[1];
        uvQuery(uvBuilder(weatherData.coord));
        renderWeather(weatherData);
        forecast(forecastData);
        history(weatherData.name);
    }

    function uvBuilder(latLon) {
        var p1 = "https://api.openweathermap.org/data/2.5/uvi";
        var p2 = "?" + apiKey;
        var p3 = "&lat=" + latLon.lat + "&lon=" + latLon.lon;
        var weather = p1 + p2 + p3
        var forecast = p1 + "/forecast" + p2 + p3 + "&cnt=" + 4;
        var uvURLs = [weather, forecast];
        return uvURLs;
    }

    function uvQuery(uvURLs) {
        var responses = [];
        var nUvURLS = uvURLs.length;
        for (let n = 0; n < nUvURLS; n++) {
            var queryURL = uvURLs[n];
            fetch(queryURL)
                .then(req => req.json())
                .then(function (response) {
                    responses.push(response);
                    var nResponses = responses.length
                    if (nResponses === nUvURLS) { uvSend(responses) }
                });
        }
    }

    function uvSend(data) {
        var weatherUV = data[0];
        var forecastUV = data[1];
        renderWeatherUV(weatherUV);
    }

    function renderWeather(data) {
        document.getElementById("city").innerHTML = `
        <div class="row">
            <div class="col-3">
                <h4>${data.name}</h4>
            </div>
            <div class="col-9">
                <h5 style="float:right">${moment().format('MMMM Do, YYYY')}</h5>
            </div>
        </div>
        `;
        document.getElementById("current").innerHTML = `
        <h5>Temperature: ${data.main.temp + ' K'}</h5>
        <h5>Humidity: ${data.main.humidity + '%'}</h5>
        <h5>Wind Speed: ${data.wind.speed + 'm/s'}</h5>
        `;
    }

    function renderWeatherUV(data) {
        var cityUV = document.createElement("h5");
        cityUV.setAttribute("id", "UV");
        var currentUV = data.value;
        cityUV.textContent = currentUV;
        if (currentUV <= 3) { cityUV.setAttribute("style", "background-color:#299501"); }
        if (3 <= currentUV < 6) { cityUV.setAttribute("style", "background-color:#F7E401"); }
        if (6 <= currentUV < 8) { cityUV.setAttribute("style", "background-color:#F95901"); }
        if (8 <= currentUV < 11) { cityUV.setAttribute("style", "background-color:#D90011"); }
        if (currentUV >= 11) { cityUV.setAttribute("style", "background-color:#6C49CB"); }
        document.body.children[1].children[0].children[1].children[0].children[1].appendChild(cityUV);
    }

    function forecast(data) {
        for (let i = 0; i < 5; i++) {
            document.getElementById(`day${i + 1}`).innerHTML = `
            <h6>${moment(data.list[3 + (i * 8)].dt_txt).format('MMMM Do')}</h6>
            <img src="https://openweathermap.org/img/wn/${data.list[3 + (i * 8)].weather[0].icon}.png">
            <h6>${data.list[3 + (i * 8)].main.temp}</h6>
            <h6>${data.list[3 + (i * 8)].main.humidity}</h6>
            `;
        }
    }

    function history(name) {
        for (let i = 0; i <= searchedCities.length; i++) {
            if (searchedCities.includes(name) === false) {
                searchedCities.push(name);
                let historyButton = document.createElement("button");
                historyButton.textContent = name;
                historyButton.id = (`historyButton${name}`);
                document.body.children[1].children[1].children[0].children[0].children[1].children[0].appendChild(historyButton);
                historyButton.addEventListener("click", function () {
                    var historyButton = document.getElementById('historyButton');
                    query(builder(name, calls));
                })
            }
        }
    }

    button.addEventListener("click", function () {
        var city = document.querySelector("input").value;
        query(builder(city, calls));
    })
}) 