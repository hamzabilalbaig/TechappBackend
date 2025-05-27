const multer = require("multer");
const { getFileExtension } = require("../utils/utils");
const fs = require("fs");
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const path="public/license"
    fs.mkdirSync(path, { recursive: true });
    cb(null, path);
  },
  filename: function (req, file, cb) {
    cb(null, `userLicense-${req.params.id}.${getFileExtension(file.originalname)}`);
  },
});

const UserLicenseUpload = multer({ storage: storage });

module.exports = UserLicenseUpload;
