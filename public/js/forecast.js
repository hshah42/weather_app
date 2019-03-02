var ctx = document.getElementById("hourlyChart").getContext('2d');
var times = document.getElementById("hourlyTime").value;
var temperatures = document.getElementById("hourlyTemperature").value;

var ctxDaily = document.getElementById("dailyChart").getContext('2d');
var timesDaily = document.getElementById("dailyTimes").value;
var temperaturesDaily = document.getElementById("dailyTemperatures").value;

var hourlyChart = new Chart(ctx, {
    type: 'line',
    data: {
        labels: [],
        datasets: [{
            label: 'Temperature over Time',
            data: [],
            fill: false,
            backgroundColor: [
                'rgba(255, 99, 132, 0.2)'
            ],
            borderColor: [
                'rgba(255,99,132,1)'
            ],
            borderWidth: 1
        }]
    }
});

var dailyChart = new Chart(ctxDaily, {
    type: 'line',
    data: {
        labels: [],
        datasets: [{
            label: 'Temperature over Time',
            data: [],
            fill: false,
            backgroundColor: [
                'rgba(255, 99, 132, 0.2)'
            ],
            borderColor: [
                'rgba(255,99,132,1)'
            ],
            borderWidth: 1
        }]
    }
});

createChart(hourlyChart, times, temperatures);
createChart(dailyChart, timesDaily, temperaturesDaily);

function createChart(chart, times, temperatures)
{
    var timeArray = times.split(",");
    var temperatureArray = temperatures.split(",");

    for(let i in temperatureArray)
    {
        addData(chart, timeArray[i], temperatureArray[i]);
    }
}

function addData(chart, label, data) {
    chart.data.labels.push(label);
    chart.data.datasets.forEach((dataset) => {
        dataset.data.push(data);
    });
    chart.update();
}