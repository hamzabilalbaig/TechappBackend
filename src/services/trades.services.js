const { sequelizeServer, baseUrl } = require("../configs/sequelize.config");
const { Op } = require("sequelize");
const _ = require("lodash");

async function getAllTrades() {
  return await sequelizeServer.models.trades.findAll({
    where: { is_valid: true, hidden: false },
  });
}

async function deleteTrade(id) {
  return await sequelizeServer.models.trades.update(
    { is_valid: false },
    {
      where: { trade_id: id },
    }
  );
}

async function addTrade(trade) {
  return await sequelizeServer.models.trades.create(trade);
}

async function modifyTrade(id, trade) {
  return await sequelizeServer.models.trades.update(trade, {
    where: { trade_id: id },
  });
}

async function getUserTrades(id) {
  return await sequelizeServer.models.users_trades.findAll({
    include: [
      {
        model: sequelizeServer.models.trades,
        include: ["trades_types"],
        where: { is_valid: true },
        as: "trade",
      },
    ],
    where: { user_id: id },
  });
}

async function getTradeTypes(id, categoyId) {
  if (id) {
    const userCerts = await sequelizeServer.models.users.findAll({
      include: [
        {
          model: sequelizeServer.models.users_trades,
          as: "users_trades",
          include: [
            {
              model: sequelizeServer.models.trades_types,
              as: "trades_types",
              include: [
                {
                  model: sequelizeServer.models.cert_type,
                  as: "cert_type",
                  where: { cert_category_id: categoyId },
                },
              ],
            },
          ],
        },
      ],
      where: { user_id: id },
    });
    const certTypes = userCerts.map((user) => {
      return user.users_trades.map((userTrade) => {
        return userTrade.trades_types.map((tradeType) => {
          return tradeType.cert_type;
        });
      });
    });
    const flattenedCertTypes = certTypes.flat(2);
    const distinctTypes = _.uniqBy(flattenedCertTypes, "cert_type_id");
    // const filteredArray = _.filter(distinctTypes, (obj) => {
    //   return !obj.equivalent_type_id || !_.some(distinctTypes, { cert_type_id: obj.equivalent_type_id });
    // });

    // return flattenedCertTypes;
    return distinctTypes;
  } else {
    return null;
  }
}

async function checkTypeException(id, userId) {
  const userCerts = await sequelizeServer.models.certification_master.findOne({
    where: { user_id: userId, is_valid: true, cert_type_id: id },
  });
  return userCerts;
}

async function getCertTypeProviders(certTypeId) {
  const data = await sequelizeServer.models.cert_types_providers.findAll({
    include: [
      {
        model: sequelizeServer.models.cert_provider,
        as: "cert_provider",
      },
    ],
    where: { cert_type_id: certTypeId },
  });
  const certProviders = data?.map((item) => item?.cert_provider);
  return certProviders;
}
// async function getTradesCategories() {
//   return await sequelizeServer.models.trades.findAll({
//     attributes: [
//         "trade_id",
//         "trade_name",
//         "trade_description",
//     ],
//     where: { is_valid: true },
//   });
// }

module.exports = {
  getAllTrades,
  deleteTrade,
  addTrade,
  modifyTrade,
  getUserTrades,
  getTradeTypes,
  getCertTypeProviders,
};
