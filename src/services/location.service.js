const cscList = require("../assets/countryData.json");
const countyList = require("../assets/counties_list.json");

async function getCountriesLabelValue() {
  try {
    const countries = cscList.map((x) => {
      return { label: x.name, value: x.name };
    });
    return countries;
  } catch (error) {
    return error;
  }
}

async function getStatesLabelValue(country) {
  try {
    const states = cscList
      .find((c) => c.name === country)
      .states.map((x) => {
        return { label: x.name, value: x.name };
      });
    return states;
  } catch (error) {
    return error;
  }
}

async function getCitiesLabelValue(country, state) {
  try {
    if (state) {
      const cities = cscList
        .find((c) => c.name === country)
        .states?.find((s) => s.name === state)
        .cities?.map((x) => {
          return { label: x.name, value: x.name };
        });
      return cities;
    } else {
      const cities = cscList
        .find((c) => c.name === country)
        .states?.cities?.map((x) => {
          return { label: x.name, value: x.name };
        });
      return cities;
    }
  } catch (error) {
    return error;
  }
}

async function getUSCountiesLabelValue(state) {
  try {
    const counties = countyList
      .filter((c) => c.State === state)
      .map((co) => {
        return { label: co.County, value: co.County };
      });
    return counties;
  } catch (error) {
    return error;
  }
}

module.exports = {
  getCountriesLabelValue,
  getStatesLabelValue,
  getCitiesLabelValue,
  getUSCountiesLabelValue,
};
