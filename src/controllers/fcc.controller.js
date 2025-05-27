const { findNearestLocations } = require("../services/fcc.services");
const { responseFormat } = require("../utils/utils");

async function nearestLocations(req, res, next) {
  await findNearestLocations(req?.body)
    .then((result) => {
      res.json(responseFormat(true, result, "List of all tower pubacc ra"));
    })
    .catch((error) => {
      res.json(
        responseFormat(false, error, "Unexpected error while getting the list")
      );
      next(error);
    });
}


module.exports = {
  nearestLocations,
}