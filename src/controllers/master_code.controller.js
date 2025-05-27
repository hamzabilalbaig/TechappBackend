const {
  GetAllMasterCodes,
  AddDetailCode,
  EditDetailCode,
  DeleteDetailCode,
  GetDetailForMaster,
} = require("../services/master_code.service");
const { responseFormat } = require("../utils/utils");

async function AllMasterCodes(req, res, next) {
  try {
    const result = await GetAllMasterCodes();
    res.json({
      success: true,
      message: "list of all master codes",
      data: result,
    });
  } catch (error) {
    res.json({
      success: false,
      message: "Unexpected error while getting the list",
      data: [],
    });
    next(error);
  }
}

async function addDetailCode(req, res, next) {
  try {
    const result = await AddDetailCode(req.body);
    res.json(responseFormat(true, result, "Detail Code added Successfully"));
  } catch (error) {
    res
      .status(500)
      .json(
        responseFormat(
          false,
          error,
          error?.name === "SequelizeUniqueConstraintError"
            ? "Detail code already exists"
            : "Unexpected error while adding the detail code"
        )
      );
    next(error);
  }
}
async function editDetailCode(req, res, next) {
  try {
    const result = await EditDetailCode(req.params.id, req.body);
    res.json(responseFormat(true, result, "Detail Code updated Successfully"));
  } catch (error) {
    res
      .status(500)
      .json(
        responseFormat(
          false,
          error,
          "Unexpected error while updating the detail code"
        )
      );
    next(error);
  }
}

async function deleteDetailCode(req, res, next) {
  try {
    const result = await DeleteDetailCode(req.params.id);
    res.json(responseFormat(true, result, "Detail Code deleted Successfully"));
  } catch (error) {
    res
      .status(500)
      .json(
        responseFormat(
          false,
          error,
          "Unexpected error while deleted the detail code"
        )
      );
    next(error);
  }
}

async function getDetailCodeForMaster(req, res, next) {
  try {
    const result = await GetDetailForMaster(req.params.id);
    res.json(responseFormat(true, result, ""));
  } catch (error) {
    res.status(500).json(responseFormat(false, error, ""));
    next(error);
  }
}

module.exports = {
  AllMasterCodes,
  addDetailCode,
  editDetailCode,
  deleteDetailCode,
  getDetailCodeForMaster,
};
