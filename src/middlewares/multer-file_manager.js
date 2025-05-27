// `file-${req.user.user_id}-${file.originalname}-${
//   req.body.folder_id
// }.${getFileExtension(file.originalname)}`

const multer = require("multer");
const fs = require("fs");
const path = require("path");
const { getFileExtension } = require("../utils/utils");
function mul(req, file) {
  console.log(req.body);
  console.log(file);
}
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    console.log("in dest");
    mul(req, file);
    let path = `public/files/user-${req.user.user_id}`;

    fs.mkdirSync(path, { recursive: true });
    cb(null, path);
  },
  filename: function (req, file, cb) {
    cb(
      null,
      `file-${req.user.user_id}-${req.body.file_name}-${
        req.body.folder_id
      }.${getFileExtension(file.originalname)}`
    );
  },
});

const fileManagerUpload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    const allowedMimes = [
      "image/jpg",
      "image/jpeg",
      "image/png",
      "image/gif",
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "application/vnd.openxmlformats-officedocument.presentationml.presentation",
    ];

    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Invalid file type"));
    }
  },
});

module.exports = fileManagerUpload;
