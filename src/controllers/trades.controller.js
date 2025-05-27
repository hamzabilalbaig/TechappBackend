const {
  getAllTrades,
  deleteTrade,
  addTrade,
  modifyTrade,
  getUserTrades,
  getTradeTypes,
  getCertTypeProviders,
} = require("../services/trades.services");
const { responseFormat } = require("../utils/utils");

async function allTrades(req, res, next) {
  await getAllTrades()
    .then((result) => {
      res.json(responseFormat(true, result, "List of all trades"));
    })
    .catch((error) => {
      res.json(
        responseFormat(false, error, "Unexpected error while getting the list")
      );
      next(error);
    });
}

async function removeTrade(req, res, next) {
  await deleteTrade(req.params.id)
    .then((result) => {
      res.json(responseFormat(true, result, "Trade deleted successfully"));
    })
    .catch((error) => {
      res.json(
        responseFormat(false, error, "Unexpected error while deleting trade")
      );
      next(error);
    });
}

async function createTrade(req, res, next) {
  await addTrade(req.body)
    .then((result) => {
      res.json(responseFormat(true, result, "Trade added successfully"));
    })
    .catch((error) => {
      res.json(
        responseFormat(false, error, "Unexpected error while adding trade")
      );
      next(error);
    });
}

async function updateTrade(req, res, next) {
  await modifyTrade(req.params.id, req.body)
    .then((result) => {
      res.json(responseFormat(true, result, "Trade updated successfully"));
    })
    .catch((error) => {
      res.json(
        responseFormat(false, error, "Unexpected error while updating trade")
      );
      next(error);
    });
}

async function geAlltUserTrades(req, res, next) {
  await getUserTrades(req.params.id)
    .then((result) => {
      res.json(responseFormat(true, result, "User trades"));
    })
    .catch((error) => {
      res.json(
        responseFormat(false, error, "Unexpected error while getting trades")
      );
      next(error);
    });
}

async function geAllTradeTypes(req, res, next) {
  await getTradeTypes(req.params.id,req.params.certID)
    .then((result) => {
      res.json(responseFormat(true, result, "User trades Types"));
    })
    .catch((error) => {
      res.json(
        responseFormat(false, error, "Unexpected error while getting trades Types")
      );
      next(error);
    });
}


async function geAllCertTypeProviders(req, res, next) {
  await getCertTypeProviders(req.params.id)
    .then((result) => {
      res.json(responseFormat(true, result, "User trades Types"));
    })
    .catch((error) => {
      res.json(
        responseFormat(false, error, "Unexpected error while getting trades Types")
      );
      next(error);
    });
}

module.exports = {
  allTrades,
  removeTrade,
  createTrade,
  updateTrade,
  geAlltUserTrades,
  geAllTradeTypes,
  geAllCertTypeProviders
};
