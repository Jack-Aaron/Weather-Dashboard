$(document).ready(function () {
    // load history from storage
    var searchHistory = JSON.parse(localStorage.getItem("searchHistory"));
    if (searchHistory === null) { searchHistory = []; } // if empty then create new array
    else { // build all entries in array into city history cards
        for (let i = 0; i < searchHistory.length; i++) { buildHistoryCard(searchHistory[i]); }
    }
    // building the city history cards
    function buildHistoryCard(city) { // modify cards here:
        let cityHistoryCard = $(` 
            <button>
            <div class="card">
            <h5 class="card-title" id ="city">
            ${city}
            </h5>
            </div>
            </button>
        `);
        // add the city card to history section
        var cityHistory = $("#city-history");
        cityHistory.prepend(cityHistoryCard);
    }
    // embeds city from search or history card into query URL 
    function inputQuery(city) {
        // places it into the API call
        var queryURL = "http://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=18ac44d36d8e6681e3fb54132749a6ea";
        currentAjaxGet(queryURL);
        var queryURL = "http://api.openweathermap.org/data/2.5/forecast?q=" + city + "&appid=18ac44d36d8e6681e3fb54132749a6ea";
        fiveDayForecastAjaxGet(queryURL);
    }

    function fiveDayForecastAjaxGet(queryURL) {
        $.ajax({
            url: queryURL,
            method: "get",
        }).then(function (response) {
            console.log(response);
            buildFiveDayForecast(response.name);
        });
    }

    function buildFiveDayForecast(city) {
        // clear current city
        $("#forecast").empty();
        // building the current city card
        let forecastCity = $(`
            <card class="card col-2">
                1<br>1<br>1<br>1
            </card>
            <card class="card col-2">
                2<br>2<br>2<br>2
            </card>
            <card class="card col-2">
                3<br>3<br>3<br>3
            </card>
            <card class="card col-2">
                4<br>4<br>4<br>4
            </card>
            <card class="card col-2">
                5<br>5<br>5<br>5
             </card>
        `);
        // add the city card to current section
        $("#forecast").prepend(forecastCity);
    }

    // ajax API call
    function currentAjaxGet(queryURL) {
        $.ajax({
            url: queryURL,
            method: "get",
        }).then(function (response) {
            console.log(response);
            saveCity(response.name); // saves city search to local storage array
            buildCurrentCard(response.name); // gets city name from API
            buildHistoryCard(response.name); // immediately puts city in search history
        });
    }
    function saveCity(city) {
        // add to array
        searchHistory.push(city);
        // write to storage
        localStorage.setItem("searchHistory", JSON.stringify(searchHistory));
    }
    function buildCurrentCard(city) {
        // clear current city
        $("#current").empty();
        // building the current city card
        let currentCity = $(`
            <div class="">
            <h5>
            ${city}
            </h5>
            </div>
        `);
        // add the city card to current section
        $("#current").prepend(currentCity);
    }

    // when search button is clicked
    $("#search").on("click", function () {
        // gets user input from search field
        var city = $("input").val();
        inputQuery(city);
    });
    // when clear button is clicked

    // when city-button is clicked
    //   $("#city").on("click", function (event) {
    //     var city = event.target.chiouterText;
    //      renderSearchedCity(city);
    //   });
});