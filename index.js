const Joi = require("joi");
const compression = require("compression");
require("dotenv").config();
const path = require("path");
const https = require("https");
const http = require("http");

const express = require("express");

const app = express();
const { sequelizeServer } = require("./src/configs/sequelize.config");
const { Server } = require("socket.io");

//const { QueryTypes } = require("sequelize/types");

app.use(compression());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use(function (req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Content-Type, Access-Control-Allow-Headers,token"
  );

  next();
});
var userRoutes = require("./src/routes/user.routes");
var siteRoutes = require("./src/routes/site.routes");
var rolesRoutes = require("./src/routes/roles.routes");
var permissionsRoutes = require("./src/routes/permissions.routes");
var projectsRoutes = require("./src/routes/projects.routes");
var ticketsRoute = require("./src/routes/tickets.routes");
var master_code_routes = require("./src/routes/master_code.routes");
var visits_route = require("./src/routes/visit.routes");
var issues_route = require("./src/routes/issues.routes");
var certification_route = require("./src/routes/certification.routes");
var customer_route = require("./src/routes/customer.routes");
var vendors_route = require("./src/routes/vendors.routes");
var driver_code_route = require("./src/routes/driver_code.routes");
var speed_test = require("./src/routes/speed_test.routes");
var location = require("./src/routes/location.routes");
var file_manager_routes = require("./src/routes/file_manager.routes");
var form_access_control_routes = require("./src/routes/form_access_control.routes");
var dashboard_routes = require("./src/routes/dashboard.routes");
var visit_rating = require("./src/routes/visit_ratings.routes");
var Interruption_routes = require("./src/routes/interruption.routes");
var trades_routes = require("./src/routes/trades.routes");
var cert_category_routes = require("./src/routes/cert_category.routes");
var cert_type_routes = require("./src/routes/cert_type.routes");
var cert_provider_routes = require("./src/routes/cert_provider.routes");
var certification_master_routes = require("./src/routes/certification_master.routes");
var notification_routes = require("./src/routes/notifications.routes");
var fcc_routes = require("./src/routes/fcc.routes");
var checklist_routes = require("./src/routes/checklist.routes");
var initModels = require("./src/models/init-models");
const {
  getQuickbaseTableFields,
} = require("./src/services/quickbase.services");
const { responseFormat } = require("./src/utils/utils");
var models = initModels(sequelizeServer);
var assetsPath = path.join(__dirname, "/public"); //path.resolve(`${__dirname}../../../public/`)
app.use(express.static("public"));
app.get("/api/oo", (req, res, next) => {
  console.log(path.resolve(__dirname, "public"));
  next();
});

app.get("/api/qbtable/:table_id", async (req, res, next) => {
  await getQuickbaseTableFields(req.params.table_id)
    .then((result) => {
      res.json(responseFormat(true, result, "QB Table Fields"));
    })
    .catch((ex) => {
      res
        .status(500)
        .json(
          responseFormat(false, ex, "Unexpected error while getting fields")
        );
      next(ex);
    });
});
app.use(function (req, res, next) {
  res.set("Cache-Control", "no-cache, no-store, must-revalidate, max-age=0");
  res.set("Pragma", "no-cache");
  res.set("Expires", 0);
  next();
});

var httpServer = null;
// if (process.env.ENVIRONMENT_TYPE === "Production") {
//   httpServer = https.createServer(app);
// } else {
//   httpServer = http.createServer(app);
// }
httpServer = http.createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: process.env.CLIENT_APP_BASE_URL,
  },
});
app.use((req, res, next) => {
  req.io = io;
  next();
});
io.on("connection", (socket) => {
  console.log(socket);
  socket.on("tell", (msg) => {
    socket.broadcast.emit("foo", msg);
  });
  socket.on("message", (data) => {
    console.log("Received message:", data);
    // Broadcast the message to all connected clients except the sender
    socket.broadcast.emit("message", data);
  });

  socket.on("getvisitcount", (msg) => {
    socket.broadcast.emit("visitCount", msg);
  });
});

app.post("/api/notify", (req, res) => {
  console.log(req.body);
  io.emit("notification", req.body);
  res.json({ success: true });
});
app.use("/api", userRoutes);
app.use("/api", siteRoutes);
app.use("/api", rolesRoutes);
app.use("/api", permissionsRoutes);
app.use("/api", projectsRoutes);
app.use("/api", ticketsRoute);
app.use("/api", master_code_routes);
app.use("/api", visits_route);
app.use("/api", issues_route);
app.use("/api", certification_route);
app.use("/api", vendors_route);
app.use("/api", customer_route);
app.use("/api", driver_code_route);
app.use("/api", speed_test);
app.use("/api", location);
app.use("/api", file_manager_routes);
app.use("/api", form_access_control_routes);
app.use("/api", dashboard_routes);
app.use("/api", visit_rating);
app.use("/api", Interruption_routes);
app.use("/api", trades_routes);
app.use("/api", cert_category_routes);
app.use("/api", cert_type_routes);
app.use("/api", cert_provider_routes);
app.use("/api", certification_master_routes);
app.use("/api", notification_routes);
app.use("/api", fcc_routes);
app.use("/api", checklist_routes);
require("./prod")(app);
const port = process.env.PORT || 3001;

// console.log = function() {}

httpServer.listen(port, () => {
  console.log(`listening on port ${port}`);
});
//https.createServer({},app).listen(port, () => console.log(`listening on port ${port}`));
//app.listen(port, () => console.log(`listening on port ${port}`));

module.exports = app;
