var express = require("express");
const fccController = require("../controllers/fcc.controller");
var router = express.Router();
const auth = require("../middlewares/auth");


router.post("/findNearestLocations", fccController.nearestLocations);

module.exports = router;