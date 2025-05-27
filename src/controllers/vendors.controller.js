const { getQuickbaseTableData } = require("../services/quickbase.services");
const {
  InsertVendor,
  EditVendor,
  GetVendors,
  RemoveVendor,
} = require("../services/vendors.services");
const { responseFormat } = require("../utils/utils");

async function AddNewVendor(req, res, next) {
  InsertVendor(req.body)
    .then((result) => {
      res.json(responseFormat(true, result, "Vendors Added Successfully"));
    })
    .catch((ex) => {
      res
        .status(500)
        .json(
          responseFormat(false, ex, "Unexpected error while adding The Vendors")
        );
      next(ex);
    });
}

async function DeleteVendor(req, res, next) {
  RemoveVendor(req.params.id)
    .then((result) => {
      res.json(responseFormat(true, result, "Vendors Deleted Successfully"));
    })
    .catch((ex) => {
      console.log("dedjweksd", ex);
      res
        .status(500)
        .json(
          responseFormat(
            false,
            ex,
            "Unexpected error while Deleting The Vendors"
          )
        );
      next(ex);
    });
}

async function UpdateVendor(req, res, next) {
  try {
    const result = await EditVendor(req.body, req.params.id);
    if (result == 0) {
      res.json(
        responseFormat(
          false,
          result,
          "Unexpected error while updating the vendors"
        )
      );
    } else {
      res.json(responseFormat(true, result, "Vendors Updated Successfully"));
    }
  } catch (error) {
    res
      .status(500)
      .json(
        responseFormat(
          false,
          error,
          "Unexpected error While Updating the Vendors"
        )
      );

    next(error);
  }
}

async function GetAllVendors(req, res, next) {
  GetVendors(req.user)
    .then((result) => {
      res.json(responseFormat(true, result, "All Vendors"));
    })
    .catch((ex) => {
      console.log(ex);
      res.json(
        responseFormat(true, ex, "Unexpected error While Getting All Vendors")
      );
    });
}

async function GetVendorDetailsFromQB(req, res, next) {
  await getQuickbaseTableData(req.body)
    .then((result) => {
      res.json(responseFormat(true, result, "Vendor"));
    })
    .catch((ex) => {
      console.log(ex);
      res.json(
        responseFormat(true, ex, "Unexpected error While Getting All Vendors")
      );
    });
}

module.exports = {
  AddNewVendor,
  DeleteVendor,
  UpdateVendor,
  GetAllVendors,
  GetVendorDetailsFromQB
};
