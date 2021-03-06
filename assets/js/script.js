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
var userInputCity = 0;
// Master Array used to push and store data 

// var weatherDataArray = JSON.parse(localStorage.getItem("weatherData")) || [];

var cityArray = JSON.parse(localStorage.getItem("searchInput")) || [];
var weatherDataArray = [];

// if (weatherDataArray.length !==0){
//     createSearchHistory();
// }

if (cityArray.length !==0) {

    cityArray.forEach(function(item, index){
        
        apiCall(item);
    })

}

// add in image url for the icons http://openweathermap.org/img/w/{icon}@2x.png  


// API event listner on form submit button
formCont.on('click', '#submitBtn', requestApi)


function requestApi (event){
    event.preventDefault()
    // selecting the input field
    btnInput = $(this).parent().siblings().children('#inputZip');
    // storing userinput value
    userInputCity = btnInput.val();
    // calling api with user input userInputCity. Current, 5 Day, and Map - for UV index
    

    if (cityArray.length > 4){
        cityArray.pop();
        cityArray.unshift(userInputCity);
    } else {

    cityArray.unshift(userInputCity);
    }

    

    apiCall(userInputCity);
}

function apiCall(userInputCity){
    var requestWeatherDataURL = `https://api.openweathermap.org/data/2.5/forecast?q=${userInputCity}&units=imperial&appid=20eb9192c17b776afe4b330eba55cc38`;
    // &cnt=1
    // var requestMapUrl = '',
    console.log(requestWeatherDataURL)
        // calling api simultaneously  
        $.when(

            
            $.ajax({
                url: requestWeatherDataURL,
                method: 'GET',
                
                
            })
          
        // once the call is received pushes both data objects to parse function
        ).then(function (fiveDay) {
            
            var lat = fiveDay.city.coord.lat;
            var lon = fiveDay.city.coord.lon;
            
            var requestMapData = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=minutely,hourly&appid=20eb9192c17b776afe4b330eba55cc38`;

        
            $.ajax({
                url: requestMapData,
                method: 'GET',
            }).then(function(mapUVData){
               
                parseResponseDataObj(fiveDay, mapUVData);
                console.log(mapUVData)
            })
        

            
            console.log(fiveDay)
        
        
        

        });       // write another call function to get the map data lat long based on the current api
            
        
    }    
        
    
       


// function to parse data objects into useable key value pairs
function parseResponseDataObj(fiveDayData, mapUV){
    
    localStorage.setItem("searchInput", JSON.stringify(cityArray));

    var storedDataObj = []

    for ( i = 0; i <= 40; i+=7 ){
        
        var dayObject = {   
                            date: fiveDayData.list[i].dt,
                            uvi: mapUV.current.uvi,
                            lat: fiveDayData.city.coord.lat,
                            long: fiveDayData.city.coord.lon,
                            cityName: fiveDayData.city.name, 
                            icon: fiveDayData.list[i].weather[0].icon,
                            temp: fiveDayData.list[i].main.temp,
                            highTemp: fiveDayData.list[i].main.temp_max,
                            lowTemp: fiveDayData.list[i].main.temp_min,
                            humidity: fiveDayData.list[i].main.humidity,
                            windSpeed: fiveDayData.list[i].wind.speed,
                            feelsLike: fiveDayData.list[i].main.feels_like
                        }   

        storedDataObj.push(dayObject);
        
    }
    
    // call function to store data in master array
    storeData(storedDataObj);
   
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
        city.addClass('col-sm-12 cityBtn btn btn-outline-primary');
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
   // localStorage.setItem("weatherData", JSON.stringify(weatherDataArray));
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
   
    console.log(cityDataObj[0].icon);
    currentDisplayContainer.remove();
    
     // creates container that stores city name
     currentDisplayContainer = $('<div>');
     currentDisplayContainer.addClass('container remove');
     currentDayContainer.append(currentDisplayContainer);

        var currentRow = $('<div>');
        currentRow.addClass('row');
        currentDisplayContainer.append(currentRow);

        var todayForecast = $('<h3>');
        todayForecast.addClass('col-sm-10');
        todayForecast.text("Today's Forecast:");

        var iconImg = $(`<img src=http://openweathermap.org/img/wn/${cityDataObj[0].icon}@2x.png>`);
        iconImg.addClass('col-sm-2');
        

        var cityName = $('<h2>');
        cityName.addClass('col-12');
        cityName.text(cityDataObj[0].cityName + " " + moment().format('dddd MMM DD YYYY'));

        var temp = $('<p>');
        temp.addClass('col-12');
        temp.text("Temperature: " + cityDataObj[0].temp + " ??F");

        var currentHumidity = $('<p>');
        currentHumidity.addClass('col-12');
        currentHumidity.text("Humidity: " + cityDataObj[0].humidity + "%");

        var currentWindSpeed = $('<p>');
        currentWindSpeed.addClass('col-12');
        currentWindSpeed.text("Wind Speed: " + cityDataObj[0].windSpeed + " MPH");

        var currentUVI = $('<p>');
        currentUVI.addClass('col-sm-2 btn');
        currentUVI.text("UV Index: " + cityDataObj[0].uvi);

        setUVIndexClass(currentUVI, cityDataObj[0].uvi);

        
        currentDisplayContainer.append(cityName);
        currentDisplayContainer.append(todayForecast);
        todayForecast.append(iconImg);
        currentDisplayContainer.append(temp);
        currentDisplayContainer.append(currentHumidity);
        currentDisplayContainer.append(currentWindSpeed);
        currentDisplayContainer.append(currentUVI);

        return

}

function setUVIndexClass(currentUVI, cityUVIndex){

    if (cityUVIndex <= 2.9 ){
    currentUVI.addClass('uvGreen')
    } else if (cityUVIndex >= 3 && cityUVIndex <= 5.9){
    currentUVI.addClass('uvYellow')
    } else if (cityUVIndex >= 6 && cityUVIndex <= 7.9){
        currentUVI.addClass('uvOrange')
    } else if (cityUVIndex >= 8 && cityUVIndex <= 10.9){
        currentUVI.addClass('uvRed')
    } else if (cityUVIndex >= 11) {
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
        dateStamp.addClass('col-12 noWrap');
        dateStamp.text(moment().add(index+1, 'days').format('dddd DD'));

        var iconImg = $(`<img src=http://openweathermap.org/img/wn/${item.icon}@2x.png>`);
        iconImg.addClass('col-sm-12');
        
        var dayTemp = $('<p>');
        dayTemp.addClass('col-12');
        dayTemp.text("Temperature: " + item.temp + " ??F");

        var dayOneHumidity = $('<p>');
        dayOneHumidity.addClass('col-12');
        dayOneHumidity.text("Humidity: " + item.humidity + "%");

        dayData.append(dateStamp);
        dayData.append(iconImg);
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




