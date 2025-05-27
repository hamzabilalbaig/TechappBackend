const helmet = require("helmet");
const compression = require("compression");

module.exports = function (app) {
  app.use(helmet({crossOriginResourcePolicy: false}));
  app.use(compression());
};
