const {
  getAllCertCategories,
  deleteCertCategory,
  addCertCategory,
  modifyCertCategory,
} = require("../services/cert_category.services");
const { responseFormat } = require("../utils/utils");

async function allCertCategories(req, res, next) {
  await getAllCertCategories()
    .then((result) => {
      res.json(responseFormat(true, result, "List of all cert categories"));
    })
    .catch((error) => {
      res.json(
        responseFormat(false, error, "Unexpected error while getting the list")
      );
      next(error);
    });
}

async function removeCertCategory(req, res, next) {
  await deleteCertCategory(req.params.id)
    .then((result) => {
      res.json(
        responseFormat(true, result, "Cert category deleted successfully")
      );
    })
    .catch((error) => {
      res.json(
        responseFormat(
          false,
          error,
          "Unexpected error while deleting cert category"
        )
      );
      next(error);
    });
}

async function createCertCategory(req, res, next) {
  await addCertCategory(req.body)
    .then((result) => {
      res.json(
        responseFormat(true, result, "Cert category added successfully")
      );
    })
    .catch((error) => {
      res.json(
        responseFormat(
          false,
          error,
          "Unexpected error while adding cert category"
        )
      );
      next(error);
    });
}

async function updateCertCategory(req, res, next) {
  await modifyCertCategory(req.params.id, req.body)
    .then((result) => {
      res.json(
        responseFormat(true, result, "Cert category updated successfully")
      );
    })
    .catch((error) => {
      res.json(
        responseFormat(
          false,
          error,
          "Unexpected error while updating cert category"
        )
      );
      next(error);
    });
}

module.exports = {
  allCertCategories,
  removeCertCategory,
  createCertCategory,
  updateCertCategory,
};
