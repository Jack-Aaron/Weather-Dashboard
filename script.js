$(document).ready(function () {
    var searchButton = document.getElementById("search");

    searchButton.addEventListener("click", function (event) {

        var typedInputInSearchBar = document.querySelector("input").value;

        var partOfURLthatTakesUserInput = "?q=" + typedInputInSearchBar + "&appid=18ac44d36d8e6681e3fb54132749a6ea";

        var kindsOfAPIcallsWeNeedToMake = ["weather", "forecast"];

        queryURL(partOfURLthatTakesUserInput, kindsOfAPIcallsWeNeedToMake);

        
    })
    function queryURL(partOfURLthatTakesUserInput, kindsOfAPIcallsWeNeedToMake) {
        for (let i = 0; i < 2; i++) {
            var querylURL = "http://api.openweathermap.org/data/2.5/" + kindsOfAPIcallsWeNeedToMake[i] + partOfURLthatTakesUserInput;
            getResponse(querylURL);
        }
        function getResponse(queryURL) {
            var response = $.ajax({
                url: queryURL,
                method: "get",
            }).then(function (response) {
                console.log(response);
            });
        }
    }
});