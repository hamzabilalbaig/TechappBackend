const CertificationController = require("../controllers/certification.controller");
var express = require("express");
const certificationUpload = require("../middlewares/multer-certification");
var router = express.Router();
const auth = require("../middlewares/auth");
const { route } = require("./user.routes");

router.get("/nextID", CertificationController.nextID);
router.post(
  "/certification",
  //auth,
  CertificationController.createNewCertification
);
router.get(
  "/certifications",
  //auth,
  CertificationController.getAllCertifications
);
router.delete(
  "/certification/:id",
  //auth,
  CertificationController.deleteCertification
);

router.delete(
  "/certificate/:id",
  //auth,
  CertificationController.deleteCertificate
);
router.put(
  "/certification/:id",
  //auth,
  CertificationController.updateCertification
);
router.post(
  "/certification/saveCert",
  certificationUpload.single("myFile"),
  CertificationController.saveCertificate
);
router.get(
  "/certificates/:cid/:name",
  //auth,
  CertificationController.getCertificateByCertificationID
);
router.get(
  "/certificatescheckingemail",
  //auth,
  CertificationController.checking
);

router.get(
  "/certifications/:cid",
  //auth,
  CertificationController.getCertificationByCertificationID
);

router.get(
  "/certificationsByUID/:cid",
  //auth,
  CertificationController.getCertificationByUSERID
);
router.get(
  "/certificates/file/:folder_ID/:filename",
  CertificationController.getFile
);

router.post(
  "/certifications/getAllCertificationsByPagination",
  //auth,
  CertificationController.getAllCertificationsByPagination
);

router.post(
  "/certifications/filterCertifications",
  //auth,
  CertificationController.FilterCertification
);

module.exports = router;
