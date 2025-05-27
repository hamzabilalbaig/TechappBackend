const multer = require("multer");
const { getFileExtension } = require("../utils/utils");

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/images/profile");
  },
  filename: function (req, file, cb) {
    cb(null, `userPic-${req.params.id}.${getFileExtension(file.originalname)}`);
  },
});

const ProfilePictureUpload = multer({ storage: storage });

module.exports = ProfilePictureUpload;
