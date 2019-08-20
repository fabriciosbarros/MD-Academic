
//GLOBAL VARIABLES DECLARATION
var latGlobal;
var lonGlobal;
var cityGlobal="";
var countryGlobal="";
var countryFlagGlobal="";
var currencyGlobal="";
var currencyIsoGlobal="";
var currencySymbolGlobal="";
var weatherTextGlobal="";
var minTempGlobal="";
var maxTempGlobal="";
var temperatureNow="";
var weatherNow="";
var iconWeather="";
var rateUSDCurr;
var rateCurrUSD;
var result;
var input="";
var contentNew="";
var newHistory="";
var todayDate="";
var fileEntryGlobal="";
var fileToCreate = "";



//CREATE ACCESS TO THE FILE SYSTEM, CREATE FILE AND GIVE PERMISSION TO THE APP TO WORK ON THE FILE
function tryingFile(){

    window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, fileSystemCallback, onError);
   
}

function fileSystemCallback(fs){

    // Name of the file I want to create
    fileToCreate="history.txt";
    // Opening/creating the file
    fs.root.getFile(fileToCreate, fileSystemOptionals, getFileCallback, onError);
}

var fileSystemOptionals = { create: true, exclusive: false };

function getFileCallback(fileEntry){

    fileEntryGlobal = fileEntry;

}

// USED IN "ONLOAD" PROPERTY OF HISTORY PAGE TO EXECUTE THE FUNCTION(S) AUTOMATICALLY
function onLoadHistory(){
    tryingFile();
}

// USED IN "ONLOAD" PROPERTY OF HISTORY PAGE TO EXECUTE THE FUNCTION(S) AUTOMATICALLY
function onLoad(){
    tryingFile();
    getLocation();
}

//GET LATITUDE AND LONGITUDE AND WRITE IN GLOBAL VARIABLE:
function getLocation(){
    navigator.geolocation.getCurrentPosition(success,onError);
}

function onError(msg){

    console.log(msg);
}

function success(position){
    latGlobal=position.coords.latitude;
    lonGlobal=position.coords.longitude;
    openCage();
    getWeather();
}

//EXTERNAL API USED TO GET ALL INFORMATION ABOUT CITY AND COUNTRY NAMES, CURRENCY AND FLAG
function openCage(){
    var http = new XMLHttpRequest();
    var api_key = '72f495ed8cf3463e95eeb2b429b1176a';
    var api = 'https://api.opencagedata.com/geocode/v1/json';

//declaration of variable url to get the data
var url = api
  + '?'
  +'&key='+encodeURIComponent(api_key)
  + '&q=' +encodeURIComponent(latGlobal)
  + ',' +encodeURIComponent(lonGlobal)
  + '&pretty=1'

http.open('GET', url);

    http.onreadystatechange = function (){
        if (http.readyState === 4 && http.status === 200){
        
        var response = http.responseText;

        response = JSON.parse(response);
        cityGlobal = response.results[0].components.city;
        countryGlobal = response.results[0].components.country;
        currencyGlobal = response.results[0].annotations.currency.name;
        currencyIsoGlobal = response.results[0].annotations.currency.iso_code;
        currencySymbolGlobal = response.results[0].annotations.currency.symbol;
        countryFlagGlobal = response.results[0].annotations.flag;
        document.getElementById('city').innerHTML=cityGlobal+"<br>"+countryGlobal+"<br>"+countryFlagGlobal;
        document.getElementById('countrycurrency').innerHTML="The currency used in "+countryGlobal+" is: <b>"+currencyGlobal;
        document.getElementById('outputLabel').innerHTML=currencyIsoGlobal;
        getRate();
    }};    
    http.send();
}

