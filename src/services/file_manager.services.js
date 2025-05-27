const { sequelizeServer } = require("../configs/sequelize.config");
const { fromDir } = require("../utils/utils");
const { Op } = require("sequelize");
const fs = require("fs");
const { getFileExtension } = require("../utils/utils");

async function GetAllFolders(user, parent, sort) {
  try {
    if (parent === undefined) {
      parent = null;
    }
    const { user_id } = user;
    const check = sort === "true" ? true : false;
    if (check) {
      const folders = sequelizeServer.models.user_folder.findAll({
        where: { user_id, parent, is_valid: true },
        order: [["date_created", "ASC"]],
      });
      return folders;
    } else {
      const folders = sequelizeServer.models.user_folder.findAll({
        where: { user_id, parent, is_valid: true },
        order: [["date_created", "DESC"]],
      });
      return folders;
    }
  } catch (error) {
    return error;
  }
}

async function GetAllFiles(user, folder_id, sort) {
  try {
    const { user_id } = user;
    const check = sort === "true" ? true : false;
    if (check) {
      const files = sequelizeServer.models.user_files.findAll({
        where: { user_id, folder_id, is_valid: true },
        order: [["date_created", "ASC"]],
      });
      return files;
    } else {
      console.log("dsc");

      const files = sequelizeServer.models.user_files.findAll({
        where: { user_id, folder_id, is_valid: true },
        order: [["date_created", "DESC"]],
      });
      return files;
    }
  } catch (error) {
    return error;
  }
}

async function GetFolderById(id) {
  try {
    const folder = sequelizeServer.models.user_folder.findAll({
      where: { id },
    });
    return folder;
  } catch (error) {
    return error;
  }
}

async function GetFileById(id) {
  try {
    const files = sequelizeServer.models.user_files.findAll({
      where: { id, is_valid: true },
    });
    return files;
  } catch (error) {
    return error;
  }
}

async function CreateFolder(folder, user, parent) {
  try {
    if (parent === undefined) {
      parent = 0;
    }
    const obj = Object.assign(folder, { user_id: user.user_id, parent });

    const result = sequelizeServer.models.user_folder.create(obj);
    return result;
  } catch (error) {
    return error;
  }
}

async function CreateFile(file, user) {
  try {
    const obj = Object.assign(file, { user_id: user.user_id });
    const result = sequelizeServer.models.user_files.create(obj);
    return result;
  } catch (error) {
    return error;
  }
}

async function CheckDuplicateFile(file_name, folder_id, user) {
  try {
    const result = sequelizeServer.models.user_files.findAll({
      where: { file_name, folder_id, user_id: user.user_id },
    });
    return result;
  } catch (error) {
    return error;
  }
}
async function CheckDuplicateFolder(name, parent, user) {
  try {
    const result = sequelizeServer.models.user_folder.findAll({
      where: { name, parent, user_id: user.user_id },
    });
    return result;
  } catch (error) {
    return error;
  }
}
async function FindFolder(name, user) {
  try {
    const folder = sequelizeServer.models.user_folder.findAll({
      where: {
        // name,
        [Op.or]: [{ name: { [Op.like]: `%${name}%` } }],
        user_id: user.user_id,
      },
    });

    return folder;
  } catch (error) {
    return error;
  }
}

async function FindFile(file_name, user) {
  try {
    const files = sequelizeServer.models.user_files.findAll({
      // where: { file_name, user_id: user.user_id },
      where: {
        [Op.or]: [{ file_name: { [Op.like]: `%${file_name}%` } }],
        user_id: user.user_id,
      },
    });
    return files;
  } catch (error) {
    return error;
  }
}

// async function UpdateFolder(folder, user, id) {
//   try {
//     const obj = Object.assign(folder, { user_id: user.user_id });

//     const result = sequelizeServer.models.user_folder.update(obj, {
//       where: { id },
//     });
//     return result;
//   } catch (error) {
//     return error;
//   }
// }

// async function UpdateFile(file, id) {
//   try {
//     const result = sequelizeServer.models.user_files.update(file, {
//       where: { id },
//     });
//     return result;
//   } catch (error) {
//     return error;
//   }
// }

