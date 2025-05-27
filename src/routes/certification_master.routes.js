var express = require("express");
const certificationMasterController = require("../controllers/certification_master.controller");
var router = express.Router();
const auth = require("../middlewares/auth");
const certificationV2Upload = require("../middlewares/multer-certificationV2");

router.get(
  "/certification_masters",
  auth,
  certificationMasterController.allCertificationMasters
);
// router.post(
//   "/certification_masters",
//   auth,
//   certificationMasterController.createCertificationMaster
// );
// router.put(
//   "/certification_masters/:id",
//   auth,
//   certificationMasterController.updateCertificationMaster
// );
router.delete(
  "/certification_masters/:id",
  auth,
  certificationMasterController.removeCertificationMaster
);
router.get(
  "/certification_masters/:id",
  auth,
  certificationMasterController.certificationMasterByID
);
router.get(
  "/certification_masters/certbyuser/:id",
  auth,
  certificationMasterController.userCertificationMasters
);
router.post(
  "/certification_masters/certv2bypaging",
  auth,
  certificationMasterController.allCertificationMastersByPagination
);
router.post(
  "/certification_masters/filterCerts",
  auth,
  certificationMasterController.filterCertificationMasters
);
router.get(
  "/certification_masters/userCertificationCategories/:id",

  certificationMasterController.userCertificationCategories
);
router.get(
  "/certification_masters/userCertsByTypeID/:id/:user_id",

  certificationMasterController.userCertsByTypeID
);

router.post(
  "/certification_masters/userCertsByTypeIDs/:user_id",

  certificationMasterController.userCertsByTypeIDs
);

router.post(
  "/certification_masters/getCertificationPercentage/",

  certificationMasterController.getCertificationPercentage
);
router.post(
  "/certification_masters/getBasic4CertificationPercentage/",

  certificationMasterController.getBasic4CertificationPercentage
);
router.get(
  "/certificate_master/file/:folder_ID/:filename",
  certificationMasterController.getFile
);

router.post(
  "/certification_masters/editCert/:id",
  certificationV2Upload.single("myFile"),
  certificationMasterController.updateCertificationMaster
);
router.post(
  "/certification_masters/addCert",
  certificationV2Upload.single("myFile"),
  certificationMasterController.createCertificationMaster
);

module.exports = router;
