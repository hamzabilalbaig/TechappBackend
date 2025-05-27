const { sequelizeServer } = require("../configs/sequelize.config");

const fs = require("fs");

async function GetAllMasterCodes() {
  try {
    const master_codes = sequelizeServer.models.master_code.findAll({
      include: "detail_codes",
    });
    return master_codes;
  } catch (error) {
    return error;
  }
}

async function AddDetailCode(detail_code) {
  try {
    var result = sequelizeServer.models.detail_code.create(detail_code);
    return result;
  } catch (error) {
    return error;
  }
}

async function DeleteDetailCode(detail_code_id) {
  try {
    var result = sequelizeServer.models.detail_code.destroy({
      where: { detail_code_id: detail_code_id },
    });
    return result;
  } catch (error) {
    return error;
  }
}

async function EditDetailCode(detail_code_id, detail_code) {
  try {
    var result = sequelizeServer.models.detail_code.update(detail_code, {
      where: { detail_code_id: detail_code_id },
    });
    return result;
  } catch (error) {
    return error;
  }
}

async function GetDetailForMaster(master_code_id) {
  try {
    const master_codes = await sequelizeServer.models.master_code.findOne({
      include: "detail_codes",
      where: { master_code_id },
    });
    console.log(master_codes);
    return master_codes?.detail_codes?.map((detail_code) => {
      return detail_code.description;
    });
  } catch (error) {
    return error;
  }
}

module.exports = {
  GetAllMasterCodes,
  AddDetailCode,
  DeleteDetailCode,
  EditDetailCode,
  GetDetailForMaster,
};
