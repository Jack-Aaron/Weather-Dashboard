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
        $("#city-history").prepend(cityHistoryCard);
    }

    // when city-button is clicked
    //   $("#city").on("click", function (event) {
    //     var city = event.target.chiouterText;
    //      renderSearchedCity(city);
    //   });

    // renders city by search or history card
    function inputQuery(city) {
        // places it into the API call
        var queryURL = "http://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=18ac44d36d8e6681e3fb54132749a6ea";
        ajaxCall(queryURL);
    }
    // ajax API call
    function ajaxCall(queryURL) {
        $.ajax({
            url: queryURL,
            method: "get",
        }).then(function (response) {
            buildCurrentCard(response.name); // gets city name from API
            
            saveCity(response.name);

            // buildHistoryCard(response.name);
        });
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
    function saveCity(city) {
        // add to array
        searchHistory.push(city);
        // write to storage
        localStorage.setItem("searchHistory", JSON.stringify(searchHistory));
    }
    // when search button is clicked
    $("#search").on("click", function () {
        // gets user input from search field
        var city = $("input").val();
        inputQuery(city);
    });
    // when clear button is clicked
});