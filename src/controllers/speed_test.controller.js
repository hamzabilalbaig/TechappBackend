const {
  addSpeedTestTasks,
  findAllSpeedTestTasksByVisit,
  findAllSpeedTestTasksByTicket,
  updateScreenShot,
  updateServiceMode,
  hardRemoveSpeedTestTasks,
} = require("../services/speed_test.services");
const { responseFormat } = require("../utils/utils");

async function createSpeedTestTask(req, res, next) {
  try {
    const result = await addSpeedTestTasks(req?.body);
    res.json(responseFormat(true, result, "Speed Test Task Added"));
  } catch (ex) {
    res.json(
      responseFormat(false, error, "Unexpected error while Adding the Task")
    );
    next(error);
  }
}

async function getSpeedTestTasksByVisit(req, res, next) {
  try {
    const result = await findAllSpeedTestTasksByVisit(req?.params?.id);
    res.json(responseFormat(true, result, "Speed Test Tasks List"));
  } catch (ex) {
    res.json(
      responseFormat(false, error, "Unexpected error while Getting the Tasks")
    );
    next(error);
  }
}

async function getSpeedTestTasksByTicket(req, res, next) {
  try {
    const result = await findAllSpeedTestTasksByTicket(req?.params?.id);
    res.json(responseFormat(true, result, "Speed Test Tasks List"));
  } catch (ex) {
    res.json(
      responseFormat(false, error, "Unexpected error while Getting the Tasks")
    );
    next(error);
  }
}

async function editScreenShot(req, res, next) {
  try {
    const result = await updateScreenShot(req?.params?.id, req?.body);
    res.json(responseFormat(true, result, "Speed Test Screen Shot Updated"));
  } catch (ex) {
    res.json(responseFormat(false, error, "Unexpected error while Updating"));
    next(error);
  }
}

async function editServiceMode(req, res, next) {
  try {
    const result = await updateServiceMode(req?.params?.id, req?.body);
    res.json(responseFormat(true, result, "Service Mode Updated"));
  } catch (ex) {
    res.json(responseFormat(false, error, "Unexpected error while Updating"));
    next(error);
  }
}

async function deleteTask(req, res, next) {
  try {
    const result = await hardRemoveSpeedTestTasks(req?.params?.id, req?.body);
    res.json(responseFormat(true, result, "Service Mode deleted"));
  } catch (ex) {
    res.json(responseFormat(false, error, "Unexpected error while deleting"));
    next(error);
  }
}

module.exports = {
  createSpeedTestTask,
  getSpeedTestTasksByVisit,
  getSpeedTestTasksByTicket,
  editScreenShot,
  editServiceMode,
  deleteTask,
};
