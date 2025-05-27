const { sequelizeServer } = require("../configs/sequelize.config");
const { Op } = require("sequelize");
const fs = require("fs");
var _loadash = require("lodash");
const {
  getRemovedItemByComparingArrays,
  getReAddedItemByComparingArrays,
  getNewlyAddedItemByComparingArrays,
  fromDir,
} = require("../utils/utils");

async function iudSpeedTestTasks(visit_id, tasks) {
  try {
    const data = await sequelizeServer.models.speed_test_task.findAll({
      where: { visit_id: visit_id },
    });

    let removedTasks = getRemovedItemByComparingArrays(data, tasks, "id");
    let reAddedTasks = getReAddedItemByComparingArrays(data, tasks, "id");
    let newlyAddedTasks = getNewlyAddedItemByComparingArrays(data, tasks, "id");

    if (removedTasks?.length > 0) {
      await removeSpeedTestTasks(removedTasks);
    }
    if (reAddedTasks?.length > 0) {
      await editSpeedTestTasks(reAddedTasks);
    }
    if (newlyAddedTasks?.length > 0) {
      await addNewSpeedTestTasks(newlyAddedTasks);
    }

    return "Speed Test Updated";
  } catch (error) {
    return error;
  }
}
async function updateScreenShot(id, data) {
  try {
    const result = await sequelizeServer.models.speed_test_task.update(
      { Screenshot: data?.name, date_updated: data?.date },
      {
        where: {
          id: id,
        },
      }
    );
    return result;
  } catch (error) {
    return ex;
  }
}

async function updateServiceMode(id, data) {
  try {
    const result = await sequelizeServer.models.speed_test_task.update(
      { service_mode: data?.name, date_updated: data?.date },
      {
        where: {
          id: id,
        },
      }
    );
    return result;
  } catch (error) {
    return ex;
  }
}
async function addSpeedTestTasks(data) {
  try {
    let dataToSave = [];
    if (data?.band?.length > 0) {
      data?.band?.forEach((element) => {
        dataToSave.push({
          band: element,
          date_created: data?.date_created,
          date_updated: data?.date_updated,
          is_valid: data?.is_valid,
          sector_label: data?.sector_label,
          task_id: data?.task_id,
          test_type: data?.test_type,
          visit_id: data?.visit_id,
        });
      });

      
      let result = await sequelizeServer.models.speed_test_task.bulkCreate(
        dataToSave
      );
      if (result?.id != 0) {
        result = await sequelizeServer.models.speed_test_task.update(
          { task_id: `${data?.task_id}_${result?.id}` },
          {
            where: {
              id: result?.id,
            },
          }
        );
      }

      return result;
    }
    return 'No Band Selected'
  } catch (ex) {
    return ex;
  }
}

async function addNewSpeedTestTasks(data) {
  try {
    const result = await sequelizeServer.models.speed_test_task.bulkCreate(
      data
    );
    return result;
  } catch (ex) {
    return ex;
  }
}

async function removeSpeedTestTasks(data) {
  try {
    data?.forEach(async (d) => {
      await sequelizeServer.models.speed_test_task.update(
        { is_valid: false },
        {
          where: {
            id: d?.id,
          },
        }
      );
    });
  } catch (ex) {
    return ex;
  }
}

async function hardRemoveSpeedTestTasks(id, data) {
  try {
    const result = await sequelizeServer.models.speed_test_task.destroy({
      where: {
        id: id,
      },
    });
    if (result == 1) {
      if (data?.Screenshot) {
        const path = `${__dirname}../../../public/speedTestImages/${data?.Screenshot}`;
        await fs.unlink(path, (err) => {
          if (err) throw err;
          console.log("File Deleted Successfully");
        });
      }

      if (data?.service_mode) {
        const path = `${__dirname}../../../public/speedTestImages/${data?.service_mode}`;
        await fs.unlink(path, (err) => {
          if (err) throw err;
          console.log("File Deleted Successfully");
        });
      }

      return "File Deleted";
    } else {
      return "File Not Deleted";
    }
  } catch (ex) {
    return ex;
  }
}

async function editSpeedTestTasks(data) {
  try {
    data?.forEach(async (d) => {
      await sequelizeServer.models.speed_test_task.update(
        Object.assign(d, { is_valid: true }),
        {
          where: {
            id: d?.id,
          },
        }
      );
    });
  } catch (ex) {
    return ex;
  }
}
async function findAllSpeedTestTasksByVisit(visit_id) {
  try {
    const result = await sequelizeServer.models.speed_test_task.findAll({
      where: {
        visit_id: visit_id,
      },
    });
    return result;
  } catch (ex) {
    return ex;
  }
}

async function findAllSpeedTestTasksByTicket(ticket_id) {
  try {
    const result = await sequelizeServer.models.speed_test_task.findAll({
      include: [
        {
          model: sequelizeServer.models.visits,
          as: "visit",
          where: { ticket_id: ticket_id },
        },
      ],
    });
    return result;
  } catch (ex) {
    return ex;
  }
}

async function editSpeedTestTask(id, data) {
  try {
    const result = await sequelizeServer.models.speed_test_task.update(data, {
      where: { id: id },
    });
    return result;
  } catch (ex) {
    return ex;
  }
}

module.exports = {
  addSpeedTestTasks,
  editSpeedTestTask,
  findAllSpeedTestTasksByTicket,
  findAllSpeedTestTasksByVisit,
  updateScreenShot,
  updateServiceMode,
  hardRemoveSpeedTestTasks,
};
