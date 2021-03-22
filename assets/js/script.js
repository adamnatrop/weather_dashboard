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
var timeStamp = moment();

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
    var requestMapData = `https://api.openweathermap.org/data/2.5/onecall?lat=44.9847&lon=-93.5422&exclude=minutely,hourly&appid=20eb9192c17b776afe4b330eba55cc38`;
    var requestWeatherDataURL = `https://api.openweathermap.org/data/2.5/forecast?zip=${zipcode}&units=imperial&appid=20eb9192c17b776afe4b330eba55cc38`;
    // &cnt=1
    // var requestMapUrl = '',

        // calling api simultaneously  
        $.when(

            
            $.ajax({
                url: requestWeatherDataURL,
                method: 'GET',
            }),
            $.ajax({
                url: requestMapData,
                method: 'GET',
            })

        // once the call is received pushes both data objects to parse function
        ).then(function (fiveDay, mapUV) {
            //console.log('Ajax Reponse \n-------------');
            //console.log(current, fiveDay);
        

            // write another call function to get the map data lat long based on the current api
            
        parseResponseDataObj(fiveDay, mapUV);

        console.log(mapUV)

        });
})

// function to parse data objects into useable key value pairs
function parseResponseDataObj(fiveDayData, mapUV){
    
    var storedDataObj = []

    for ( i = 0; i <= 40; i+=7 ){
        
        var dayObject = {   
                            uvi: mapUV[0].current.uvi,
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
    storeData(storedDataObj);
    console.log(storedDataObj);
}



function createSearchHistory(){
    
    cityHistContainer.remove(); 
     
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

    // runs through first screen build and displays data
    createSearchHistory();
    currentWeatherForcast(dataObj);
    fiveDayWeatherForcast(dataObj);
}

// click listener when user selects a city from recent search
searchHistContainer.on("click", ".cityBtn", function searchResults(){
    // gets array index value based on button clicked
    var weatherDataIndex = $(this).attr('data-index')
    // stores city data from indexed object
    var cityDataObj =  weatherDataArray[weatherDataIndex];
    
    // calls current weather function passes clicked object and index value
    currentWeatherForcast(cityDataObj, weatherDataIndex);
    // calls fivedayforcast passes clicked object and index value
    fiveDayWeatherForcast(cityDataObj, weatherDataIndex);

})


function currentWeatherForcast(cityDataObj, index){
   

    currentDisplayContainer.remove();
    
     // creates container that stores city name
     currentDisplayContainer = $('<div>');
     currentDisplayContainer.addClass('container remove');
     currentDayContainer.append(currentDisplayContainer);

        var currentRow = $('<div>');
        currentRow.addClass('row');
        currentDisplayContainer.append(currentRow);

        var todayForecast = $('<h2>');
        todayForecast.addClass('col-sm-12');
        todayForecast.text("Today's Forecast:");

        var cityName = $('<h3>');
        cityName.addClass('col-12');
        cityName.text(cityDataObj[0].cityName + " " + moment().format('dddd MMM DD YYYY'));

        var temp = $('<p>');
        temp.addClass('col-12');
        temp.text("Temperature: " + cityDataObj[0].temp + " °F");

        var currentHumidity = $('<p>');
        currentHumidity.addClass('col-12');
        currentHumidity.text("Humidity: " + cityDataObj[0].humidity + "%");

        var currentWindSpeed = $('<p>');
        currentWindSpeed.addClass('col-12');
        currentWindSpeed.text("Wind Speed: " + cityDataObj[0].windSpeed + " MPH");

        var currentUVI = $('<p>');
        currentUVI.addClass('col-sm-2');
        currentUVI.text("UV Index: " + cityDataObj[0].uvi);

        setUVIndexClass(currentUVI, cityDataObj[0].uvi);

        currentDisplayContainer.append(todayForecast);
        currentDisplayContainer.append(cityName);
        currentDisplayContainer.append(temp);
        currentDisplayContainer.append(currentHumidity);
        currentDisplayContainer.append(currentWindSpeed);
        currentDisplayContainer.append(currentUVI);

        return

}

function setUVIndexClass(currentUVI, cityUVIndex){

    if (cityUVIndex <= 2 ){
    currentUVI.addClass('uvGreen')
    } else if (cityUVIndex >= 3 && cityUVIndex <= 4){
    currentUVI.addClass('uvYellow')
    } else if (cityUVIndex >= 6 && cityUVIndex <= 7){
        currentUVI.addClass('uvOrange')
    } else if (cityUVIndex >= 8 && cityUVIndex <= 10){
        currentUVI.addClass('uvRed')
    } else {
        currentUVI.addClass('uvViolet')
    }

}   

function fiveDayWeatherForcast(cityDataObj){
    fiveDayDisplayContainer.remove();
    
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
    cityDataObj.slice(1).forEach(function(item, index){
        
        
        dayData = $('<div>');
        dayData.addClass('col-sm-2 fiveDay');
        fiveDayDisplayContainer.append(dayData);

        var dateStamp = $('<p>');
        dateStamp.addClass('col-12');
        dateStamp.text(moment().add(1, 'days').format('dddd MMM DD'));
        
        var dayTemp = $('<p>');
        dayTemp.addClass('col-12');
        dayTemp.text("Temperature: " + item.temp + " °F");

        var dayOneHumidity = $('<p>');
        dayOneHumidity.addClass('col-12');
        dayOneHumidity.text("Humidity: " + item.humidity + "%");

        dayData.append(dateStamp);
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




