const {
  GetAllInterruptions,
  AddInterruption,
  UpdateInterruption,
  DeleteInterruption,
  GetInterruptionsById,
  GetAllInterruptionsForTable,
  SerarchByIntCode,
  getUnresolvedCount,
  restore,
  csvImport,
  filterInterruptions,
} = require("../services/Interruption.services");
const { responseFormat } = require("../utils/utils");

async function allInterruptionsForTable(req, res, next) {
  try {
    const result = await GetAllInterruptionsForTable(req.user);
    res.json(responseFormat(true, result, "list of all Interruptions"));
  } catch (error) {
    res.json(
      responseFormat(
        false,
        error,
        "Unexpected error while getting Interruptions"
      )
    );
    next(error);
  }
}
async function allInterruptions(req, res, next) {
  try {
    const result = await GetAllInterruptions(req.params.id, req.user);
    res.json(responseFormat(true, result, "list of all Interruptions"));
  } catch (error) {
    res.json(
      responseFormat(
        false,
        error,
        "Unexpected error while getting Interruptions"
      )
    );
    next(error);
  }
}

async function getInterruptionsById(req, res, next) {
  try {
    const result = await GetInterruptionsById(req.params.id);
    res.json(responseFormat(true, result, "list of all Interruptions"));
  } catch (error) {
    res.json(
      responseFormat(
        false,
        error,
        "Unexpected error while getting Interruptions"
      )
    );
    next(error);
  }
}

async function addInterruption(req, res, next) {
  try {
    const result = await AddInterruption(req.body, req.user);
    res.json(responseFormat(true, result, "Interruptions Added SuccessFully"));
  } catch (error) {
    res
      .status(500)
      .json(
        responseFormat(
          false,
          error,
          "Unexpected error while Adding The Interruptions"
        )
      );
    next(error);
  }
}

async function editInterruption(req, res, next) {
  try {
    const result = await UpdateInterruption(req.body, req.params.id, req.user);
    res.json(responseFormat(true, result, "Interruption updated SuccessFully"));
  } catch (error) {
    res
      .status(500)
      .json(
        responseFormat(
          false,
          error,
          "Unexpected error while updating The Interruption"
        )
      );
    next(error);
  }
}

async function deleteInterruption(req, res, next) {
  try {
    const result = await DeleteInterruption(req.params.id);
    res.json(responseFormat(true, result, "Interruption deleted SuccessFully"));
  } catch (error) {
    res
      .status(500)
      .json(
        responseFormat(
          false,
          error,
          "Unexpected error while delete The Interruption"
        )
      );
    next(error);
  }
}

async function search(req, res, next) {
  try {
    const result = await SerarchByIntCode(req.params.code, req.user);
    res.json(
      responseFormat(true, result, "Interruption Retrived SuccessFully")
    );
  } catch (error) {
    res
      .status(500)
      .json(
        responseFormat(
          false,
          error,
          "Unexpected error while delete The Interruption"
        )
      );
    next(error);
  }
}
async function filter(req, res, next) {
  try {
    const result = await filterInterruptions(req.body.filters, req.user);
    res.json(
      responseFormat(true, result, "Interruption Retrived SuccessFully")
    );
  } catch (error) {
    res
      .status(500)
      .json(
        responseFormat(
          false,
          error,
          "Unexpected error while delete The Interruption"
        )
      );
    next(error);
  }
}
async function getUnresolvedInterruptionsCount(req, res, next) {
  try {
    const result = await getUnresolvedCount(req.params.id, req.user);
    res.json(
      responseFormat(true, result, "Interruption Retrieved SuccessFully")
    );
  } catch (error) {
    res
      .status(500)
      .json(
        responseFormat(
          false,
          error,
          "Unexpected error while Retrieving The Interruption"
        )
      );
    next(error);
  }
}

async function restoreInterruption(req, res, next) {
  try {
    const result = await restore(req.params.id);
    res.json(
      responseFormat(true, result, "Interruption Restored SuccessFully")
    );
  } catch (error) {
    res
      .status(500)
      .json(
        responseFormat(
          false,
          error,
          "Unexpected error while Restoring The Interruption"
        )
      );
    next(error);
  }
}
async function CSVInterruption(req, res, next) {
  try {
    if (!req.file) {
      res.status(400).json(responseFormat(false, null, "No File Uploaded"));
    }
    const csvData = req.file.buffer.toString();
    const result = await csvImport(csvData);
    res.json(
      responseFormat(true, result, "Interruption Restored SuccessFully")
    );
  } catch (error) {
    res
      .status(500)
      .json(
        responseFormat(
          false,
          error,
          "Unexpected error while Restoring The Interruption"
        )
      );
    next(error);
  }
}

module.exports = {
  allInterruptions,
  addInterruption,
  editInterruption,
  deleteInterruption,
  getInterruptionsById,
  allInterruptionsForTable,
  search,
  getUnresolvedInterruptionsCount,
  restoreInterruption,
  CSVInterruption,
  filter,
};
