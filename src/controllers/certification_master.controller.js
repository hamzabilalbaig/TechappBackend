const {
  getAllCertificationMasters,
  deleteCertificationMaster,
  addCertificationMaster,
  modifyCertificationMaster,
  getUserCertificationMasters,
  getCertificationMasterByID,
  getAllCertificationMastersByPaging,
  getFilteredCertificationMaster,
  getUserCertCategories,
  getUserCertByTypeID,
  getUserCertByTypeIDs,
  evaluateCertificationPercentage,
} = require("../services/certification_master.services");
const { responseFormat, fromDir } = require("../utils/utils");

async function allCertificationMasters(req, res, next) {
  await getAllCertificationMasters()
    .then((result) => {
      res.json(
        responseFormat(true, result, "List of all certification masters")
      );
    })
    .catch((error) => {
      res.json(
        responseFormat(false, error, "Unexpected error while getting the list")
      );
      next(error);
    });
}

async function userCertsByTypeID(req, res, next) {
  await getUserCertByTypeID(req.params.id, req.params.user_id)
    .then((result) => {
      res.json(
        responseFormat(true, result, "List of all certification masters")
      );
    })
    .catch((error) => {
      res.json(
        responseFormat(false, error, "Unexpected error while getting the list")
      );
      next(error);
    });
}

async function userCertsByTypeIDs(req, res, next) {
  await getUserCertByTypeIDs(req?.body, req.params.user_id)
    .then((result) => {
      res.json(
        responseFormat(true, result, "List of all certification masters")
      );
    })
    .catch((error) => {
      res.json(
        responseFormat(false, error, "Unexpected error while getting the list")
      );
      next(error);
    });
}

async function getCertificationPercentage(req, res, next) {
  await evaluateCertificationPercentage(req?.body)
    .then((result) => {
      res.json(
        responseFormat(true, result, "List of all certification masters")
      );
    })
    .catch((error) => {
      res.json(
        responseFormat(false, error, "Unexpected error while getting the list")
      );
      next(error);
    });
}

async function getBasic4CertificationPercentage(req, res, next) {
  await evaluateBasic4CertificationPercentage(req?.body)
    .then((result) => {
      res.json(
        responseFormat(true, result, "List of all certification masters")
      );
    })
    .catch((error) => {
      res.json(
        responseFormat(false, error, "Unexpected error while getting the list")
      );
      next(error);
    });
}

async function userCertificationCategories(req, res, next) {
  await getUserCertCategories(req.params.id)
    .then((result) => {
      res.json(
        responseFormat(
          true,
          result,
          "List of all certification categories for user"
        )
      );
    })
    .catch((error) => {
      res.json(
        responseFormat(
          false,
          error,
          "Unexpected error while getting the list of certification categories for user"
        )
      );
      next(error);
    });
}

async function allCertificationMastersByPagination(req, res, next) {
  await getAllCertificationMastersByPaging(req.body?.params)
    .then((result) => {
      res.json(
        responseFormat(true, result, "List of all certification masters")
      );
    })
    .catch((error) => {
      res.json(
        responseFormat(false, error, "Unexpected error while getting the list")
      );
      next(error);
    });
}

async function filterCertificationMasters(req, res, next) {
  await getFilteredCertificationMaster(req.body?.params)
    .then((result) => {
      res.json(
        responseFormat(true, result, "List of all certification masters")
      );
    })
    .catch((error) => {
      res.json(
        responseFormat(false, error, "Unexpected error while getting the list")
      );
      next(error);
    });
}

async function removeCertificationMaster(req, res, next) {
  await deleteCertificationMaster(req.params.id)
    .then((result) => {
      res.json(
        responseFormat(
          true,
          result,
          "Certification master deleted successfully"
        )
      );
    })
    .catch((error) => {
      res.json(
        responseFormat(
          false,
          error,
          "Unexpected error while deleting certification master"
        )
      );
      next(error);
    });
}

