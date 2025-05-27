const {
  getCountriesLabelValue,
  getStatesLabelValue,
  getCitiesLabelValue,
  getUSCountiesLabelValue,
} = require("../services/location.service");
const { responseFormat } = require("../utils/utils");

async function getAllCountriesDropdown(req, res, next) {
  try {
    const result = await getCountriesLabelValue();
    res.json(responseFormat(true, result, "All Countries"));
  } catch (ex) {
    res.json(
      responseFormat(false, error, "Unexpected error while Getting Countries")
    );
    next(error);
  }
}

async function getAllStatesDropdown(req, res, next) {
  try {
    const result = await getStatesLabelValue(req.params.country);
    res.json(responseFormat(true, result, "All States"));
  } catch (ex) {
    res.json(
      responseFormat(false, error, "Unexpected error while Getting States")
    );
    next(error);
  }
}

async function getAllCititesDropdown(req, res, next) {
  try {
    const result = await getCitiesLabelValue(
      req.params.country,
      req.params.state
    );
    res.json(responseFormat(true, result, "All Cities"));
  } catch (ex) {
    res.json(
      responseFormat(false, error, "Unexpected error while Getting Cities")
    );
    next(error);
  }
}

async function getAllUSCountiesDropdown(req, res, next) {
  try {
    const result = await getUSCountiesLabelValue(req.params.state);
    res.json(responseFormat(true, result, "All US Counties"));
  } catch (ex) {
    res.json(responseFormat(false, error, "error while Getting US Counties"));
    next(error);
  }
}

module.exports = {
  getAllCountriesDropdown,
  getAllStatesDropdown,
  getAllCititesDropdown,
  getAllUSCountiesDropdown,
};
