const {
  getAllCertProviders,
  deleteCertProvider,
  addCertProvider,
  modifyCertProvider,
  getCertProvidersByCertTypeId,
} = require("../services/cert_provider.services");
const { responseFormat } = require("../utils/utils");

async function allCertProviders(req, res, next) {
  await getAllCertProviders()
    .then((result) => {
      res.json(responseFormat(true, result, "List of all cert providers"));
    })
    .catch((error) => {
      res.json(
        responseFormat(false, error, "Unexpected error while getting the list")
      );
      next(error);
    });
}

async function allCertProvidersByCertTypeId(req, res, next) {
  await getCertProvidersByCertTypeId(req.params.id)
    .then((result) => {
      res.json(
        responseFormat(
          true,
          result,
          "List of all cert providers by cert type id"
        )
      );
    })
    .catch((error) => {
      res.json(
        responseFormat(false, error, "Unexpected error while getting the list")
      );
      next(error);
    });
}

async function removeCertProvider(req, res, next) {
  await deleteCertProvider(req.params.id)
    .then((result) => {
      res.json(
        responseFormat(true, result, "Cert provider deleted successfully")
      );
    })
    .catch((error) => {
      res.json(
        responseFormat(
          false,
          error,
          "Unexpected error while deleting cert provider"
        )
      );
      next(error);
    });
}

async function createCertProvider(req, res, next) {
  await addCertProvider(req.body)
    .then((result) => {
      res.json(
        responseFormat(true, result, "Cert provider added successfully")
      );
    })
    .catch((error) => {
      res.json(
        responseFormat(
          false,
          error,
          "Unexpected error while adding cert provider"
        )
      );
      next(error);
    });
}

async function updateCertProvider(req, res, next) {
  await modifyCertProvider(req.params.id, req.body)
    .then((result) => {
      res.json(
        responseFormat(true, result, "Cert provider updated successfully")
      );
    })
    .catch((error) => {
      res.json(
        responseFormat(
          false,
          error,
          "Unexpected error while updating cert provider"
        )
      );
      next(error);
    });
}

module.exports = {
  allCertProviders,
  removeCertProvider,
  createCertProvider,
  updateCertProvider,
  allCertProvidersByCertTypeId
};
