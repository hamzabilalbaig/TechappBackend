var express = require("express");

const speedTestTaskController = require("../controllers/speed_test.controller");
var router = express.Router();
const auth = require("../middlewares/auth");
const speedTestImageUpload = require("../middlewares/multer-speedTest");

// router.get("/speedTestTasks", auth, speedTestTaskController.allspeedTestTasks);
router.get(
  "/speedTest/speedTestTasksByTicket/:id",
  auth,
  speedTestTaskController.getSpeedTestTasksByTicket
);
router.get(
  "/speedTest/speedTestTasksByVisit/:id",
  auth,
  speedTestTaskController.getSpeedTestTasksByVisit
);
router.post(
  "/speedTest/speedTestTask",
  [auth, speedTestImageUpload.single("myFile")],
  speedTestTaskController.createSpeedTestTask
);

router.post(
  "/speedTest/editServiceMode/:id",
  speedTestImageUpload.single("myFile"),
  speedTestTaskController.editServiceMode
);
router.post(
  "/speedTest/editScreenShot/:id",
  speedTestImageUpload.single("myFile"),
  speedTestTaskController.editScreenShot
);

router.post(
  "/speedTest/deleteTask/:id",
  speedTestTaskController.deleteTask
);
// router.put("/speedTestTasks/:id", auth, speedTestTaskController.editspeedTestTask);
// router.delete("/speedTestTasks/:id", auth, speedTestTaskController.deletespeedTestTask);
// //router.get("/speedTestTasks/:id", auth, speedTestTaskController.deletespeedTestTask);

module.exports = router;
