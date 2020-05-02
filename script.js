$(document).ready(function () {

   // var cityList = JSON.parse("src", "/city.list.min.json.gz");
 //   console.log(cityList);

    $("#search-button").on("click", function () {




        var city = $("input").val();
        var queryURL = "http://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=18ac44d36d8e6681e3fb54132749a6ea";

        $.ajax({
            url: queryURL,
            method: "get",
        }).then((response) => console.log(response));
    });
});