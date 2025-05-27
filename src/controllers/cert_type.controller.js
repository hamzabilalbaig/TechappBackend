const {
  getAllCertTypes,
  deleteCertType,
  addCertType,
  modifyCertType,
} = require("../services/cert_type.services");
const { responseFormat } = require("../utils/utils");

async function allCertTypes(req, res, next) {
  await getAllCertTypes()
    .then((result) => {
      res.json(responseFormat(true, result, "List of all cert types"));
    })
    .catch((error) => {
      res.json(
        responseFormat(false, error, "Unexpected error while getting the list")
      );
      next(error);
    });
}

async function removeCertType(req, res, next) {
  await deleteCertType(req.params.id)
    .then((result) => {
      res.json(responseFormat(true, result, "Cert type deleted successfully"));
    })
    .catch((error) => {
      res.json(
        responseFormat(
          false,
          error,
          "Unexpected error while deleting cert type"
        )
      );
      next(error);
    });
}

async function createCertType(req, res, next) {
  await addCertType(req.body)
    .then((result) => {
      res.json(responseFormat(true, result, "Cert type added successfully"));
    })
    .catch((error) => {
      res.json(
        responseFormat(false, error, "Unexpected error while adding cert type")
      );
      next(error);
    });
}

async function updateCertType(req, res, next) {
  await modifyCertType(req.params.id, req.body)
    .then((result) => {
      res.json(responseFormat(true, result, "Cert type updated successfully"));
    })
    .catch((error) => {
      res.json(
        responseFormat(
          false,
          error,
          "Unexpected error while updating cert type"
        )
      );
      next(error);
    });
}
module.exports = {
  allCertTypes,
    removeCertType,
    createCertType,
    updateCertType,
};
