var express = require("express");

var router = express.Router();
const auth = require("../middlewares/auth");
const {
  getNotifications,
  markReadForUser,
  clearAllNotifications,
  DeleteOneNotification,
  GetUnreadNotifications,
  GetUserSettings,
  UpdateUserNotificationsSettings,
  UpdateUserSettingPhone,
} = require("../controllers/notifications.controller");

router.post("/notifications/getAll", auth, getNotifications);
router.get("/notifications/getUnread/:id", auth, GetUnreadNotifications);
router.get("/notifications/markRead", auth, markReadForUser);
router.delete("/notifications/clearAll", auth, clearAllNotifications);
router.delete("/notifications/deleteOne/:id", auth, DeleteOneNotification);
router.get("/notifications/getSettings/:id", auth, GetUserSettings);
router.post(
  "/notifications/updateSettings",
  auth,
  UpdateUserNotificationsSettings
);
router.post("/notifications/updateSettingsPhone", auth, UpdateUserSettingPhone);

module.exports = router;
