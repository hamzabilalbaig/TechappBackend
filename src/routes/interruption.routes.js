var express = require("express");
const InterruptionController = require("../controllers/interruption.controller");
var router = express.Router();
const auth = require("../middlewares/auth");
const multer = require("multer");

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.get("/Interruptions/:id", auth, InterruptionController.allInterruptions);
router.get("/Interruptions/search/:code", auth, InterruptionController.search);
router.post("/Interruptions/filter", auth, InterruptionController.filter);
router.get(
  "/getUnresolvedInterruptionsCount/:id",
  auth,
  InterruptionController.getUnresolvedInterruptionsCount
);
router.get(
  "/GetAllInterruptionsForTable",
  auth,
  InterruptionController.allInterruptionsForTable
);
router.get(
  "/InterruptionsById/:id",
  auth,
  InterruptionController.getInterruptionsById
);
router.post("/Interruptions/add", auth, InterruptionController.addInterruption);
router.post(
  "/Interruptionscsvtotable",
  upload.single("csvFile"),
  InterruptionController.CSVInterruption
);
router.put("/Interruptions/:id", auth, InterruptionController.editInterruption);
router.delete(
  "/Interruptions/:id",
  auth,
  InterruptionController.deleteInterruption
);
router.get(
  "/Interruptions/restore/:id",
  auth,
  InterruptionController.restoreInterruption
);

module.exports = router;