async function DeleteFile(id, user) {
  try {
    const file = await sequelizeServer.models.user_files.findOne({
      where: { id },
    });

    if (file.is_valid === true) {
      await sequelizeServer.models.user_files.update(
        { is_valid: false },
        {
          where: { id },
        }
      );
      return "File moved to Recycle Bin";
    } else {
      fs.unlink(
        `public/files/user-${user.user_id}/file-${user.user_id}-${
          file.file_name
        }-${file.folder_id}.${getFileExtension(file.file_name)}`,
        function (err) {
          if (err) throw err;
          // if no error, file has been deleted successfully
          console.log("File deleted!");
        }
      );
      await sequelizeServer.models.user_files.destroy({
        where: { id },
      });
      return "File Deleted Permanently";
    }
  } catch (error) {
    console.log(error);
    return error;
  }
}
async function recursionDelete(id, user) {
  const files = await sequelizeServer.models.user_files.findAll({
    where: { folder_id: id },
  });
  for (let i in files) {
    fs.unlink(
      `public/files/user-${user.user_id}/file-${user.user_id}-${
        files[i].file_name
      }-${files[i].folder_id}.${getFileExtension(files[i].file_name)}`,
      function (err) {
        if (err) throw err;
        // if no error, file has been deleted successfully
        console.log("File deleted!");
      }
    );
    await sequelizeServer.models.user_files.destroy({
      where: { id: files[i].id },
    });
  }
  await sequelizeServer.models.user_folder.destroy({
    where: { id },
  });
  const folders = await sequelizeServer.models.user_folder.findAll({
    where: { parent: id },
  });
  if (folders) {
    for (let i in folders) {
      await recursionDelete(folders[i].id, user);
    }
  } else {
    return;
  }
}

async function DeleteFolder(id, user) {
  try {
    const folder = await sequelizeServer.models.user_folder.findOne({
      where: { id },
    });
    if (folder.is_valid === true) {
      const result = await sequelizeServer.models.user_folder.update(
        { is_valid: false },
        {
          where: { id },
        }
      );
      return "Folder moved to Recycle Bin";
    } else {
      recursionDelete(id, user);
      return "Folder deleted Permanently";
    }
  } catch (error) {
    return error;
  }
}

async function DownloadFile(req, res, next) {
  try {
    const filename = `file-${req.params.id}-${req.params.filename}-${req.params.folder_id}`;

    const fullFileName = fromDir(
      require("path").resolve(
        `${__dirname}../../../public/files/user-${req.params.id}/`
      ),
      filename
    );
    console.log(
      "directory name",
      require("path").resolve(`${__dirname}../../../public/files`)
    );
    if (fullFileName === undefined) {
      res.status(500).send("<h1>File was not uploaded</h1>");
      return;
    }
    const file = `${__dirname}../../../public/files/user-${req.params.id}/${fullFileName}`;
    res.download(file);
  } catch (error) {
    res.status(500).json({ error: "File was not uploaded" });
  }
}

async function AvaliableStorage(user_id) {
  try {
    const result = await sequelizeServer.models.user_files.findAll({
      where: { user_id },
    });
    let Astorage = 0;
    for (let i in result) {
      let bstorage = parseInt(result[i].file_size);

      Astorage = Astorage + bstorage;
    }
    let storagemb = Astorage / 1024 / 1024;
    return storagemb.toFixed(1);
  } catch (error) {
    return error;
  }
}

async function getRecyclyBinFiles(user) {
  try {
    const files = await sequelizeServer.models.user_files.findAll({
      where: { is_valid: false, user_id: user.user_id },
    });
    return files;
  } catch (error) {
    console.log(error);
    return error;
  }
}

async function getRecyclyBinFolders(user) {
  try {
    const folders = await sequelizeServer.models.user_folder.findAll({
      where: { is_valid: false, user_id: user.user_id },
    });
    return folders;
  } catch (error) {
    console.log(error);
    return error;
  }
}

async function restoreFolder(id) {
  try {
    const folders = sequelizeServer.models.user_folder.update(
      { is_valid: true },
      {
        where: { id },
      }
    );
    return folders;
  } catch (error) {
    console.log(error);
    return error;
  }
}

async function restoreFile(id) {
  try {
    const files = sequelizeServer.models.user_files.update(
      { is_valid: true },
      {
        where: { id },
      }
    );
    return files;
  } catch (error) {
    console.log(error);
    return error;
  }
}

module.exports = {
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
  restoreFolder,
  restoreFile,
};
