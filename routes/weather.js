const express = require("express");
const axios = require("axios");
const router = express.Router();
const geoip = require("geoip-lite");

const apiKey = "41eb812a594005f48d77495b29d05ec8"
const defaultCity = "New York";

router.get("/", async (req, res) => {
    
    let name;
    let locationData =  geoip.lookup(req.ip);

    if(req.query.search)
    {
        name = req.query.search;
    }
    else
    {
       name = defaultCity;
    }

    try
    {
        let weatherAPI;
        
        if(locationData && locationData.ll)
        {
            weatherAPI = await axios.get("http://api.openweathermap.org/data/2.5/weather?APPID="+ apiKey +"&units=imperial&lat=" + locationData.ll[0] + "&lon="+ locationData.ll[1]);
        }
        else
        {
            weatherAPI = await axios.get("http://api.openweathermap.org/data/2.5/weather?APPID="+ apiKey +"&units=imperial&q=" + name);
        }
        
        let result = await getResult(weatherAPI, name);
        res.render("layouts/main", result);
    }
    catch(e)
    {
        if(e.response && e.response.status === 404)
        {
            let weatherAPI = await axios.get("http://api.openweathermap.org/data/2.5/weather?APPID="+ apiKey +"&units=imperial&q=" + defaultCity);
            let result = await getResult(weatherAPI, defaultCity);
            result["hasError"] = true;
            result["error"] = "City not found"
            res.render("layouts/main", result);
        }
        else
        {
            res.status(500).render("layouts/main", {hasError: true, error : "error in fetching data"});
        }
    }
});

async function getResult(weatherAPI, name)
{
    let currentWeather;
    let type;
    let forecast;

    if(weatherAPI.status === 200)
    {
        let weatherData = weatherAPI.data;
        currentWeather = await getCurrentWeather(weatherData);
        type = await getBackground(weatherData.weather[0].id);
        forecast = await getForecast(name);
    }

    return {
        current: currentWeather, 
        background: type, 
        forecast: forecast
    };
}

async function getCurrentWeather(weatherData)
{    
    let weatherDescJoin = "";

    for(let i in weatherData.weather)
    {
        weatherDescJoin = weatherDescJoin + weatherData.weather[i].description + " ";
    }

    let result = {
        "cityName": weatherData.name,
        "countryName": weatherData.sys.country,
        "humidity": weatherData.main.humidity,
        "pressure": weatherData.main.pressure,
        "currentTemperature": weatherData.main.temp,
        "maxTemperature": weatherData.main.temp_max,
        "minTemperature": weatherData.main.temp_min,
        "weather": weatherData.weather,
        "windSpeed": weatherData.wind.speed,
        "windDirection": weatherData.wind.deg,
        "weatherDesc": weatherDescJoin
    }

    return result;
}

async function getForecast(name)
{
    try
    {
        let weatherAPI = await axios.get("http://api.openweathermap.org/data/2.5/forecast?APPID="+ apiKey +"&units=imperial&q=" + name);
        let weatherForcastList = weatherAPI.data.list;
        
        let hourlyForecast = await getHourlyForecast(weatherForcastList);
        let dailyForecast = await getDailyForecast(weatherForcastList);

        let dailyTemperatures = dailyForecast.temperature;
        let dailyTimes = dailyForecast.time;

        let hourlyTemperature = hourlyForecast.temperature;
        let hourlyTime = hourlyForecast.time;

        return {
            dailyTemperatures: dailyTemperatures,
            dailyTimes: dailyTimes,
            hourlyTemperature: hourlyTemperature,
            hourlyTime: hourlyTime
        }
    }
    catch(e)
    {
        throw "Error in fetching forcast";
    }
}

async function getHourlyForecast(weatherData)
{
    let hourlyData = weatherData.slice(0, 10);
    let temperatureResult = new Array();
    let timeResult = new Array();

    for(let i in hourlyData)
    {
        let time = hourlyData[i].dt_txt.split(" ")[1];
        let temperature = hourlyData[i].main.temp;

        temperatureResult.push(temperature);
        timeResult.push(time);
    }

    return {
        temperature: temperatureResult,
        time: timeResult
    };
}

async function getDailyForecast(weatherData)
{
    let temperatureResult = new Array();
    let timeResult = new Array();

    for(let i = 0; i < weatherData.length; i+=8)
    {
        let time = weatherData[i].dt_txt.split(" ")[0];
        let temperature = weatherData[i].main.temp;

        temperatureResult.push(temperature);
        timeResult.push(time);
    }

    return {
        temperature: temperatureResult,
        time: timeResult
    };
}

async function getBackground(id)
{
    if(id >= 200 && id <= 232)
    {
        return "thunderstorm";
    }
    else if(id >= 300 && id <= 321)
    {
        return "drizzle";
    }
    else if(id >= 500 && id <= 531)
    {
        return "rain";
    }
    else if(id >= 600 && id <= 622)
    {
        return "snow";
    }
    else if(id >= 701 && id <= 781)
    {
        return "atmosphere";
    }
    else if(id === 800)
    {
        return "clear";
    }
    else if(id >= 801 && id <= 804)
    {
        return "clouds";
    }
    else
    {
        return "default";
    }
}

module.exports = router;