const multer = require("multer");
const { getFileExtension } = require("../utils/utils");
const fs = require("fs");
const path = require("path");
function mul(req, file) {
  console.log(req.body);
  console.log(file);
}
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    mul(req, file);
    let path = `public/speedTestImages`;
    fs.mkdirSync(path, { recursive: true });
    cb(null, path);
  },
  filename: function (req, file, cb) {
    console.log(req);
    cb(null, req?.body?.name);
  },
});

const speedTestImageUpload = multer({ storage: storage });

module.exports = speedTestImageUpload;
