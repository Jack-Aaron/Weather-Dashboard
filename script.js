$(document).ready(function () {
    var search = document.getElementById("search");
    // when search button is clicked
    search.addEventListener("click", function () {
        // gets user input from search field
        var input = document.querySelector("input").value;
        var queryURL = "http://api.openweathermap.org/data/2.5/weather?q=" + input + "&appid=18ac44d36d8e6681e3fb54132749a6ea";
        $.ajax({
            url: queryURL,
            method: "get",
        }).then(function (response) {
            console.log(response); // DELETE LATER
        });
    });
});