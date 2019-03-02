const weatherRoute = require("./weather");
const path = require("path");

const constructorMethod = app => {
  app.use("*", weatherRoute.router);
};

module.exports = constructorMethod;