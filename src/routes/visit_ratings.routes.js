var express = require("express");
const {
  createUpdateRating,
  getRating,
  getRatingofFE,
} = require("../controllers/visit_ratings.controller");
var router = express.Router();
const auth = require("../middlewares/auth");

router.post("/visits_rating", createUpdateRating);
router.get("/visits_rating/:id", getRating);
router.get("/ratingofFE/:id", getRatingofFE);

module.exports = router;
