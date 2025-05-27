const { sequelizeServer } = require("../configs/sequelize.config");
const { Novu, ChannelTypeEnum } = require("@novu/node");

const novu = new Novu(process.env.NOVU_API_KEY);

async function getNotificationsByUserId(user_id, filters) {
  try {
    const notifications =
      await sequelizeServer.models.notifications.findAndCountAll({
        limit: filters.limit,
        offset: filters.offset,
        where: { user_id },
        order: [["created_on", "DESC"]],
      });
    return notifications;
  } catch (err) {
    console.log(err);
  }
}

async function markRead(user_id) {
  try {
    const notifications = await sequelizeServer.models.notifications.update(
      { read: true },
      {
        where: { user_id },
      }
    );
    return notifications;
  } catch (err) {
    console.log(err);
  }
}

async function clearNotification(user_id) {
  try {
    const notifications = await sequelizeServer.models.notifications.destroy({
      where: { user_id },
    });
    return notifications;
  } catch (err) {
    console.log(err);
  }
}

async function deleteNotification(id) {
  try {
    const notifications = await sequelizeServer.models.notifications.destroy({
      where: { id },
    });
    return notifications;
  } catch (err) {
    console.log(err);
  }
}

async function getUnreadNotificationCount(id) {
  try {
    const notifications =
      await sequelizeServer.models.notifications.findAndCountAll({
        where: {
          user_id: id,
          read: {
            [sequelizeServer.Sequelize.Op.not]: "true", // Find where read is false or null
          },
        },
      });
    return notifications;
  } catch (err) {
    console.log(err);
  }
}

async function getUserNotificationsSetting(id) {
  try {
    const setting = await novu.subscribers.getPreference(id);
    return setting.data;
  } catch (err) {
    console.log(err);
  }
}

async function updateUserSetting(settings, id) {
  try {
    if (settings?.length > 0) {
      settings.forEach(async (setting) => {
        console.log(setting);
        await novu.subscribers.updatePreference(id, setting?.id, {
          enabled: setting?.push,
          channel: { type: ChannelTypeEnum.PUSH, enabled: setting?.push },
        });
      });
      return true;
    } else {
      return false;
    }
  } catch (err) {
    console.log(err);
  }
}

async function updateUserSettingPhone(settings, id) {
  try {
    if (settings?.length > 0) {
      settings.forEach(async (setting) => {
        console.log(setting);
        await novu.subscribers.updatePreference(id, setting?.id, {
          enabled: setting?.push,
          channel: { type: ChannelTypeEnum.PUSH, enabled: setting?.push },
        });

        await novu.subscribers.updatePreference(id, setting?.id, {
          enabled: setting?.email,
          channel: { type: ChannelTypeEnum.EMAIL, enabled: setting?.email },
        });
      });
      return true;
    } else {
      return false;
    }
  } catch (err) {
    console.log(err);
  }
}

module.exports = {
  getNotificationsByUserId,
  markRead,
  clearNotification,
  deleteNotification,
  getUnreadNotificationCount,
  getUserNotificationsSetting,
  updateUserSetting,
  updateUserSettingPhone,
};
