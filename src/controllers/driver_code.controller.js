const {
  AddDriverCode,
  EditDriverCode,
  DeleteDriverCode,
  GetAllDriverCodes,
  GetDriverCodeByID,
} = require("../services/driver_code.services");
const { responseFormat } = require("../utils/utils");

async function allDriverCodes(req, res, next) {
  try {
    const result = await GetAllDriverCodes();
    res.json({
      success: true,
      message: "list of all driver codes",
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
async function addDriverCode(req, res, next) {
  try {
    const result = await AddDriverCode(req.body);
    res.json(responseFormat(true, result, "Driver Code added Successfully"));
  } catch (error) {
    res
      .status(500)
      .json(
        responseFormat(
          false,
          error,
          "Unexpected error while adding the Driver code"
        )
      );
    next(error);
  }
}
async function editDriverCode(req, res, next) {
  try {
    const result = await EditDriverCode(req.params.id, req.body);
    res.json(responseFormat(true, result, "Driver Code update Successfully"));
  } catch (error) {
    res
      .status(500)
      .json(
        responseFormat(
          false,
          error,
          "Unexpected error while updating the Driver code"
        )
      );
    next(error);
  }
}

async function deleteDriverCode(req, res, next) {
  try {
    const result = await DeleteDriverCode(req.params.id);
    res.json(responseFormat(true, result, "Driver Code deleted Successfully"));
  } catch (error) {
    res
      .status(500)
      .json(
        responseFormat(
          false,
          error,
          "Unexpected error while deleted the Driver code"
        )
      );
    next(error);
  }
}

async function getDriverCodeByDriverCodeID(req, res, next) {
  try {
    const result = await GetDriverCodeByID(req.params.id);
    res.json(responseFormat(true, result, "Driver Code "));
  } catch (error) {
    res
      .status(500)
      .json(
        responseFormat(
          false,
          error,
          "Unexpected error while getting the Driver code"
        )
      );
    next(error);
  }
}

module.exports = {
  allDriverCodes,
  editDriverCode,
  addDriverCode,
  deleteDriverCode,
  getDriverCodeByDriverCodeID,
};
