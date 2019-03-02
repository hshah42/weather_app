const weatherRoute = require("./weather");
const path = require("path");

const constructorMethod = app => {
  app.use("/weather", weatherRoute);

  app.get("*", (req, res) => {
    res.render("layouts/main");
  });
};

module.exports = constructorMethod;