//EXTERNAL API USED TO GET THE EXCHANGE RATE OF THE CURRENCY FROM THE COUNTRY VISITED X DOLLARS
function getRate(){
    
        var http = new XMLHttpRequest();
        //declaration of variables to make an HTTP request
        var api_key = 'fd6175befc93c8f65e9ffa39442c359b';
        var api = 'http://apilayer.net/api/live';
        var url = api
        + '?'
        + 'access_key='
        +encodeURIComponent(api_key)
        + '&source='
        +encodeURIComponent("USD")
        + '&currencies='
        +encodeURIComponent(currencyIsoGlobal)
        + '&format=1';
      http.open('GET', url, true);
    
        http.onreadystatechange = function (){

            if (http.readyState === 4 && http.status === 200){
            var response = http.responseText;
            var responseJSON = JSON.parse(response);
            var curr = "USD"+currencyIsoGlobal;
            rateUSDCurr = responseJSON.quotes[curr];
            rateCurrUSD = 1/rateUSDCurr;
            document.getElementById('rateUSDCurr').innerHTML=currencySymbolGlobal+" "+rateUSDCurr.toFixed(2);
            document.getElementById('rateCurrUSD').innerHTML="US$ "+rateCurrUSD.toFixed(2);
            document.getElementById('actcurr').innerHTML=currencySymbolGlobal+" 1";
            }};
            http.send();
    }

    //EXTERNAL API USED TO GET WEATHER AND TEMPERATURE INFORMATION
    function getWeather(){
        var http = new XMLHttpRequest();
        //declaration of variables to make an HTTP request
        var api_key = '803e5d82bbb6f0c5a2a3f82b0995f32c';
        var api = 'https://api.darksky.net/forecast/';
        var url = api
        +encodeURIComponent(api_key)
        + '/'
        +encodeURIComponent(latGlobal)
        + ','
        +encodeURIComponent(lonGlobal)
        + '?units=si';
      http.open('GET', url, true);
      
      http.onreadystatechange = function (){

        if (http.readyState === 4 && http.status === 200){
    
        var response = http.responseText;
        var responseJSON = JSON.parse(response);
        weatherText=responseJSON.daily.summary;
        temperatureNow = responseJSON.currently.temperature.toFixed(0)+"°C";
        weatherNow = responseJSON.currently.summary;
        iconWeather = responseJSON.currently.icon;
        minTempGlobal=responseJSON.daily.data[0].temperatureMin.toFixed(0)+"°";
        maxTempGlobal=responseJSON.daily.data[0].temperatureMax.toFixed(0)+"°";
        document.getElementById('temperature').innerHTML=temperatureNow;
        document.getElementById('weathersimple').innerHTML=weatherNow;
        document.getElementById('weathertext').innerHTML=weatherText;
        document.getElementById('tempmin').innerHTML=minTempGlobal;
        document.getElementById('tempmax').innerHTML=maxTempGlobal;

        if (iconWeather == "rain"){
            document.getElementById('iconweather').innerHTML='<i class="wi wi-rain"></i>';
        }else if (iconWeather == "clear-day"){
            document.getElementById('iconweather').innerHTML='<i class="wi wi-forecast-io-clear-day"></i>';
        }else if (iconWeather == "clear-night"){
            document.getElementById('iconweather').innerHTML='<i class="wi wi-night-clear"></i>';
        }else if (iconWeather == "snow"){
            document.getElementById('iconweather').innerHTML='<i class="wi wi-snow"></i>';
        }else if (iconWeather == "sleet"){
            document.getElementById('iconweather').innerHTML='<i class="wi wi-sleet"></i>';
        }else if (iconWeather == "wind"){
            document.getElementById('iconweather').innerHTML='<i class="wi wi-strong-wind"></i>';
        }else if (iconWeather == "fog"){
            document.getElementById('iconweather').innerHTML='<i class="wi wi-fog"></i>';
        }else if (iconWeather == "cloudy"){
            document.getElementById('iconweather').innerHTML='<i class="wi wi-cloudy"></i>';
        }else if (iconWeather == "partly-cloudy-day"){
            document.getElementById('iconweather').innerHTML='<i class="wi wi-day-cloudy"></i>';
        }else if (iconWeather == "partly-cloudy-night"){
            document.getElementById('iconweather').innerHTML='<i class="wi wi-night-alt-partly-cloudy"></i>';
        }else{
            document.getElementById('iconweather').innerHTML='<i class="wi wi-thermometer"></i>';
        }

    }};
    http.send();
}

//FUNCTION USED TO CONVERT THE CURRENCY FROM DOLLARS TO THE LOCAL CURRENCY AND VICE-VERSA
function convert(){
    input= document.getElementById('input').value;
    var inputLabel = document.getElementById('inputLabel').textContent;
    var outputLabel = document.getElementById('outputLabel').textContent;
    if ((inputLabel == "USD") && (outputLabel == currencyIsoGlobal)){
        result = (input*rateUSDCurr).toFixed(2);
        document.getElementById('output').innerHTML=result;
    }else if (inputLabel == currencyIsoGlobal && outputLabel == "USD"){
        result = (input*rateCurrUSD).toFixed(2);
        document.getElementById('output').innerHTML=result;
    }else if ((inputLabel == currencyIsoGlobal && outputLabel == currencyIsoGlobal) || (inputLabel == "USD" && outputLabel == "USD")){
        document.getElementById('inputLabel').innerHTML="USD";
        document.getElementById('outputLabel').innerHTML=currencyIsoGlobal;
        result = (input*rateUSDCurr).toFixed(2);
        document.getElementById('output').innerHTML=result;
    }
}

//THIS FUNCTION IS CALLED BY A BUTTON THAT SWAP PLACES WITH THE CURRENCY TO ALLOW THE USER CONVERT BOTH WAYS
function swapCurrencies(){
    var inputLabel = document.getElementById('inputLabel').textContent;
    var outputLabel = document.getElementById('outputLabel').textContent;
    var tempSwap = inputLabel;
    inputLabel = outputLabel;
    outputLabel = tempSwap;
    document.getElementById('inputLabel').innerHTML=inputLabel;
    document.getElementById('outputLabel').innerHTML=outputLabel;
    convert();
}

