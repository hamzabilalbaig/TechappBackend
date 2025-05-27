const {
  DeleteFolder,
  DeleteFile,

  CreateFile,
  CreateFolder,
  GetAllFiles,
  GetAllFolders,
  DownloadFile,
  GetFolderById,
  GetFileById,

  FindFolder,
  FindFile,
  CheckDuplicateFile,
  CheckDuplicateFolder,
  AvaliableStorage,
  getRecyclyBinFiles,
  getRecyclyBinFolders,
  restoreFile,
  restoreFolder,
} = require("../services/file_manager.services");

const fs = require("fs");

exports.getAllFolders = async (req, res) => {
  try {
    const parent = req.params.id;

    const folders = await GetAllFolders(req.user, parent, req.params.sort);
    res.status(200).json({
      success: true,
      folders,
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      success: false,
      error,
    });
  }
};

exports.getAllFiles = async (req, res) => {
  try {
    const parent = req.params.id;
    const files = await GetAllFiles(req.user, parent, req.params.sort);
    res.status(200).json({
      success: true,
      files,
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      success: false,
      error,
    });
  }
};

exports.getAllRecycleBinFiles = async (req, res) => {
  try {
    const files = await getRecyclyBinFiles(req.user);
    res.status(200).json({
      success: true,
      files,
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      success: false,
      error,
    });
  }
};

exports.getAllRecycleBinFolders = async (req, res) => {
  try {
    const folders = await getRecyclyBinFolders(req.user);
    res.status(200).json({
      success: true,
      folders,
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      success: false,
      error,
    });
  }
};

exports.createFolder = async (req, res) => {
  try {
    const duplicates = await CheckDuplicateFolder(
      req.body.name,
      req.body.parent,
      req.user
    );

    if (duplicates.length !== 0) {
      res.status(400).json({
        success: false,
        message:
          "Folder with this name already exist, change the name and create again",
      });
    } else {
      const obj = {
        name: req.body.name,
        size: req.body.size,
        date_created: req.body.date_created,
        date_updated: req.body.date_updated,
        is_valid: true,
      };
      const folder = await CreateFolder(obj, req.user, req.body.parent);
      res.status(200).json({
        success: true,
        message: "Folder created successfully",
        folder,
      });
    }
  } catch (error) {
    console.log(error);
    res.status(400).json({
      success: false,
      message: "Internal server Error",
      error,
    });
  }
};

exports.createFile = async (req, res) => {
  try {
    const duplicates = await CheckDuplicateFile(
      req.body.file_name,
      req.body.folder_id,
      req.user
    );

    if (duplicates.length !== 0) {
      res.status(400).json({
        success: false,
        message:
          "File with this name already exist, change the name and upload again",
      });
    } else {
      const obj = {
        folder_id: req.body.folder_id,
        file_size: req.body.file_size,
        file_type: req.body.file_type,
        file_name: req.body.file_name,
        date_created: Date.now(),
        date_updated: req.body.date_updated,
        is_valid: true,
      };
      const file = await CreateFile(obj, req.user);
      res.status(200).json({
        success: true,
        message: "File uploaded successfully",
        file,
      });
    }
  } catch (error) {
    console.log(error);
    res.status(400).json({
      success: false,
      message: "Internal Server Error",
      error,
    });
  }
};

exports.updateFolder = async (req, res) => {
  try {
  } catch (error) {
    console.log(error);
    res.status(400).json({
      success: false,
      error,
    });
  }
};

exports.updateFile = async (req, res) => {
  try {
  } catch (error) {
    console.log(error);
    res.status(400).json({
      success: false,
      error,
    });
  }
};

exports.deleteFolder = async (req, res) => {
  try {
    const deleteCheck = await DeleteFolder(req.params.id, req.user);
    res.status(200).json({
      success: true,
      message: deleteCheck,
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      success: false,
      error,
    });
  }
};

exports.deleteFile = async (req, res) => {
  try {
    console.log(req.params.id);
    const deleteCheck = await DeleteFile(req.params.id, req.user);
    res.status(200).json({
      success: true,
      message: deleteCheck,
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      success: false,
      error,
      message: "Internal Server Error",
    });
  }
};

exports.downloadFile = async (req, res, next) => {
  try {
    DownloadFile(req, res, next);
  } catch (error) {
    console.log(error);
    res.status(400).json({
      success: false,
      error,
    });
  }
};

exports.getFolderById = async (req, res) => {
  try {
    console.log(req.params.id);
    const folder = await GetFolderById(req.params.id);
    res.status(200).json({
      success: true,
      folder,
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      success: false,
      error,
    });
  }
};

exports.getFileById = async (req, res) => {
  try {
    const file = await GetFileById(req.params.id);
    res.status(200).json({
      success: true,
      file,
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      success: false,
      error,
    });
  }
};

exports.findFolder = async (req, res) => {
  try {
    const folders = await FindFolder(req.body.name, req.user);
    res.status(200).json({
      success: true,
      folders,
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      success: false,
      error,
    });
  }
};

exports.findFile = async (req, res) => {
  try {
    const files = await FindFile(req.body.name, req.user);
    res.status(200).json({
      success: true,
      files,
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      success: false,
      error,
    });
  }
};

exports.getFilesStorageByUserId = async (req, res) => {
  try {
    const result = await AvaliableStorage(req.user.user_id);
    res.status(200).json({
      success: true,
      result,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error,
    });
  }
};

exports.restoreFileFromRecycleBing = async (req, res) => {
  try {
    const result = restoreFile(req.params.id);
    res.status(200).json({
      success: true,
      result,
      message: "File Restored Successfully",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error,
      message: "Internal Server Error",
    });
  }
};

exports.restoreFolderFromRecycleBing = async (req, res) => {
  try {
    const result = restoreFolder(req.params.id);
    res.status(200).json({
      success: true,
      result,
      message: "Folder Restored Successfully",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error,
      message: "Internal Server Error",
    });
  }
};
