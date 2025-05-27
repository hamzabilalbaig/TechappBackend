const {
  GetAllIssues,
  AddIssue,
  UpdateIssue,
  DeleteIssue,
} = require("../services/issues.service");
const { responseFormat } = require("../utils/utils");

async function allIssues(req, res, next) {
  try {
    const result = await GetAllIssues(req.user);
    res.json(responseFormat(true, result, "list of all issues"));
  } catch (error) {
    res.json(
      responseFormat(false, error, "Unexpected error while getting issues")
    );
    next(error);
  }
}

async function addIssue(req, res, next) {
  try {
    const result = await AddIssue(req.body);
    res.json(responseFormat(true, result, "Issues Added SuccessFully"));
  } catch (error) {
    res
      .status(500)
      .json(
        responseFormat(false, error, "Unexpected error while Adding The issues")
      );
    next(error);
  }
}

async function editIssue(req, res, next) {
  try {
    const result = await UpdateIssue(req.body, req.params.id);
    res.json(responseFormat(true, result, "Issue updated SuccessFully"));
  } catch (error) {
    res
      .status(500)
      .json(
        responseFormat(
          false,
          error,
          "Unexpected error while updating The issue"
        )
      );
    next(error);
  }
}

async function deleteIssue(req, res, next) {
  try {
    const result = await DeleteIssue(req.params.id);
    res.json(responseFormat(true, result, "Issue deleted SuccessFully"));
  } catch (error) {
    res
      .status(500)
      .json(
        responseFormat(false, error, "Unexpected error while delete The issue")
      );
    next(error);
  }
}

module.exports = {
  allIssues,
  addIssue,
  editIssue,
  deleteIssue,
};
