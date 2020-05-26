const searchedCities = [];
const button = document.getElementById("search");
// we'll do two seperate API calls here
const calls = ["weather", "forecast"];
const apiKey = "appid=18ac44d36d8e6681e3fb54132749a6ea";

// for F/C temperature scale switcher
var isFahrenheit = true;
var scale = document.getElementById("temperature");

$(document).ready(function () {
    function showLocalWeather() { //https://gist.github.com/BetterProgramming/d62a41d937e69bd51bb42e2ad2487ba6
        fetch('http://ip-api.com/json')
            .then(req => req.json())
            .then(
                async function success(response) {
                    localCity = response.city;
                    query(builder(localCity, calls));
                })
            .catch(function (err) { console.log(err) })
    }
    function loadCity() {
        loadedCity = localStorage.getItem("lastSearchedCity", city);
        if (loadedCity == null) { showLocalWeather() }
        else { query(builder(loadedCity, calls)) }
    }
    loadCity();
    function storeCity(city) {
        localStorage.setItem("lastSearchedCity", city);
    }
    // builds the API links we need
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
    //queries the built URLs
    function query(URLs) {
        var responses = [];
        var nURLs = URLs.length;
        for (let n = 0; n < nURLs; n++) {
            var queryURL = URLs[n];
            fetch(queryURL)
                .then(req => req.json())
                .then(async function (response) {
                    responses.push(response);
                    var nResponses = responses.length;
                    // waits to get all responses needed before continuing
                    if (nResponses === nURLs) { send(responses) }
                });
        }
    }
    // sends out all the responses to where they need to go
    function send(data) {
        var weatherData = data[0];
        var forecastData = data[1];
        renderWeather(weatherData);
        forecast(forecastData);
        uvBuilder(weatherData.coord);
        // if (loadedCity !== null && loadedCity !== localCity) { console.log(weatherData.name) }
        // if (loadedCity == null && weatherData.name !== localCity) { 
            history(weatherData.name) 
        // }
    }
    // builds API links for UV index
    function uvBuilder(latLon) {
        var p1 = "https://api.openweathermap.org/data/2.5/uvi";
        var p2 = "?" + apiKey;
        var p3 = "&lat=" + latLon.lat + "&lon=" + latLon.lon;
        var queryURL = p1 + p2 + p3
        fetch(queryURL)
            .then(req => req.json())
            .then(function (response) { renderWeatherUV(response); });
    }
    // renders the Current City card
    function renderWeather(data) {
        document.getElementById("city").innerHTML = `
            <div class="row">
                <div class="col-4">
                    <h4>${data.name}</h4>
                </div>
                <div class="col-8"> <!-- uses moment.js for date -->
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
    // renders UV index data
    function renderWeatherUV(data) {
        var currentUV = data.value;
        var uvColor;
        // the following if statements choose the UV Index color
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
    // renders the five-day Forecast cards
    function forecast(data) {
        document.getElementById("forecast").style = "visibility:visible"; // makes cards visible
        for (let i = 0; i < 5; i++) { // iterates all 5 cards for each day
            document.getElementById(`day${i + 1}`).style = "width:8em;height:11.5em";
            document.getElementById(`day${i + 1}`).innerHTML = `
                <div class="card-header">
                    ${moment(data.list[3 + (i * 8)].dt_txt).format('MM/D')}
                </div>
                <div class="card-body" style="height:8em">
                    <img src="https://openweathermap.org/img/wn/${data.list[3 + (i * 8)].weather[0].icon}.png" style="margin-top:-1.2em">
                    <h6=>${convertKelvin(data.list[3 + (i * 8)].main.temp)}</h6>
                    <h6>${data.list[3 + (i * 8)].main.humidity}%</h6>
                </div>`;
        }
    }
    // populates Search History card with new buttons for searched cities
    function history(name) {
        for (let i = 0; i <= searchedCities.length; i++) {
            if (searchedCities.includes(name) === false) {
                searchedCities.push(name);
                let historyButton = document.createElement("button");
                historyButton.textContent = name;
                historyButton.id = `historyButton${name}`;
                historyButton.style = "border-radius:8px;width:10em";
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
    //converts Kelvin to Fahrenheit or Celsius
    function convertKelvin(temp) {
        const celsius = temp - 273.15;
        if (isFahrenheit === true) {
            return (celsius * 9 / 5 + 32).toFixed(1)
                + '&#8457'
        }
        else { return celsius.toFixed(1) + '&#8451;' }
        // returns with one decimal place
    }
    // drop-down selector for Fahrenheit/Celsius
    scale.addEventListener("change", function switchScale() {
        var whichScale = scale.value;
        if (whichScale === 'fahrenheit') { isFahrenheit = true }
        else { isFahrenheit = false }
    })
    // onclick events for Searched History city buttons
    button.addEventListener("click", function () {
        // won't send empty query
        if (document.querySelector("input").value !== "") {
            var city = document.querySelector("input").value;
            query(builder(city, calls));
            // store the last searched city to localstorage
            storeCity(city);
        }
    })
})
