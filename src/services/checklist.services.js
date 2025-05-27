const { sequelizeServer, baseUrl } = require("../configs/sequelize.config");
const { Op } = require("sequelize");

async function createChecklist(data) {
  try {
    var result = await sequelizeServer.models.checklist.create(data);
    return result;
  } catch (error) {
    console.log(error);
    return error;
  }
}

async function getAllChecklist(user_id) {
  try {
    var result = await sequelizeServer.models.checklist.findAll({
      where: {
        user_id,
      },
    });
    return result;
  } catch (error) {
    console.log(error);
    return error;
  }
}

async function updateChecklist(data) {
  try {
    var result = await sequelizeServer.models.checklist.update(data, {
      where: {
        id: data.id,
      },
    });
    return result;
  } catch (error) {
    console.log(error);
    return error;
  }
}

async function deleteChecklist(id) {
  try {
    var result = await sequelizeServer.models.checklist.destroy({
      where: {
        id,
      },
    });
    return result;
  } catch (error) {
    console.log(error);
    return error;
  }
}

async function deleteAllChecklist(user_id) {
  try {
    var result = await sequelizeServer.models.checklist.destroy({
      where: {
        user_id,
      },
    });
    return result;
  } catch (error) {
    console.log(error);
    return error;
  }
}

async function markChecked(data) {
  try {
    var result = await sequelizeServer.models.checklist.update(
      {
        checked: data.checked,
      },
      {
        where: {
          id: data.id,
        },
      }
    );
    return result;
  } catch (error) {
    console.log(error);
    return error;
  }
}

async function markAllChecked(data) {
  try {
    var result = await sequelizeServer.models.checklist.update(
      {
        checked: data.checked,
      },
      {
        where: {
          user_id: data.user_id,
        },
      }
    );
    return result;
  } catch (error) {
    console.log(error);
    return error;
  }
}

async function markAllCheckedByTableName(data) {
  try {
    var result = await sequelizeServer.models.checklist.update(
      {
        checked: data.checked,
      },
      {
        where: {
          user_id: data.user_id,
          table_name: data.table_name,
        },
      }
    );
    return result;
  } catch (error) {
    console.log(error);
    return error;
  }
}

async function deleteAllByTableName(data) {
  try {
    var result = await sequelizeServer.models.checklist.destroy({
      where: {
        user_id: data.user_id,
        table_name: data.table_name,
      },
    });
    return result;
  } catch (error) {
    console.log(error);
    return error;
  }
}

async function searchChecklist(data) {
  try {
    var result = await sequelizeServer.models.checklist.findAll({
      where: {
        [Op.or]: [
          {
            text: {
              [Op.iLike]: `%${data.search}%`,
            },
          },
          {
            table_name: {
              [Op.iLike]: `%${data.search}%`,
            },
          },
          {
            table_id: {
              [Op.iLike]: `%${data.search}%`,
            },
          },
        ],
        user_id: data.user_id,
      },
    });
    return result;
  } catch (error) {
    console.log(error);
    return error;
  }
}

module.exports = {
  createChecklist,
  getAllChecklist,
  updateChecklist,
  deleteChecklist,
  deleteAllChecklist,
  markChecked,
  markAllChecked,
  markAllCheckedByTableName,
  deleteAllByTableName,
  searchChecklist,
};
