$(document).ready(function () {

    /* INITIALIZE APP */
    // reset search history card
    $("#city-history")[0].innerHTML = "";

    /* LOAD SEARCH HISTORY */

    // load history from storage
    var searchHistory = JSON.parse(localStorage.getItem("searchHistory"));

    if (searchHistory === null) { searchHistory = []; } // if empty then create new array
    else { // build all entries in array into city history cards
        for (let i = 0; i < searchHistory.length; i++) { buildHistoryCard(searchHistory[i]); }
    }
    // building the city history cards
    function buildHistoryCard(city) { // modify cards here:
        let cityHistoryCard = $(` 
            <button class="history">
            <div class="">
            <h5 class="" id ="${city}">${city}</h5>
            </div>
            </button>
        `);
        // add the city card to history section
        var cityHistory = $("#city-history");
        cityHistory.prepend(cityHistoryCard);
    }

    /* QUERY API */

    // embeds city from search or history card into query URL 
    function inputQuery(city) {
        // has this been recorded as a previous search?
        checkHistoryForCurrentQuery(city);
        // places it into the API call
        var queryURLWeather = "http://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=18ac44d36d8e6681e3fb54132749a6ea";
        ajaxGetCurrent(queryURLWeather);
        var queryURLForecast = "http://api.openweathermap.org/data/2.5/forecast?q=" + city + "&appid=18ac44d36d8e6681e3fb54132749a6ea";
        //  ajaxGetFiveDayForecast(queryURLForecast);
    }
    function checkHistoryForCurrentQuery(query) {
        // checks if there is any search history at all
        if ($("#city-history")[0].innerHTML === "") { buildHistoryCard(query); }
        else {
            // get city query from latest history card
            var historyCity = $("#city-history")[0].children[0].children[0].children[0].id;
            if (historyCity === query) { return; }
            else { buildHistoryCard(query) }; // puts city query in search history
        };
    }

    // ajax API call for current city weather data
    function ajaxGetCurrent(queryURL) {
        $.ajax({
            url: queryURL,
            method: "get",
        }).then(function (response) {
            console.log(response); // DELETE LATER
            buildCurrentCard(response.name); // gets city name from API
            saveCity(response.name); // saves city search to local storage array
        });
    }
    // ajax API call for Five Day Forecast weather data
    function ajaxGetFiveDayForecast(queryURL) {
        $.ajax({
            url: queryURL,
            method: "get",
        }).then(function (response) {
            console.log(response);
            //  buildFiveDayForecast(response.name);
        });
    }

    /* LOAD CURRENT CITY WEATHER FROM API */

    function buildCurrentCard(city) {
        // clear current city
        $("#current").empty();
        // building the current city card
        let currentCity = $(`
            <div class="">
            <h5 id="${city}">${city}</h5>
            </div>
        `);
        // add the city card to current section
        $("#current").prepend(currentCity);
    }
    // build Five Day Forecast weather section
    function buildFiveDayForecast(city) {
        // clear five day forecast section
        $("#forecast").empty();
        // build new five day forecast section
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
        // re-write the five day forecast section with new data
        $("#forecast").prepend(forecastCity);
    }

    /* SAVE NEW SEARCH HISTORY */

    function saveCity(city) {
        // add to array
        searchHistory.push(city);
        // write to storage
        localStorage.setItem("searchHistory", JSON.stringify(searchHistory));
    }

    /* BUTTONS */

    // when search button is clicked
    $("#search").on("click", function () {
        // gets user input from search field
        var city = $("input").val();
        inputQuery(city);
    });
    // when history-city button is clicked
    $(".history").on("click", function () {
        // gets city query from history card
        var historyCity = this.children[0].children[0].id; // the city in the history button
        console.log(historyCity);
        var currentCityName = $(`#${city}`)[0].textContent; // city in current card
        if (historyCity === currentCityName) { return; }
        else { inputQuery(historyCity); }
        // console.log(currentCityName);
        // inputQuery(city);
    });
    // when clear button is clicked
    $("#clear-history").on("click", function () {
        // gets user input from search field
        $("#city-history").empty();
        searchHistory = [];
        localStorage.setItem("searchHistory", JSON.stringify(searchHistory));
    });
});