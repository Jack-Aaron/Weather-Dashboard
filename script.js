$(document).ready(function () {
    // this defines what the search button is
    var searchButton = document.getElementById("search");
    // this defines what the search button does when clicked
    searchButton.addEventListener("click", function (event) { // search API based on input
        // gets the value of what user has typed in search bar
        var typedInputInSearchBar = document.querySelector("input").value;
        // inserts that value into its related part of the API URL
        var partOfURLthatTakesUserInput = "?q=" + typedInputInSearchBar + "&appid=18ac44d36d8e6681e3fb54132749a6ea";
        // there are two kinds of API calls we need to make with our input:
        var kindsOfAPIcallsWeNeedToMake = ["weather", "forecast"];
        var queryURLarray = [];
        // call function to get our queryURLs
        var queryURLarray = queryURLs(partOfURLthatTakesUserInput, kindsOfAPIcallsWeNeedToMake);
        callAPIs(queryURLarray);
    })
    // when called, takes the user input (city) and makes the URL for both kinds of APIs
    function queryURLs(partOfURLthatTakesUserInput, kindsOfAPIcallsWeNeedToMake) {
        var queryURLarray = [];
        // there are just two kinds of API calls we need to make
        for (let i = 0; i < 2; i++) {
            // the first part of the URL
            var queryURL = "http://api.openweathermap.org/data/2.5/"
                // iterating through the two kinds of API calls
                + kindsOfAPIcallsWeNeedToMake[i]
                // for the specific city user has searched for
                + partOfURLthatTakesUserInput;
            queryURLarray.push(queryURL);
            //  console.log(queryURLarray[i]);
        }
        // name the weather API URL
        var queryURLweather = queryURLarray[0];
        // name the forecast API URL
        var queryURLforecast = queryURLarray[1];
        // array items are named
        var queryURLarray = [queryURLweather, queryURLforecast];
        // the query URLs for whatever needs it:
        return queryURLarray;
    }
    function callAPIs(queryURLarray) {
        // call the two APIs based on the array input
        for (let i = 0; i < 2; i++) {
            // get the URL for each API call
            var queryURL = queryURLarray[i];
            // get the response from each API call
            var response = $.ajax({
                // call on each URL
                url: queryURL,
                method: "get",
            }).then(function (response) { // do the following with the response:
                console.log(response);
            });
        }
    }
})