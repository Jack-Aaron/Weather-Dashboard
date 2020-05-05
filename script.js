$(document).ready(function () {

    // defines the search Object
    var search = {
        // value of what user types in search bar
        variables: input = {
            location: document.getElementById("search"),
            calls: ["weather",
                "forecast"],
            responses: [],
            URLs: []
        },

        parameter: function (city) {
            var parameter = "?q=" + city + "&appid=18ac44d36d8e6681e3fb54132749a6ea";
            console.log(parameter);
            return parameter;
        },

        query: function (parameter, calls) { // when called takes the user input (city) and writes the URLs for both API kinds in array
            // declare an array to hold the query URLs
            // number of calls to make, for the count
            //   console.log(calls);

            var nCalls = calls.length;
            // there are just two kinds of API calls we need to make
            for (let n = 0; n < nCalls; n++) {
                //    var call = `${calls[n]}`;

                //  console.log(call);
                // the first part of the URL
                var queryURL = "http://api.openweathermap.org/data/2.5/"
                    // iterating through the two kinds of API calls
                    + calls[n]
                    // for the specific city user has searched for
                    + parameter;
                console.log(queryURL);
                input["URLs"].push(queryURL);
                // console.log(name);
            }
            return input.URLs;
        },

        response: function (URLs) {
            var nURLs = URLs.length;
            // call the two APIs based on the array input
            for (let n = 0; n < nURLs; n++) {
                // get the URL for each API call
                var queryURL = URLs[n];

                // get the response from each API call
                fetch(queryURL)
                    .then(req => req.json())
                    .then(function (response) { // do the following with the response:
                        // add response of each kind of API into array
                        input["responses"].push(response);
                        var nResponses = input["responses"].length
                        /* stop building array when
                        it is as long as the number
                        of API call URLs */
                        if (nResponses === nURLs) {
                            // console.log(responses[0].main.feels_like);
                            console.log(input["responses"]);
                        }
                    });
            }
        },

        button: input.location.addEventListener("click", function () {



            // there are two kinds of API calls we need to make with our input:
            // call function to get our queryURLs
            
            var city = document.querySelector("input").value;
            var parameter = search.parameter(city);
            var calls = input["calls"];
            var URLs = search.query(parameter, calls);
            search.response(URLs);
        })
    }



});