async function createCertificationMaster(req, res, next) {
  const fullFileName = fromDir(
    require("path").resolve(
      `${__dirname}../../../public/files/user-${req.body.value?.user_id}/certifications`
    ),
    req.body?.value?.cert_master_image
  );
  if (fullFileName === undefined) {
    console.log(fullFileName);
  } else {
    const file = require("path").resolve(
      `${__dirname}../../../public/files/user-${req.body.value?.user_id}/certifications/${fullFileName}`
    );

    async function resizeImage(imagePath) {
      function readFileAsync(path) {
        return new Promise((resolve, reject) => {
          fs.readFile(path, (err, data) => {
            if (err) reject(err);
            else resolve(data);
          });
        });
      }
      const imageBuffer = await readFileAsync(imagePath);
      const image = await loadImage(imageBuffer);

      const targetWidth = 200; // Target width in pixels
      const targetHeight = 150;

      const canvas = createCanvas(targetWidth, targetHeight);
      const ctx = canvas.getContext("2d");
      ctx.drawImage(image, 0, 0, targetWidth, targetHeight);
      const folderPath = `public/files/user-${req.body.value?.user_id}/certifications-thumbnail`;
      fs.mkdirSync(folderPath, { recursive: true });
      const resizedImagePath = path.join(
        `public/files/user-${req.body.value?.user_id}/certifications-thumbnail`,
        fullFileName
      );
      const stream = canvas?.createJPEGStream({ quality: 0.7 });
      const out = require("fs").createWriteStream(resizedImagePath);
      stream.pipe(out);
      out.on("finish", () =>
        console.log("The image was saved with a watermark.")
      );
    }

    resizeImage(file);
  }
  await addCertificationMaster(req.body?.value)
    .then((result) => {
      res.json(
        responseFormat(true, result, "Certification master added successfully")
      );
    })
    .catch((error) => {
      res.json(
        responseFormat(
          false,
          error,
          "Unexpected error while adding certification master"
        )
      );
      next(error);
    });
}

async function updateCertificationMaster(req, res, next) {
  await modifyCertificationMaster(req.params.id, req.body.value)
    .then((result) => {
      res.json(
        responseFormat(
          true,
          result,
          "Certification master updated successfully"
        )
      );
    })
    .catch((error) => {
      res.json(
        responseFormat(
          false,
          error,
          "Unexpected error while updating certification master"
        )
      );
      next(error);
    });
}

async function userCertificationMasters(req, res, next) {
  await getUserCertificationMasters(req.params.id)
    .then((result) => {
      res.json(
        responseFormat(
          true,
          result,
          "List of all certification masters for user"
        )
      );
    })
    .catch((error) => {
      res.json(
        responseFormat(
          false,
          error,
          "Unexpected error while getting the list of certification masters for user"
        )
      );
      next(error);
    });
}

async function certificationMasterByID(req, res, next) {
  await getCertificationMasterByID(req.params.id)
    .then((result) => {
      res.json(responseFormat(true, result, "Certification master by ID"));
    })
    .catch((error) => {
      res.json(
        responseFormat(
          false,
          error,
          "Unexpected error while getting the certification master by ID"
        )
      );
      next(error);
    });
}

async function getFile(req, res, next) {
  try {
    const filename = req.params.filename;
    const folder_ID = req.params.folder_ID;

    const fullFileName = fromDir(
      require("path").resolve(
        `${__dirname}../../../public/files/${folder_ID}/certifications`
      ),
      filename
    );
    console.log(
      "directory name",
      require("path").resolve(
        `${__dirname}../../../public/files/${folder_ID}/certifications`
      )
    );
    if (fullFileName === undefined) {
      res.status(500).send("<h1>File was not uploaded</h1>");
      return;
    }
    const file = `${__dirname}../../../public/files/${folder_ID}/certifications/${fullFileName}`;
    res.download(file);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
    next(error);
  }
}

module.exports = {
  allCertificationMasters,
  removeCertificationMaster,
  createCertificationMaster,
  updateCertificationMaster,
  userCertificationMasters,
  certificationMasterByID,
  allCertificationMastersByPagination,
  filterCertificationMasters,
  userCertificationCategories,
  userCertsByTypeID,
  userCertsByTypeIDs,
  getFile,
  getCertificationPercentage,
  getBasic4CertificationPercentage,
};
