const { sequelizeServer } = require("../configs/sequelize.config");

async function GetAllRoles() {
  try {
    const roles = sequelizeServer.models.roles.findAll({});
    return roles;
  } catch (err) {
    console.log(err);
  }
}

async function AddRole(role) {
  try {
    var result = sequelizeServer.models.roles.create(role);
    return result;
  } catch (error) {
    return error;
  }
}

async function UpdateRole(role, id) {
  try {
    var result = sequelizeServer.models.roles.update(role, {
      where: { role_id: id },
    });
    return result;
  } catch (error) {
    return error;
  }
}

async function DeleteRole(id) {
  try {
    var result = sequelizeServer.models.roles.destroy({
      where: { role_id: id },
    });
    return result;
  } catch (error) {
    return error;
  }
}

module.exports = {
  GetAllRoles,
  AddRole,
  UpdateRole,
  DeleteRole,
};
