$(document).ready(function () {

    // load history from storage
    var searchHistory = JSON.parse(localStorage.getItem("searchHistory"));
    if (searchHistory === null) { searchHistory = []; }
    else {
        for (let i = 0; i < searchHistory.length; i++) {
            buildHistoryCard(searchHistory[i]);
            console.log(searchHistory[i]);
        }
    }

    // building the city history card
    function buildHistoryCard(city) {
        let cityHistoryCard = $(`
                <button id ="city">
                <div class="card">
                <h5 class="card-title">
                ${city}
                </h5>
                </div>
                </button>
            `);
        // add the city card to history section
        $("#city-history").prepend(cityHistoryCard);
    }

    // when search button is clicked
    $("#search").on("click", function () {
        // gets what user has typed in the search input
        var city = $("input").val();
        // places it into the API call
        var queryURL = "http://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=18ac44d36d8e6681e3fb54132749a6ea";
        // ajax API call
        $.ajax({
            url: queryURL,
            method: "get",
        }).then(function (response) {

            // gets city name from API
            saveCity(response.name);
            function saveCity(city) {
                // add to array
                searchHistory.push(city);
                // write to storage
                localStorage.setItem("searchHistory", JSON.stringify(searchHistory));
            }

            // buildHistoryCard(city);
            buildCurrentCard(city);

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
        });
    });

    // when clear button is clicked
});