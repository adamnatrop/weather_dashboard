// get elements from DOM
var searchHistContainer = $('#cityReturnBox');
var currentDayContainer = $('#currentDayForcast');
var fiveDayContainer = $('#fiveDayForcast');
var formCont = $('#zipEnt');
// global variables 

var cityHistContainer = $();
var currentDisplayIndex = 0;
var currentDisplayContainer = $();
var fiveDayDisplayContainer = $();

// Master Array used to push and store data 

weatherDataArray = [];






// API event listner on form submit button
formCont.on('click', '#submitBtn', function(event){
    event.preventDefault()
    // selecting the input field
    btnInput = $(this).parent().siblings().children('#inputZip');
    // storing userinput value
    var zipcode = btnInput.val();
    // calling api with user input zipcode. Current, 5 Day, and Map - for UV index
    var requestCurrentUrl = `https://api.openweathermap.org/data/2.5/weather?zip=${zipcode}&units=imperial&appid=20eb9192c17b776afe4b330eba55cc38`;
    var requestFiveDayUrl = `https://api.openweathermap.org/data/2.5/forecast?zip=${zipcode}&units=imperial&appid=20eb9192c17b776afe4b330eba55cc38`;
    // &cnt=1
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
    
    var storedDataObj = []

    for ( i = 0; i <= 40; i+=7 ){
        
        var dayObject = {   
                            lat: fiveDayData[0].city.coord.lat,
                            long: fiveDayData[0].city.coord.lon,
                            cityName: fiveDayData[0].city.name, 
                            icon: fiveDayData[0].list[i].weather[0].icon,
                            temp: fiveDayData[0].list[i].main.temp,
                            highTemp: fiveDayData[0].list[i].main.temp_max,
                            lowTemp: fiveDayData[0].list[i].main.temp_min,
                            humidity: fiveDayData[0].list[i].main.humidity,
                            windSpeed: fiveDayData[0].list[i].wind.speed,
                            feelsLike: fiveDayData[0].list[i].main.feels_like
                        }   

        storedDataObj.push(dayObject);

    }

    
    
    
    // call function to store data in master array
    storeData(storedDataObj)

    

}



function createSearchHistory(){
    cityHistContainer.remove(); 
        // // checks to see if search history exists yet
        // if (weatherDataArray.length > 1) {
        //     // removes past search results
        //     cityHistContainer.remove(); 
        // }
        // creates container that stores city name
        cityHistContainer = $('<div>');
        cityHistContainer.addClass('container remove');
        searchHistContainer.append(cityHistContainer);
        

        weatherDataArray.forEach(function(item, index){
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
            city.text(weatherDataObj[index].cityName)
            // before appending city div - need to figure out how to add index value to div to be able to call upon it when clicked later
            rowContainer.append(city);

            
        })

        
    }



// function that checks weatherDataArray length and limits the length pushing oldest appending newest object
function storeData(dataObj){

    if (weatherDataArray.length > 4){
        weatherDataArray.pop();
        weatherDataArray.unshift(dataObj);
    } else {

    weatherDataArray.unshift(dataObj);
    }

    
    createSearchHistory();
    currentWeatherForcast(dataObj);
    fiveDayWeatherForcast(dataObj);
}


searchHistContainer.on("click", ".cityBtn", function searchResults(){
    // gets array index value based on button clicked
    var weatherDataIndex = $(this).attr('data-index')
    // stores city data from indexed object
    var cityDataObj =  weatherDataArray[weatherDataIndex];
    

    currentWeatherForcast(cityDataObj, weatherDataIndex);

    fiveDayWeatherForcast(cityDataObj, weatherDataIndex);

})


function currentWeatherForcast(cityDataObj, index){
   //console.log(weatherDataArray);

    currentDisplayContainer.remove();
    // if (weatherDataArray.length > 0 ){
    //     currentDisplayContainer.remove(); 
    // }
     // creates container that stores city name
     currentDisplayContainer = $('<div>');
     currentDisplayContainer.addClass('container remove');
     currentDayContainer.append(currentDisplayContainer);

        var currentRow = $('<div>');
        currentRow.addClass('row');
        currentDisplayContainer.append(currentRow);

        var todayForecast = $('<h3>');
        todayForecast.addClass('col-sm-12');
        todayForecast.text("Today's Forecast:");

        var cityName = $('<div>');
        cityName.addClass('col-12');
        cityName.text(cityDataObj[0].cityName);

        var temp = $('<p>');
        temp.addClass('col-12');
        temp.text("Temperature: " + cityDataObj[0].temp + " °F");

        var currentHumidity = $('<p>');
        currentHumidity.addClass('col-12');
        currentHumidity.text("Humidity: " + cityDataObj[0].humidity + "%");

        var currentWindSpeed = $('<p>');
        currentWindSpeed.addClass('col-12');
        currentWindSpeed.text("Wind Speed: " + cityDataObj[0].windSpeed + " MPH");

        currentDisplayContainer.append(todayForecast);
        currentDisplayContainer.append(cityName);
        currentDisplayContainer.append(temp);
        currentDisplayContainer.append(currentHumidity);
        currentDisplayContainer.append(currentWindSpeed);

        return

}

function fiveDayWeatherForcast(cityDataObj){
    fiveDayDisplayContainer.remove();
    // if ( weatherDataArray.length > 0 ){
    //     fiveDayDisplayContainer.remove(); 
    // }
    

    // creates container that stores city name
    fiveDayDisplayContainer = $('<div>');
    fiveDayDisplayContainer.addClass('row remove');
    fiveDayContainer.append(fiveDayDisplayContainer);

    // creates five day forcast title
    var fiveDayForecast = $('<h3>');
    fiveDayForecast.addClass('col-sm-12');
    fiveDayForecast.text("5-Day Forecast:");
    fiveDayDisplayContainer.append(fiveDayForecast);

    console.log(cityDataObj);
    cityDataObj.forEach(function(item, index){

        
        dayData = $('<div>');
        dayData.addClass('col-sm-2 fiveDay');
        fiveDayDisplayContainer.append(dayData);
        
        var dayTemp = $('<p>');
        dayTemp.addClass('col-2');
        dayTemp.text("Temperature: " + item.temp + " °F");

        var dayOneHumidity = $('<p>');
        dayOneHumidity.addClass('col-2');
        dayOneHumidity.text("Humidity: " + item.humidity + "%");

        dayData.append(dayTemp);
        dayData.append(dayOneHumidity);
})   


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




