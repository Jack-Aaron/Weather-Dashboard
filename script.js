const searchedCities = [];
var isFahrenheit = true;

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
        } return URLs;
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
        uvBuilder(weatherData.coord);
        renderWeather(weatherData);
        forecast(forecastData);
        history(weatherData.name);
    }

    function uvBuilder(latLon) {
        var p1 = "https://api.openweathermap.org/data/2.5/uvi";
        var p2 = "?" + apiKey;
        var p3 = "&lat=" + latLon.lat + "&lon=" + latLon.lon;
        var queryURL = p1 + p2 + p3
        fetch(queryURL)
            .then(req => req.json())
            .then(async function (response) { await renderWeatherUV(response); });
    }

    function renderWeather(data) {
        document.getElementById("city").innerHTML = `
            <div class="row">
                <div class="col-4">
                    <h4>${data.name}</h4>
                </div>
                <div class="col-8">
                    <h5 style="float:right">${moment().format('MMMM Do, YYYY')}</h5>
                </div>
            </div>
        `;
        document.getElementById("current").innerHTML = `
            <h5>Temperature: ${convertKelvin(data.main.temp)}</h5>
            <h5>Humidity: ${data.main.humidity + '%'}</h5>
            <h5>Wind Speed: ${data.wind.speed + 'm/s'}</h5>
        `;
    }

    function renderWeatherUV(data) {
        var currentUV = data.value;
        var uvColor;
        if (currentUV <= 3) { uvColor = "background-color:#299501" }
        else
            if (3 <= currentUV && currentUV < 6) { uvColor = "background-color:#F7E401" }
            else
                if (6 <= currentUV && currentUV < 8) { uvColor = "background-color:#F95901" }
                else
                    if (8 <= currentUV && currentUV < 11) { uvColor = "background-color:#D90011" }
                    else uvColor = "background-color:#6C49CB";
        document.getElementById("UV").innerHTML = `
            <h5>UV Index: <span style="text-align:center;border-radius:5px;${uvColor}">${currentUV}</span></h5>
        `;
    }

    function forecast(data) {
        for (let i = 0; i < 5; i++) {
            document.getElementById(`day${i + 1}`).style = "visibility:visible";
            document.getElementById(`day${i + 1}`).innerHTML = `
                <h6>${moment(data.list[3 + (i * 8)].dt_txt).format('MMMM Do')}</h6>
                <img src="https://openweathermap.org/img/wn/${data.list[3 + (i * 8)].weather[0].icon}.png">
                <h6>${convertKelvin(data.list[3 + (i * 8)].main.temp)}</h6>
                <h6>Hmdty: ${data.list[3 + (i * 8)].main.humidity}%</h6>
            `;
        }
    }

    function history(name) {
        for (let i = 0; i <= searchedCities.length; i++) {
            if (searchedCities.includes(name) === false) {
                searchedCities.push(name);
                let historyButton = document.createElement("button");
                historyButton.textContent = name;
                historyButton.id = `historyButton${name}`;
                historyButton.style = "border-radius:3px";
                document.getElementById("city-history").appendChild(historyButton);
                const linebreak = document.createElement("br");
                document.getElementById("city-history").appendChild(linebreak);
                historyButton.addEventListener("click", function () {
                    var historyButton = document.getElementById('historyButton');
                    query(builder(name, calls));
                })
            }
        }
    }

    function convertKelvin(temp) {
        const celsius = temp - 273.15;
        if (isFahrenheit === true) { return (celsius * 9 / 5 + 32).toFixed(1) + '&#8457' }
        else { return celsius.toFixed(1) + '&#8451;' }
    }

    // scale.addEventListener("change", function switchScale() {
    //     var x = scale.value;
    //     if (x = 'fahrenheit') { isFahrenheit = true }
    //     else { isFahrenheit = false }
    // })

    button.addEventListener("click", function () {
        var city = document.querySelector("input").value;
        query(builder(city, calls));
    })
})