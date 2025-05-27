const multer = require("multer");
const { getFileExtension } = require("../utils/utils");
const fs = require("fs");
const path = require("path");

function jn(req) {
  console.log(req);
}
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    jn(req);
    let path = `public/files/${req.body.folder_ID}/certifications`;

    fs.mkdirSync(path, { recursive: true });
    cb(null, path);
  },
  filename: function (req, file, cb) {
    console.log(cb);
    cb(null, req?.body?.fileName + path.extname(file.originalname));
  },
});

const certificationV2Upload = multer({ storage: storage });

module.exports = certificationV2Upload;
