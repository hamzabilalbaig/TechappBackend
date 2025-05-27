var express = require("express");
const locationController = require("../controllers/location.controller");
var router = express.Router();
const auth = require("../middlewares/auth");


router.get('/countries',locationController.getAllCountriesDropdown)
router.get('/states/:country',locationController.getAllStatesDropdown)
router.get('/cities/:country/:state',locationController.getAllCititesDropdown)
router.get('/uscounties/:state',locationController.getAllUSCountiesDropdown)



module.exports = router;