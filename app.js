const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const static = express.static(__dirname + "/public");

const propertiesReader = require("properties-reader");
const weather = require("./routes/weather");
const properties = propertiesReader('app.properties');

weather.setApiKey(properties.get("api.key"));

const configRoutes = require("./routes");
const exphbs = require("express-handlebars");

app.use("/public", static);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());

//app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.engine("handlebars", exphbs());
app.set("view engine", "handlebars");

configRoutes(app);

app.listen(3000, () => {
  console.log("We've now got a server!");
});