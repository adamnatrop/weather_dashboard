// get elements from DOM
var searchHistContainer = $('#cityReturnBox');
var formCont = $('#zipEnt');
// global variables 

var cityHistContainer = $();

// Master Array used to push and store data 

masterArray = [];






// API event listner on form submit button
formCont.on('click', '#submitBtn', function(event){
    event.preventDefault()
    // selecting the input field
    btnInput = $(this).parent().siblings().children('#inputZip');
    // storing userinput value
    var zipcode = btnInput.val();
    // calling api with user input zipcode. Current, 5 Day, and Map - for UV index
    var requestCurrentUrl = `https://api.openweathermap.org/data/2.5/weather?zip=${zipcode}&units=imperial&appid=20eb9192c17b776afe4b330eba55cc38`;
    var requestFiveDayUrl = `https://api.openweathermap.org/data/2.5/forecast?zip=${zipcode}&cnt=1&units=imperial&appid=20eb9192c17b776afe4b330eba55cc38`;
    // var requestMapUrl = '',

        // calling api simultaneously  
        $.when(

            $.ajax({
                url: requestCurrentUrl,
                method: 'GET',
            }),
            $.ajax({
                url: requestFiveDayUrl,
                method: 'GET',
            })

        // once the call is received pushes both data objects to parse function
        ).then(function (current, fiveDay) {
            //console.log('Ajax Reponse \n-------------');
            //console.log(current, fiveDay);
        

            // write another call function to get the map data lat long based on the current api
            
        parseResponseDataObj(current, fiveDay);

        

        });
})

// function to parse data objects into useable key value pairs
function parseResponseDataObj(currentData, fiveDayData){

    var storedDataObj = 

    { city: 
        [   
            {
                cityName: currentData[0].name,
                currentIcon: currentData[0].weather[0].icon,
                currentTemp: currentData[0].main.temp,
                highTemp: currentData[0].main.temp_max,
                lowTemp: currentData[0].main.temp_min,
                humidity: currentData[0].main.humidity,
                windSpeed: currentData[0].wind.speed,
                feelsLike: currentData[0].main.feels_like,
                lat: currentData[0].coord.lat,
                long: currentData[0].coord.lon
            },
            {
                futureForcastIcon: fiveDayData[0].list[0].weather[0].icon,
                futureTemp: fiveDayData[0].list[0].main.temp,
                futureHighTemp: fiveDayData[0].list[0].main.temp_max,
                futureLowTemp: fiveDayData[0].list[0].main.temp_min,
                futureHumidity: fiveDayData[0].list[0].main.humidity,
                futureWindSpeed: fiveDayData[0].list[0].wind.speed,
                futureFeelsLike: fiveDayData[0].list[0].main.feels_like
            }
        ]
    }
    
    storeData(storedDataObj)
    // call function to store data in master array
    
}




function createSearchHistory(){

        // checks to see if search history exists yet
        if (masterArray.length > 1) {
            // removes past search results
            cityHistContainer.remove(); 
        }
        // creates container that stores city name
        cityHistContainer = $('<div>');
        cityHistContainer.addClass('container remove');
        searchHistContainer.append(cityHistContainer);
        
        //console.log(masterArray.city)

        masterArray.forEach(function(item, index){
            // stores each object item
            var weatherDataObj = item;
            // creates row container for each city
            var rowContainer = $('<div>');
            rowContainer.addClass('row searchHistory');
            cityHistContainer.append(rowContainer);
            // creates city "button" that user will click on to display weather results
            var city = $('<div>');
            city.addClass('col-sm-12 cityBtn');
            city.attr('data-index', index);
            // writing city name text to button
            city.text(weatherDataObj.city[0].cityName)
            // before appending city div - need to figure out how to add index value to div to be able to call upon it when clicked later
            rowContainer.append(city);

        })
    }



// function that checks masterArray length and limits the length pushing oldest appending newest object
function storeData(dataObj){

    if (masterArray.length > 4){
        masterArray.pop();
        masterArray.unshift(dataObj);
    } else {

    masterArray.unshift(dataObj);
    }

    createSearchHistory();
}


searchHistContainer.on("click", ".cityBtn", function(){

    console.log($(this));

})




// pseudoCode 

// pull down local storage object array

// create object array to store api data for searches 

// create object array to store 5 day forcast

// create object to store current forcast 


// setup functions for calls based on user search input

  // store search results in object array
  // push object array into local storage on search submit button 

// create elements from iterating over the array from search results 




