const fs = require("fs");
var _loadash = require("lodash");
var moment = require("moment");
const responseFormat = (status, data, message, code) => {
  return {
    status,
    data,
    message,
    code,
  };
};

function getRemovedItemByComparingArrays(array1, array2, key) {
  try {
    const removedItems = _loadash.differenceBy(array1, array2, key);
    return removedItems;
  } catch (error) {
    return "Error occured";
  }
}

function getReAddedItemByComparingArrays(array1, array2, key) {
  try {
    const reAddedItems = _loadash.intersectionBy(array2, array1, key);
    return reAddedItems;
  } catch (error) {
    return "Error occured";
  }
}

function getNewlyAddedItemByComparingArrays(array1, array2, key) {
  try {
    const newlyAddedItems = _loadash.differenceBy(array2, array1, key);
    return newlyAddedItems;
  } catch (error) {
    return "Error occured";
  }
}

function expiryDays(date_string) {
  try {
    const currentDate = moment(date_string).format('YYYY-MM-DD');
    var b = currentDate?.split(/\D/);
    //console.log(b);
    var expiry = new Date(b[0], --b[1], b[2]);
    return Math.round((expiry - new Date().setHours(0, 0, 0, 0)) / 8.64e7);
  } catch (err) {
    return "parse error";
  }
}

function getFileExtension(filename) {
  var ext = /^.+\.([^.]+)$/.exec(filename);
  return ext == null ? "" : ext[1];
}

function fromDir(startPath, filter) {
  if (!fs.existsSync(startPath)) {
    console.log("no dir ", startPath);
    return;
  }
  var files = fs.readdirSync(startPath);
  for (var i = 0; i < files.length; i++) {
    if (files[i].startsWith(filter)) {
      return files[i];
    }
  }
}

function miliToTime(miliseconds) {
  try {
    if (miliseconds) {
      let seconds = Math.floor(miliseconds / 1000);
      let minutes = Math.floor(seconds / 60);
      let hours = Math.floor(minutes / 60);
      let days = Math.floor(hours / 24);

      hours = hours - days * 24;
      minutes = minutes - days * 24 * 60 - hours * 60;
      seconds = seconds - days * 24 * 60 * 60 - hours * 60 * 60 - minutes * 60;
      return { hours: hours, minutes: minutes, seconds: seconds, days: days };
    } else {
      return null;
    }
  } catch {
    return null;
  }
}
function mstotime(miliseconds) {
  try {
    if (miliseconds) {
      let seconds = Math.floor(miliseconds / 1000);
      let minutes = Math.floor(seconds / 60);
      let hours = Math.floor(minutes / 60);
      let days = Math.floor(hours / 24);

      hours = hours - days * 24;
      minutes = minutes - days * 24 * 60 - hours * 60;
      seconds = seconds - days * 24 * 60 * 60 - hours * 60 * 60 - minutes * 60;
      return `${hours}h:${minutes}m:${seconds}s`;
    } else {
      return null;
    }
  } catch {
    return null;
  }
}
function getValueFromMoneyField(data) {
  try {
    return data?.replace(/[$,]/g, "");
  } catch (err) {
    return 0;
  }
}
module.exports = {
  responseFormat,
  getFileExtension,
  fromDir,
  expiryDays,
  miliToTime,
  getRemovedItemByComparingArrays,
  getReAddedItemByComparingArrays,
  getNewlyAddedItemByComparingArrays,
  getValueFromMoneyField,
  mstotime,
};
