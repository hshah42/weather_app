Weather Forecast Website

To run the website on the local machine, follow the following commands:

Prerequisites:
1. Install NodeJs on your local machine with a version 8 or above.
2. If a version below 8 is installed, install nvm to change the version.
3. After installing NodeJS, install npm with version 5.6 or above

Steps to run:
1. Change the api key in app.properties
2. npm install
3. npm start

The website is also live at http://34.73.204.225:3000.

It automatically determines the location based on the ip of the user in the request. Default city is set to New York if no data is obtained.
User can search and get weather conditions of different cities by using the search bar. Displays an error if city does not exist or any issue in getting the data.
Graph shows 2 types of data - hourly forcast for 3 hour interval and by a days interval for the next 5 days.
Background of the website is determined based on the current weather conditions.

The app will be running at port 3000.
