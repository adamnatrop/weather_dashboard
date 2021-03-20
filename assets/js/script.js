// get elements from DOM
var searchHistContainer = $('#cityReturnBox');
var formCont = $('#zipEnt');
// global variables 



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
                feelsLink: currentData[0].main.feels_like,
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
                futureFeelsLink: fiveDayData[0].list[0].main.feels_like
            }
        ]
    }
    
    createSearchHistory(storedDataObj)
    // call function to store data in master array
    
}




function createSearchHistory(weatherDataObj){

    
        var rowContainer = $('<div>');
        rowContainer.addClass('row searchHistory');
        searchHistContainer.append(rowContainer);

        var city = $('<div>');
        city.addClass('col-sm-12')


        city.text(weatherDataObj.city[0].cityName)
        rowContainer.append(city);



        console.log(weatherDataObj)

        
        storeData(weatherDataObj);

    }



// function that checks masterArray length and limits the length pushing oldest appending newest object
function storeData(dataObj){

    if (masterArray.length <= 4){
        masterArray.push(dataObj);  
    } 
    // else if (masterArray.length >=4) {
    //     masterArray.shift();
    //     masterArray.push(dataObj);
    // }
    console.log(masterArray);
    
}







// pseudoCode 

// pull down local storage object array

// create object array to store api data for searches 

// create object array to store 5 day forcast

// create object to store current forcast 


// setup functions for calls based on user search input

  // store search results in object array
  // push object array into local storage on search submit button 

// create elements from iterating over the array from search results 




