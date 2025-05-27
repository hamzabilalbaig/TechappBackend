var express = require("express");
const tradesController = require("../controllers/trades.controller");
var router = express.Router();
const auth = require("../middlewares/auth");

router.get("/trades", auth, tradesController.allTrades);
router.post("/trades", auth, tradesController.createTrade);
router.put("/trades/:id", auth, tradesController.updateTrade);
router.delete("/trades/:id", auth, tradesController.removeTrade);
router.get("/usertrades/:id", auth, tradesController.geAlltUserTrades);
router.get("/tradestypes/:id/:certID", tradesController.geAllTradeTypes);
router.get(
  "/certtypeproviders/:id",
  auth,
  tradesController.geAllCertTypeProviders
);

module.exports = router;
