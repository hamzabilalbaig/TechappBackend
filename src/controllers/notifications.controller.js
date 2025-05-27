const {
  getNotificationsByUserId,
  markRead,
  deleteNotification,
  clearNotification,
  getUnreadNotificationCount,
  getUserNotificationsSetting,
  updateUserSetting,
  updateUserSettingPhone,
} = require("../services/notifications.services");

async function getNotifications(req, res, next) {
  try {
    const result = await getNotificationsByUserId(
      req.user.user_id,
      req.body.filters
    );
    res.json({
      success: true,
      message: "list of notifications",
      data: result,
    });
  } catch (error) {
    console.log(error);
    res.json({
      success: false,
      message: "Unexpected error while getting the notifications",
      data: [],
    });
    next(error);
  }
}

async function markReadForUser(req, res, next) {
  try {
    const result = await markRead(req.user.user_id);
    res.json({
      success: true,
      message: "Marked Read",
      data: result,
    });
  } catch (error) {
    console.log(error);
    res.json({
      success: false,
      message: "Unexpected error while getting the notifications",
      data: [],
    });
    next(error);
  }
}

async function clearAllNotifications(req, res, next) {
  try {
    const result = await clearNotification(req.user.user_id);
    res.json({
      success: true,
      message: "list of notifications",
      data: result,
    });
  } catch (error) {
    console.log(error);
    res.json({
      success: false,
      message: "Unexpected error while getting the notifications",
      data: [],
    });
    next(error);
  }
}

async function DeleteOneNotification(req, res, next) {
  try {
    const result = await deleteNotification(req.params.id);
    res.json({
      success: true,
      message: "list of notifications",
      data: result,
    });
  } catch (error) {
    console.log(error);
    res.json({
      success: false,
      message: "Unexpected error while getting the notifications",
      data: [],
    });
    next(error);
  }
}
async function GetUnreadNotifications(req, res, next) {
  try {
    const result = await getUnreadNotificationCount(req.params.id);
    res.json({
      success: true,
      message: "list of notifications",
      data: result,
    });
  } catch (error) {
    console.log(error);
    res.json({
      success: false,
      message: "Unexpected error while getting the notifications",
      data: [],
    });
    next(error);
  }
}

async function GetUserSettings(req, res, next) {
  try {
    const result = await getUserNotificationsSetting(req.params.id);
    res.json({
      success: true,
      message: "list of notifications Settings",
      data: result,
    });
  } catch (error) {
    console.log(error);
    res.json({
      success: false,
      message: "Unexpected error while getting the notifications",
      data: error,
    });
    next(error);
  }
}

async function UpdateUserNotificationsSettings(req, res, next) {
  try {
    const result = await updateUserSetting(req.body.settings, req.body.id);
    res.json({
      success: true,
      message: "list of notifications Settings",
      data: result,
    });
  } catch (error) {
    console.log(error);
    res.json({
      success: false,
      message: "Unexpected error while getting the notifications",
      data: [],
    });
    next(error);
  }
}
async function UpdateUserSettingPhone(req, res, next) {
  try {
    const result = await updateUserSettingPhone(req.body.settings, req.body.id);
    res.json({
      success: true,
      message: "list of notifications Settings",
      data: result,
    });
  } catch (error) {
    console.log(error);
    res.json({
      success: false,
      message: "Unexpected error while getting the notifications",
      data: [],
    });
    next(error);
  }
}

module.exports = {
  getNotifications,
  markReadForUser,
  clearAllNotifications,
  DeleteOneNotification,
  GetUnreadNotifications,
  GetUserSettings,
  UpdateUserNotificationsSettings,
  UpdateUserSettingPhone,
};