//FUNCTION USED TO GET THE DATE AND TIME THAT WILL BE PLACED IN THE SAVED HISTORY
function getDate(){
var today = new Date();
var dd = today.getDate();
var mm = today.getMonth() + 1;
var hh = today.getHours();
var min = today.getMinutes();
var yyyy = today.getFullYear();
if (dd < 10) {
  dd = '0' + dd;
} 
if (mm < 10) {
  mm = '0' + mm;
}
if(hh < 10){
    hh = '0'+hh;
}
if (min < 10) {
    min = '0' + min;
  }  
todayDate = dd + '/' + mm + '/' + yyyy + " - "+hh+":"+min;

}
var contentGlobal;

//FUNCTION CALLED BY A BUTTON IN THE INDEX PAGE TO SAVE THE INFORMATION RELATED TO THE COUNTRY VISITED AND THE RESPECTIVE WEATHER
function saveHistory(){
    getDate();
    newHistory =
    "<br><h6 align=left>"+todayDate+"</h6>"
    +"<br><h6 align=left>Country visited: </h6>"+countryGlobal
    +"<br><h6 align=left>Currency in "+countryGlobal+": </h6>"+currencyGlobal
    +"<br><h6 align=left>City visited: </h6>"+cityGlobal
    +"<br><h6 align=left>The weather was: </h6>"+weatherNow
    +"<br><br>==================================<br>";
    writeFile(newHistory);
}


//FUNCTION CALLED BY THE FUNCTION SAVEHISTORY TO WRITE THE INFORMATION IN THE FILE KEEPING TRACK OF THE PREVIOUS RECORDS
function writeFile(newText) {
    
    // Get the file from the file entry
    fileEntryGlobal.file(function (file) {
        // Create the reader
        var reader = new FileReader();
        reader.readAsText(file);
    
        reader.onloadend = function() {

            contentGlobal = this.result;
            console.log("Successful file read.");
            console.log("file path: " + fileEntryGlobal.fullPath);

    newText = newText+contentGlobal;

    var dataObj = new Blob([newText], { type: 'text/plain' });

    // Create a FileWriter object for our FileEntry (log.txt).
    fileEntryGlobal.createWriter(function (fileWriter) {

        // If data object is not passed in,
        // create a new Blob instead.
        if (!dataObj) {
            dataObj = new Blob([newText], { type: 'text/plain' });
        }

        fileWriter.write(dataObj);

        fileWriter.onwriteend = function() {
            console.log("Successful file write...");
            document.getElementById('success').innerHTML="<b> Your trip was saved!</b>";
        };

        fileWriter.onerror = function (e) {
            console.log("Failed file write: " + e.toString());
            document.getElementById('success').innerHTML="<b> ERRROR MESSAGE: Your trip could not be saved. Please, try again.</b>";
        };    

    });
        };

    }, onError);
}

//FUNCTION CALLED BY A BUTTON IN THE HISTORY PAGE TO DELETE THE HISTORY FILE AND CREATE AN EMPTY ONE.
function clearHistory() {

    // remove the file
    fileEntryGlobal.remove(successDelete, fail);
    document.getElementById('historytext').innerHTML="<b> All your data was erased!</b>";
    tryingFile();
}

function successDelete(entry) {
    console.log("Removal succeeded.");
}

function fail(error) {
    console.log('Error removing file: ' + error.code);
}

//FUNCTION CALLED BY A BUTTON IN THE HISTORY PAGE TO SHOW THE CONTENT OF THE HISTORY FILE
function readFromFileHistory(){

        // Get the file from the file entry
        fileEntryGlobal.file(function (file) {
            // Create the reader
            var reader = new FileReader();
            reader.readAsText(file);
        
            reader.onloadend = function() {
    
                console.log("Successful file read: " + this.result);
                console.log("file path: " + fileEntryGlobal.fullPath);
                contentGlobal = this.result;

                if(contentGlobal.length == 0){
                    document.getElementById('historytext').innerHTML="You have no history at the moment";
                }else{
                    document.getElementById('historytext').innerHTML=contentGlobal;
                }
            };
    
        }, onError);
}

//FUNCTION USED TO GET THE LOCATION FOR THE MAP PAGE AND PASSES THE INFORMATION OF LATITUDE AND LONGITUDE FOR THE INITMAP FUNCTION
function getLocationMap(){
    navigator.geolocation.getCurrentPosition(successMap,onError);
}

function successMap(position){
    latGlobal=position.coords.latitude;
    lonGlobal=position.coords.longitude;
    initMap(latGlobal, lonGlobal);
}

var map;

function initMap(lat,lon) {
    var currentLocation = {lat: lat, lng: lon};
    // The location
    // The map, centered
    map = new google.maps.Map(document.getElementById('map'), {zoom: 18, center: currentLocation});
    // The marker, positioned at Uluru
    var marker = new google.maps.Marker({position: currentLocation, map: map});
    
  }