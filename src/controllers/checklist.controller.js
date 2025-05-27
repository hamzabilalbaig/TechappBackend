const { func } = require("joi");
const {
  getAllChecklist,
  updateChecklist,
  deleteChecklist,
  deleteAllChecklist,
  createChecklist,
  searchChecklist,
  markChecked,
  markAllChecked,
  markAllCheckedByTableName,
  deleteAllByTableName,
} = require("../services/checklist.services");

async function GetAllChecklist(req, res, next) {
  try {
    const result = await getAllChecklist(req?.user?.id);
    res.json(responseFormat(true, result, "SuccessFully "));
  } catch (error) {
    res.json(responseFormat(false, error, "Internal Server Error"));
    next(error);
  }
}

async function UpdateChecklist(req, res, next) {
  try {
    const result = await updateChecklist(req?.body);
    res.json(responseFormat(true, result, "SuccessFully "));
  } catch (error) {
    res.json(responseFormat(false, error, "Internal Server Error"));
    next(error);
  }
}

async function DeleteChecklist(req, res, next) {
  try {
    const result = await deleteChecklist(req?.params?.id);
    res.json(responseFormat(true, result, "SuccessFully "));
  } catch (error) {
    res.json(responseFormat(false, error, "Internal Server Error"));
    next(error);
  }
}

async function DeleteAllChecklist(req, res, next) {
  try {
    const result = await deleteAllChecklist(req?.user?.id);
    res.json(responseFormat(true, result, "SuccessFully "));
  } catch (error) {
    res.json(responseFormat(false, error, "Internal Server Error"));
    next(error);
  }
}

async function CreateChecklist(req, res, next) {
  try {
    const result = await createChecklist(req?.body);
    res.json(responseFormat(true, result, "SuccessFully "));
  } catch (error) {
    res.json(responseFormat(false, error, "Internal Server Error"));
    next(error);
  }
}

async function SearchChecklist(req, res, next) {
  try {
    const result = await searchChecklist(req?.body);
    res.json(responseFormat(true, result, "SuccessFully "));
  } catch (error) {
    res.json(responseFormat(false, error, "Internal Server Error"));
    next(error);
  }
}

async function MarkChecked(req, res, next) {
  try {
    const result = await markChecked(req?.body);
    res.json(responseFormat(true, result, "SuccessFully "));
  } catch (error) {
    res.json(responseFormat(false, error, "Internal Server Error"));
    next(error);
  }
}

async function MarkAllChecked(req, res, next) {
  try {
    const result = await markAllChecked(req?.body);
    res.json(responseFormat(true, result, "SuccessFully "));
  } catch (error) {
    res.json(responseFormat(false, error, "Internal Server Error"));
    next(error);
  }
}

async function MarkAllCheckedByTableName(req, res, next) {
  try {
    const result = await markAllCheckedByTableName(req?.body);
    res.json(responseFormat(true, result, "SuccessFully "));
  } catch (error) {
    res.json(responseFormat(false, error, "Internal Server Error"));
    next(error);
  }
}

async function DeleteAllByTableName(req, res, next) {
  try {
    const result = await deleteAllByTableName(req?.body);
    res.json(responseFormat(true, result, "SuccessFully "));
  } catch (error) {
    res.json(responseFormat(false, error, "Internal Server Error"));
    next(error);
  }
}

module.exports = {
  GetAllChecklist,
  UpdateChecklist,
  DeleteChecklist,
  DeleteAllChecklist,
  CreateChecklist,
  SearchChecklist,
  MarkChecked,
  MarkAllChecked,
  MarkAllCheckedByTableName,
  DeleteAllByTableName,
};
