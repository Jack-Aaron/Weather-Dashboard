$(document).ready(function () {

    // var cityList = JSON.parse("src", "/city.list.min.json.gz");
    //   console.log(cityList);

    $("#search-button").on("click", function () {
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
            var city = response.name
            console.log(city);
            //building the city history card
            let cityHistory = $(`
                <button id ="city" style="visibility:hidden;">
                <div class="card">
                <h5 class="card-title">
                ${city}
                </h5>
                </div>
                </button>
            `);
            //building the current city card
            let currentCity = $(`
                <div class="">
                <h5>
                ${city}
                </h5>
                </div>
            `);
            // add the city card to history section
            $("#city-history").prepend(cityHistory);
            // add the city card to current section
            $("#current").prepend(currentCity);
            // add to localstorage
            // ...............
        });


    });
});