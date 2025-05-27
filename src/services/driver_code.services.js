const { sequelizeServer } = require("../configs/sequelize.config");

async function GetAllDriverCodes() {
  try {
    const driver_codes = sequelizeServer.models.driver_codes.findAll({
      where: { is_valid: true },
    });
    return driver_codes;
  } catch (error) {
    return error;
  }
}

async function GetDriverCodeByID(id) {
  try {
    const driver_code = sequelizeServer.models.driver_codes.findByPk(id);
    return driver_code;
  } catch (error) {
    return error;
  }
}

async function AddDriverCode(driver_codes) {
  try {
    var result = sequelizeServer.models.driver_codes.create(driver_codes);
    return result;
  } catch (error) {
    return error;
  }
}

async function DeleteDriverCode(id) {
  try {
    var result = sequelizeServer.models.driver_codes.update(
      {
        is_valid: false,
      },
      {
        where: { id: id },
      }
    );
    return result;
  } catch (error) {
    return error;
  }
}

async function EditDriverCode(id, driver_codes) {
  try {
    var result = sequelizeServer.models.driver_codes.update(driver_codes, {
      where: { id: id },
    });
    return result;
  } catch (error) {
    return error;
  }
}

module.exports = {
  GetAllDriverCodes,
  AddDriverCode,
  DeleteDriverCode,
  EditDriverCode,
  GetDriverCodeByID,
};
