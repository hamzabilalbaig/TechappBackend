var express = require("express");
const {
  getAllFolders,
  getAllFiles,
  createFolder,
  createFile,
  deleteFile,
  deleteFolder,
  downloadFile,
  getFolderById,
  getFileById,
  findFolder,
  findFile,
  getFilesStorageByUserId,
  getAllRecycleBinFiles,
  getAllRecycleBinFolders,
  restoreFileFromRecycleBing,
  restoreFolderFromRecycleBing,
} = require("../controllers/file_manager.controller");

var router = express.Router();
const auth = require("../middlewares/auth");
const fileManagerUpload = require("../middlewares/multer-file_manager");

router.get("/file_manager/folder/:id/:sort", auth, getAllFolders);
router.get("/file_manager/files/:id/:sort", auth, getAllFiles);
router.get("/file_manager/folderbyId/:id", auth, getFolderById);
// router.get("/file_manager/files/byId/:id", auth, getFileById);
router.get("/file_manager/files/:filename/:folder_id/:id", downloadFile);
router.get("/file_manager/avaliableSpace/", auth, getFilesStorageByUserId);
router.get("/file_manager/getAllRecycleBinFiles/", auth, getAllRecycleBinFiles);

router.get(
  "/file_manager/getAllRecycleBinFolders/",
  auth,
  getAllRecycleBinFolders
);
router.post("/file_manager/findFolders", auth, findFolder);
router.post("/file_manager/findFiles/", auth, findFile);
router.post("/file_manager/folder", auth, createFolder);
router.post("/file_manager/file", [
  auth,
  fileManagerUpload.single("myFile"),
  createFile,
]);
router.put(
  "/file_manager/restoreFileFromRecycleBing/:id",
  auth,
  restoreFileFromRecycleBing
);
router.put(
  "/file_manager/restoreFolderFromRecycleBing/:id",
  auth,
  restoreFolderFromRecycleBing
);
router.delete("/file_manager/folder/:id", auth, deleteFolder);
router.delete("/file_manager/file/:id", auth, deleteFile);

module.exports = router;
