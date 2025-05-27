const multer = require("multer");
const { getFileExtension } = require("../utils/utils");
const fs = require("fs");
const path = require("path");
// const { createCanvas, loadImage } = require("canvas");
function mul(req, file) {
  console.log(req.body);
  console.log(file);
}
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    mul(req, file);
    let path = `public/visits/${req.body.folder_ID}`;
    fs.mkdirSync(path, { recursive: true });
    cb(null, path);
  },
  filename: function (req, file, cb) {
    console.log(req);
    const fileName = req?.body?.name + path.extname(file.originalname);
    cb(null, fileName);
  },
});

const ProfilePictureUpload = multer({ storage: storage });

module.exports = ProfilePictureUpload;
