const bcryptjs = require("bcryptjs");
var express = require("express");
const visitsController = require("../controllers/visits.controller");
var router = express.Router();
const auth = require("../middlewares/auth");
const ProfilePictureUpload = require("../middlewares/multer-visits");
const { sendSummeryReport } = require("../services/visits.services");

router.get("/visits", auth, visitsController.allVisits);
router.get("/visits/allTimes/:id", auth, visitsController.getAllTimeData);
router.post("/visits", auth, visitsController.addVisit);
router.put("/visits/:id", auth, visitsController.editVisit);
router.put(
  "/visits/captureTravelTimeIn/:id",
  auth,
  visitsController.captureTravelTimeIn
);
router.put(
  "/visits/captureTravelTimeOut/:id",
  auth,
  visitsController.captureTravelTimeOut
);
router.put("/visits/captureTimeIn/:id", auth, visitsController.captureTimeIn);
router.put("/visits/captureTimeOut/:id", auth, visitsController.captureTimeOut);
router.put(
  "/visits/captureReturnTravelTimeIn/:id",
  auth,
  visitsController.captureReturnTravelTimeIn
);
router.put(
  "/visits/captureReturnTravelTimeOut/:id",
  auth,
  visitsController.captureReturnTravelTimeOut
);
router.delete("/visits/:id", auth, visitsController.deleteVisit);
router.post("/visits/undoDelete/:id", auth, visitsController.UndoDeleteVisit);
router.get(
  "/visits/additionalPhotos/:id",
  auth,
  visitsController.GetVisitAdditionalPictures
);
router.put("/visits/delFile/:id", auth, visitsController.visitFileDelete);
router.post(
  "/visits/delFileFromFolder/:folder/:file",
  auth,
  visitsController.visitFileDelete
);

router.post(
  "/visits/AdditionalVisitFileDelete/:folder/:file/:id",
  auth,
  visitsController.AdditionalVisitFileDelete
);

router.get("/visits/file/:filename", visitsController.getFile);
router.get("/visits/:cid", auth, visitsController.getVisitByVisitID);
router.post("/visitsByUserID/:id", auth, visitsController.getAllVisitsByUserID);
router.get("/visitsforAdmin/", auth, visitsController.getAllVisitsForAdmin);
router.post(
  "/visits/resetVisitTimes/:id",
  auth,
  visitsController.resetVisitTimes
);

router.post(
  "/visits/image",
  ProfilePictureUpload.single("myFile"),
  visitsController.addPicture
);

router.post(
  "/visits/imageNew/:id",
  auth,
  ProfilePictureUpload.single("myFile"),
  visitsController.visitFileUpload
);

router.post("/visit/sendSummery/:id", auth, async (req, res, next) => {
  try {
    const result = await sendSummeryReport(req.params?.id, req.body, req.user);
    res.send(result);
  } catch (error) {
    res
      .status(500)
      .json(responseFormat(false, error, "error while sending summery report"));
    next(error);
  }
});

router.post("/visits/getvisitbypage", auth, visitsController.getVisitByPaging);

router.post("/visits/filerVisits", auth, visitsController.FilterVisits);

router.post("/visits/saveTotalAmount", auth, visitsController.saveTotalAmount);

router.post(
  "/visits/CalculateAmount/:id",
  auth,
  visitsController.CalculateAmount
);

router.post(
  "/visits/AddVisitFinancials",
  auth,
  visitsController.CreateVisitFinancials
);
router.get(
  "/visits/GetVisitFinancials/:id",
  auth,
  visitsController.GetVisitFinancialsByVisitID
);

router.get(
  "/visits/GetVisitsByTicketID/:id",
  auth,
  visitsController.GetVisitsByTicketID
);

router.get(
  "/visits/CheckSheduledVisits/:ticket_id/:scheduled_date",
  auth,
  visitsController.CheckSheduledVisits
);

router.post("/visits/addWeather", auth, visitsController.AddWeather);
router.post("/visits/getWeather", auth, visitsController.GetWeather);

module.exports = router;
