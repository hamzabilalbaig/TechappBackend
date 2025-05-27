const {
  getNextCertificationID,
  addNewCertification,
  allCertification,
  removeCertification,
  modifyCertification,
  addCertificate,
  getCertificate,
  removeCertificate,
  getCertificationByID,
  getCertificationByUserID,
  allCertificationByPaging,
  filterCertification,
  checkingapi,
} = require("../services/certification.service");
const { responseFormat, fromDir } = require("../utils/utils");

async function nextID(req, res, next) {
  try {
    const result = await getNextCertificationID();
    res.json(responseFormat(true, result, "next id"));
  } catch (error) {
    res.json(responseFormat(false, error, "Internal Server Error"));
    next(error);
  }
}

async function createNewCertification(req, res, next) {
  try {
    const result = await addNewCertification(req.body);
    res.json(responseFormat(true, result, "Certification Saved"));
  } catch (error) {
    res.json(responseFormat(false, error, "Internal Server Error"));
    next(error);
  }
}

async function getAllCertifications(req, res, next) {
  try {
    const result = await allCertification();
    res.json(
      responseFormat(true, result, "SuccessFully Received All Certification")
    );
  } catch (error) {
    res.json(responseFormat(false, error, "Internal Server Error"));
    next(error);
  }
}

async function getAllCertificationsByPagination(req, res, next) {
  try {
    const result = await allCertificationByPaging(req.body?.params);
    res.json(
      responseFormat(true, result, "SuccessFully Received All Certification")
    );
  } catch (error) {
    res.json(responseFormat(false, error, "Internal Server Error"));
    next(error);
  }
}

async function FilterCertification(req, res, next) {
  try {
    const result = await filterCertification(req.body?.params);
    res.json(
      responseFormat(true, result, "SuccessFully Received All Certification")
    );
  } catch (error) {
    res.json(responseFormat(false, error, "Internal Server Error"));
    next(error);
  }
}

async function getCertificateByCertificationID(req, res, next) {
  try {
    const result = await getCertificate(req?.params?.cid, req?.params?.name);
    res.json(
      responseFormat(true, result, "SuccessFully Received All Certification")
    );
  } catch (error) {
    res.json(responseFormat(false, error, "Internal Server Error"));
    next(error);
  }
}

async function getCertificationByCertificationID(req, res, next) {
  try {
    const result = await getCertificationByID(req?.params?.cid);
    res.json(
      responseFormat(true, result, "SuccessFully Received All Certification")
    );
  } catch (error) {
    res.json(responseFormat(false, error, "Internal Server Error"));
    next(error);
  }
}

async function getCertificationByUSERID(req, res, next) {
  try {
    const result = await getCertificationByUserID(req?.params?.cid);
    res.json(
      responseFormat(true, result, "SuccessFully Received All Certification")
    );
  } catch (error) {
    res.json(responseFormat(false, error, "Internal Server Error"));
    next(error);
  }
}

async function deleteCertification(req, res, next) {
  try {
    const result = await removeCertification(req.params.id);
    res.json(
      responseFormat(true, result, "Certification Deleted Successfully")
    );
  } catch (error) {
    res.json(responseFormat(false, error, "Internal Server Error"));
    next(error);
  }
}

async function deleteCertificate(req, res, next) {
  try {
    const result = await removeCertificate(req.params.id);
    res.json(
      responseFormat(true, result, "Certification Deleted Successfully")
    );
  } catch (error) {
    res.json(responseFormat(false, error, "Internal Server Error"));
    next(error);
  }
}

async function updateCertification(req, res, next) {
  try {
    const result = await modifyCertification(req.params.id, req.body);
    res.json(
      responseFormat(true, result, "Certification Updated successfully")
    );
  } catch (error) {
    res.json(responseFormat(false, error, "Internal Server Error"));
    next(error);
  }
}

async function saveCertificate(req, res, next) {
  try {
    const result = await addCertificate(req.body);
    res.json(
      responseFormat(true, result, "Certification Updated successfully")
    );
  } catch (error) {
    res.json(responseFormat(false, error, "Internal Server Error"));
    next(error);
  }
}
async function checking(req, res, next) {
  try {
    const result = await checkingapi();
    res.json(
      responseFormat(true, result, "Certification Updated successfully")
    );
  } catch (error) {
    res.json(responseFormat(false, error, "Internal Server Error"));
    next(error);
  }
}

async function getFile(req, res, next) {
  try {
    const filename = req.params.filename;
    const folder_ID = req.params.folder_ID;

    const fullFileName = fromDir(
      require("path").resolve(
        `${__dirname}../../../public/certification/${folder_ID}`
      ),
      filename
    );
    console.log(
      "directory name",
      require("path").resolve(`${__dirname}../../../public/certification`)
    );
    if (fullFileName === undefined) {
      res.status(500).send("<h1>File was not uploaded</h1>");
      return;
    }
    const file = `${__dirname}../../../public/certification/${folder_ID}/${fullFileName}`;
    res.download(file);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
}
module.exports = {
  nextID,
  createNewCertification,
  getAllCertifications,
  deleteCertification,
  updateCertification,
  saveCertificate,
  getCertificateByCertificationID,
  getFile,
  deleteCertificate,
  getCertificationByCertificationID,
  getCertificationByUSERID,
  getAllCertificationsByPagination,
  FilterCertification,
  checking,
};
