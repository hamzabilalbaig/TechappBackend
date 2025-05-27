const { sequelizeServer, baseUrl } = require("../configs/sequelize.config");
const Sequelize = require("sequelize");
const { sendGridMail } = require("../configs/sendGrid.config");
const fs = require("fs");
var _loadash = require("lodash");
const {
  getFileExtension,
  fromDir,
  miliToTime,
  mstotime,
} = require("../utils/utils");
const visits = require("../models/visits");
const path = require("path");
const { USER_ATTRIBUES } = require("../utils/attributes");
const Op = Sequelize.Op;
const { transporter } = require("../configs/mail.config");
const { Novu, PushProviderIdEnum } = require("@novu/node");
const novu = new Novu(process.env.NOVU_API_KEY);
const { promisify } = require("util");

async function getTimeData(id) {
  try {
    const result = await sequelizeServer.models.visits.findOne({
      where: { visit_id: id },
    });
    if (result) {
      return {
        time_in: result?.time_in,
        time_out: result?.time_out,
        on_site_time: miliToTime(result?.on_site_time),
        travel_time_in: result?.travel_time_in,
        travel_time_out: result?.travel_time_out,
        travel_time: miliToTime(result?.travel_time),
        return_travel_time_in: result?.return_travel_time_in,
        return_travel_time_out: result?.return_travel_time_out,
        total_return_travel_time: miliToTime(result?.total_return_travel_time),
        total_visit_time: miliToTime(result?.total_visit_time),
        total_travel_time: miliToTime(result?.total_travel_time),
      };
    }
    return result;
  } catch (error) {}
}

async function setTravelTimeIn(model, id, user) {
  try {
    await sequelizeServer.models.visit_activity.create({
      visit_id: id,
      user_id: user.user_id,
      time: model?.travel_time_in,
      activity: "tti",
    });

    const result = await sequelizeServer.models.visits.update(
      {
        travel_time_in: model?.travel_time_in,
        last_modified_visit: new Date(),
        last_modify_by: user.user_id,
      },
      { where: { visit_id: id } }
    );

    return result;
  } catch (error) {
    console.log(error);
    return error;
  }
}

async function setTravelTimeOut(model, id, user) {
  try {
    await sequelizeServer.models.visit_activity.create({
      visit_id: id,
      user_id: user.user_id,
      time: model?.travel_time_out,
      activity: "tto",
    });

    const visit = await sequelizeServer.models.visits.findOne({
      where: { visit_id: id },
    });
    let result = 0;
    if (visit?.travel_time_in) {
      let travel_time_in = visit?.travel_time_in;
      let travel_time =
        new Date(model?.travel_time_out) - new Date(travel_time_in);
      result = await sequelizeServer.models.visits.update(
        {
          travel_time_out: model?.travel_time_out,
          travel_time: travel_time,
          total_travel_time: travel_time,
          total_visit_time:
            parseInt(visit?.on_site_time ?? 0) +
            travel_time +
            parseInt(visit?.total_return_travel_time ?? 0),
          last_modified_visit: new Date(),
          last_modify_by: user.user_id,
          //total_visit_time: travel_time,
        },
        { where: { visit_id: id } }
      );
      if (result == 1) {
        return miliToTime(travel_time);
      }
    }

    return result;
  } catch (error) {
    return error;
  }
}

async function setTimeIn(model, id, user) {
  try {
    await sequelizeServer.models.visit_activity.create({
      visit_id: id,
      user_id: user.user_id,
      time: model?.time_in,
      activity: "ti",
    });
    const result = await sequelizeServer.models.visits.update(
      {
        time_in: model?.time_in,
        time_in_location: model?.time_in_location,
        last_modified_visit: new Date(),
        last_modify_by: user.user_id,
      },
      { where: { visit_id: id } }
    );

    return result;
  } catch (error) {}
}

async function resetTimes(id, data, user) {
  try {
    let result = null;
    switch (data?.type) {
      case "tt":
        result = await resetTravelTime(id, user);
        break;
      case "ot":
        result = await resetOnsiteTime(id, user);
      case "rtt":
        result = await resetReturnTravelTime(id, user);
      default:
        break;
    }
  } catch (error) {
    return error;
  }
}

async function resetTravelTime(id, user) {
  const result = await sequelizeServer.models.visits.update(
    {
      travel_time_in: null,
      travel_time_out: null,
      travel_time: null,
      time_in: null,
      time_out: null,
      on_site_time: null,
      return_travel_time_in: null,
      return_travel_time_out: null,
      total_return_travel_time: null,
      total_travel_time: null,
      total_visit_time: null,
      last_modified_visit: new Date(),
      last_modify_by: user.user_id,
    },
    { where: { visit_id: id } }
  );
  return result;
}

async function resetOnsiteTime(id, user) {
  const result = await sequelizeServer.models.visits.update(
    {
      time_in: null,
      time_out: null,
      on_site_time: null,
      return_travel_time_in: null,
      return_travel_time_out: null,
      total_return_travel_time: null,
      total_travel_time: null,
      total_visit_time: null,
      last_modified_visit: new Date(),
      last_modify_by: user.user_id,
    },
    { where: { visit_id: id } }
  );
  return result;
}

async function resetReturnTravelTime(id, user) {
  const result = await sequelizeServer.models.visits.update(
    {
      return_travel_time_in: null,
      return_travel_time_out: null,
      total_return_travel_time: null,
      total_travel_time: null,
      total_visit_time: null,
      last_modified_visit: new Date(),
      last_modify_by: user.user_id,
    },
    { where: { visit_id: id } }
  );
  return result;
}

async function setTimeOut(model, id, user) {
  try {
    await sequelizeServer.models.visit_activity.create({
      visit_id: id,
      user_id: user.user_id,
      time: model?.time_out,
      activity: "to",
    });
    const visit = await sequelizeServer.models.visits.findOne({
      where: { visit_id: id },
    });
    let result = 0;
    if (visit?.time_in) {
      let time_in = visit?.time_in;
      let on_site_time = new Date(model?.time_out) - new Date(time_in);
      result = await sequelizeServer.models.visits.update(
        {
          time_out: model?.time_out,
          time_out_location: model?.time_out_location,
          on_site_time: on_site_time,
          total_visit_time:
            on_site_time +
            parseInt(visit?.travel_time ?? 0) +
            parseInt(visit?.total_return_travel_time ?? 0),
          last_modified_visit: new Date(),
          last_modify_by: user.user_id,
          //total_visit_time: parseInt(visit?.total_visit_time) + on_site_time,
        },
        { where: { visit_id: id } }
      );
      if (result == 1) {
        return miliToTime(on_site_time);
      }
    }

    return result;
  } catch (error) {
    return error;
  }
}

async function setReturnTravelTimeIn(model, id, user) {
  try {
    await sequelizeServer.models.visit_activity.create({
      visit_id: id,
      user_id: user.user_id,
      time: model?.return_travel_time_in,
      activity: "rti",
    });
    const result = await sequelizeServer.models.visits.update(
      {
        return_travel_time_in: model?.return_travel_time_in,
        last_modified_visit: new Date(),
        last_modify_by: user.user_id,
      },
      { where: { visit_id: id } }
    );

    return result;
  } catch (error) {
    return error;
  }
}

async function setReturnTravelTimeOut(model, id, user) {
  try {
    await sequelizeServer.models.visit_activity.create({
      visit_id: id,
      user_id: user.user_id,
      time: model?.return_travel_time_out,
      activity: "rto",
    });
    const visit = await sequelizeServer.models.visits.findOne({
      where: { visit_id: id },
    });
    let result = 0;
    if (visit?.return_travel_time_in) {
      let return_travel_time_in = visit?.return_travel_time_in;
      let total_return_travel_time =
        new Date(model?.return_travel_time_out) -
        new Date(return_travel_time_in);
      let total_travel_time =
        parseInt(visit?.total_travel_time) + total_return_travel_time;
      result = await sequelizeServer.models.visits.update(
        {
          return_travel_time_out: model?.return_travel_time_out,
          total_return_travel_time: total_return_travel_time,
          total_travel_time: total_travel_time,
          total_visit_time: parseInt(visit?.on_site_time) + total_travel_time,
          last_modified_visit: new Date(),
          last_modify_by: user.user_id,
        },
        { where: { visit_id: id } }
      );
      if (result == 1) {
        return miliToTime(total_return_travel_time);
      }
    }

    return result;
  } catch (error) {
    return error;
  }
}

async function setTotalAmount(data) {
  try {
    var result = await sequelizeServer.models.visits.update(
      {
        total_amount: data?.amount,
        last_modified_visit: new Date(),
      },
      { where: { visit_id: data?.id } }
    );

    return result;
  } catch (error) {
    console.log(error);
  }
}

async function AllVisits(user) {
  try {
    const visits = await sequelizeServer.models.visits.findAll({
      include: [
        "visit_additional_pictures",
        "tower_visits",
        "midband_fdd_tdd_scops",
        "visit_ratings",
        {
          model: sequelizeServer.models.users,
          attributes: USER_ATTRIBUES,
          as: "field_engineer",
        },
        {
          model: sequelizeServer.models.tickets,
          include: [
            {
              model: sequelizeServer.models.projects,
              as: "project",
              include: ["project_managers", "users", "sites"],
            },
            "site",
          ],
          as: "ticket",
        },
      ],
      where: { is_valid: true },
    });
    if (user?.user_type?.toLowerCase() == "field engineer") {
      return visits?.filter((v) => v?.field_engineer_id === user?.user_id);
    }
    return visits;
  } catch (err) {
    console.log(err);
  }
}

async function getVisitsPaginationForFE(filters, user) {
  try {
    const visits = await sequelizeServer.models.visits.findAndCountAll({
      include: [
        {
          model: sequelizeServer.models.users,
          attributes: USER_ATTRIBUES,
          as: "field_engineer",
        },
        {
          model: sequelizeServer.models.tickets,
          include: ["project", "site"],
          as: "ticket",
        },
      ],
      limit: filters.limit,
      offset: filters.offset,
      where: { is_valid: true, field_engineer_id: user?.user_id },
      distinct: "visits.visit_id",
    });

    return visits;
  } catch (error) {
    console.log(error);
    return error;
  }
}

async function getVisitsPaginationForPM(filters, user) {
  try {
    const visits = await sequelizeServer.models.visits.findAndCountAll({
      include: [
        {
          model: sequelizeServer.models.users,
          attributes: USER_ATTRIBUES,
          as: "field_engineer",
        },
        {
          model: sequelizeServer.models.tickets,
          include: ["project", "site"],
          where: {
            project_id: {
              [Op.in]: sequelizeServer.literal(
                "(SELECT project_id FROM projects_project_managers WHERE user_id = " +
                  user.user_id +
                  ")"
              ),
            },
          },
          as: "ticket",
        },
      ],
      limit: filters.limit,
      offset: filters.offset,
      where: { is_valid: true },
      distinct: "visits.visit_id",
    });

    return visits;
  } catch (error) {
    console.log(error);
    return error;
  }
}

async function getVisitsPaginationAdmin(filters) {
  try {
    const visits = await sequelizeServer.models.visits.findAndCountAll({
      include: [
        {
          model: sequelizeServer.models.users,
          attributes: USER_ATTRIBUES,
          as: "field_engineer",
        },
        {
          model: sequelizeServer.models.tickets,
          include: ["project", "site"],
          as: "ticket",
        },
      ],
      limit: filters.limit,
      offset: filters.offset,
      where: { is_valid: true },
      distinct: "visits.visit_id",
    });

    return visits;
  } catch (error) {
    console.log(error);
    return error;
  }
}

async function visitPagination(filters, user) {
  var visits = [];
  switch (user?.user_type?.toLowerCase()) {
    case "field engineer":
      visits = await getVisitsPaginationForFE(filters, user);
      break;
    case "admin":
      visits = await getVisitsPaginationAdmin(filters);
      break;
    case "project manager":
      visits = await getVisitsPaginationForPM(filters, user);
      break;
    default:
      visits = await getVisitsPaginationAdmin(filters);
  }
  return visits;
}
async function getFilterVisitsForFE(filters, paginationConfig, user) {
  try {
    var result = await sequelizeServer.models.visits.findAndCountAll({
      include: [
        "visit_additional_pictures",
        "tower_visits",
        "midband_fdd_tdd_scops",
        "visit_ratings",
        {
          model: sequelizeServer.models.users,
          attributes: USER_ATTRIBUES,
          as: "field_engineer",
          where: filters.fieldEngineer,
        },
        {
          model: sequelizeServer.models.tickets,
          include: [
            "project",
            {
              model: sequelizeServer.models.site,
              as: "site",
              where: filters.siteMarket,
            },
          ],
          as: "ticket",
        },
      ],

      where: {
        is_valid: true,
        [Op.or]: [
          {
            [Op.and]: [
              { pm_status: { [Op.notIn]: ["Cancelled"] } },
              { ...filters?.pm_status },
            ],
          },
        ],
        ...filters?.visitCode,
        ...filters?.visitType,
        ...filters?.visitScheduleDate,
        ...filters?.isActive,
        field_engineer_id: user?.user_id,
      },
      order: filters?.visitScheduleDateSort
        ? [[filters?.visitScheduleDateSort]]
        : [],
      offset: paginationConfig?.offset,
      limit: paginationConfig?.limit,
      distinct: "visits.visit_id",
    });
    return result;
  } catch (error) {
    return error;
  }
}

async function getFilterVisitsForAdmin(filters, paginationConfig, user) {
  try {
    var result = await sequelizeServer.models.visits.findAndCountAll({
      include: [
        "visit_additional_pictures",
        "tower_visits",
        "midband_fdd_tdd_scops",
        "visit_ratings",
        {
          model: sequelizeServer.models.users,
          attributes: USER_ATTRIBUES,
          as: "field_engineer",
          where: filters.fieldEngineer,
        },
        {
          model: sequelizeServer.models.tickets,
          include: [
            "project",
            {
              model: sequelizeServer.models.site,
              as: "site",
              where: filters.siteMarket,
            },
          ],
          as: "ticket",
        },
      ],
      where: {
        [Op.or]: [
          {
            [Op.and]: [
              { pm_status: { [Op.notIn]: ["Cancelled"] } },
              { ...filters?.pm_status },
            ],
          },
        ],
        ...filters?.visitCode,
        ...filters?.visitType,
        ...filters?.visitScheduleDate,
        ...filters?.isActive,
        ...filters?.is_valid,
      },
      order: filters?.visitScheduleDateSort
        ? [[filters?.visitScheduleDateSort]]
        : [],
      offset: paginationConfig?.offset,
      limit: paginationConfig?.limit,
      distinct: "visits.visit_id",
    });
    return result;
  } catch (error) {
    return error;
  }
}

async function getFilterVisitsForPM(filters, paginationConfig, user) {
  try {
    var result = await sequelizeServer.models.visits.findAndCountAll({
      include: [
        "visit_additional_pictures",
        "tower_visits",
        "midband_fdd_tdd_scops",
        "visit_ratings",

        {
          model: sequelizeServer.models.users,
          attributes: USER_ATTRIBUES,
          as: "field_engineer",
          where: filters.fieldEngineer,
        },
        {
          model: sequelizeServer.models.tickets,
          include: [
            "project",
            {
              model: sequelizeServer.models.site,
              as: "site",
              where: filters.siteMarket,
            },
          ],

          where: {
            project_id: {
              [Op.in]: sequelizeServer.literal(
                "(SELECT project_id FROM projects_project_managers WHERE user_id = " +
                  user.user_id +
                  ")"
              ),
            },
          },
          as: "ticket",
        },
      ],
      where: {
        is_valid: true,
        [Op.or]: [
          {
            [Op.and]: [
              { pm_status: { [Op.notIn]: ["Cancelled"] } },
              { ...filters?.pm_status },
            ],
          },
        ],
        ...filters?.visitCode,
        ...filters?.visitType,
        ...filters?.visitScheduleDate,
        ...filters?.isActive,
      },
      order: filters?.visitScheduleDateSort
        ? [[filters?.visitScheduleDateSort]]
        : [],
      offset: paginationConfig?.offset,
      limit: paginationConfig?.limit,
      distinct: "visits.visit_id",
    });
    return result;
  } catch (error) {
    return error;
  }
}

async function getAdvanceFilters(advanceFilter, sort, user) {
  let visitCode = {};
  let fieldEngineer = {};
  let siteMarket = {};
  let visitScheduleDate = {};
  let visitCodeSort = null;
  let fieldEngineerSort = null;
  let siteMarketSort = null;
  let visitScheduleDateSort = null;
  let fieldEngineerId = null;
  let isActive = null;
  let is_valid = null;
  if (user?.user_type?.toLowerCase() === "field engineer") {
    fieldEngineerId = user.user_id;
  }
  if (advanceFilter) {
    switch (advanceFilter.columnField) {
      case "market":
        if (advanceFilter.value) {
          siteMarket = {
            market: {
              [Op.iLike]: `%${advanceFilter.value}%`,
            },
          };
        }
        break;
      case "field_engineer":
        if (advanceFilter.value) {
          fieldEngineer = {
            full_name: {
              [Op.iLike]: `%${advanceFilter.value}%`,
            },
          };
        }
        break;
      case "visit_code":
        if (advanceFilter.value) {
          visitCode = {
            visit_code: {
              [Op.iLike]: `%${advanceFilter.value}%`,
            },
          };
        }
        break;
      case "scheduled_date":
        if (advanceFilter.value) {
          visitScheduleDate = {
            scheduled_date: Sequelize.where(
              Sequelize.fn("date", Sequelize.col("scheduled_date")),
              {
                [Op.eq]: advanceFilter.value,
              }
            ),
          };
        }
        break;
      case "fromToRange":
        if (advanceFilter.value) {
          visitScheduleDate = {
            scheduled_date: Sequelize.where(
              Sequelize.fn("date", Sequelize.col("scheduled_date")),
              {
                [Op.between]: advanceFilter.value,
              }
            ),
          };
          if (advanceFilter?.sort) {
            visitScheduleDateSort = [
              "scheduled_date",
              advanceFilter?.sort?.toUpperCase(),
            ];
          }
        }
        break;
      case "is_active":
        if (advanceFilter.value) {
          isActive = {
            pm_status: ["Confirmed", "	Tentative"],
          };
        }
        break;
      case "is_valid":
        if (advanceFilter.value) {
          is_valid = {
            is_valid: advanceFilter?.value?.toLowerCase()?.includes("y")
              ? false
              : true,
          };
        }
        break;
    }
  }
  if (sort) {
    switch (sort?.field) {
      case "market":
        if (sort?.sort) {
          siteMarketSort = ["market", sort?.sort?.toUpperCase()];
        }
        break;
      case "field_engineer":
        if (sort?.sort) {
          fieldEngineerSort = ["full_name", sort?.sort?.toUpperCase()];
        }
        break;
      case "visit_code":
        if (sort?.sort) {
          visitCodeSort = ["visit_code", sort?.sort?.toUpperCase()];
        }
        break;
      case "scheduled_date":
        if (sort?.sort) {
          visitScheduleDateSort = ["scheduled_date", sort?.sort?.toUpperCase()];
        }
        break;
    }
  }
  return {
    visitCode,
    fieldEngineer,
    siteMarket,
    visitScheduleDate,
    fieldEngineerId,
    siteMarketSort,
    fieldEngineerSort,
    visitCodeSort,
    isActive,
    is_valid,
    visitScheduleDateSort,
    fieldEngineerId,
  };
}

async function getAdvanceFiltersMobile(advanceFilters, sort, user) {
  let visitCode = {};
  let fieldEngineer = {};
  let siteMarket = {};
  let visitScheduleDate = {};
  let visitCodeSort = null;
  let fieldEngineerSort = null;
  let siteMarketSort = null;
  let visitScheduleDateSort = null;
  let fieldEngineerId = null;
  let isActive = null;
  let is_valid = null;
  let pm_status = null;
  let visitType = null;
  if (user?.user_type?.toLowerCase() === "field engineer") {
    fieldEngineerId = user.user_id;
  }

  advanceFilters?.forEach((advanceFilter) => {
    if (advanceFilter) {
      switch (advanceFilter.columnField) {
        case "market":
          if (advanceFilter.value) {
            siteMarket = {
              market: {
                [Op.iLike]: `%${advanceFilter.value}%`,
              },
            };
          }
          break;
        case "field_engineer":
          if (advanceFilter.value) {
            fieldEngineer = {
              full_name: {
                [Op.iLike]: `%${advanceFilter.value}%`,
              },
            };
          }
          break;
        case "pm_status":
          if (advanceFilter.value) {
            pm_status = {
              pm_status: {
                [Op.iLike]: `%${advanceFilter.value}%`,
              },
            };
          }
          break;
        case "visit_code":
          if (advanceFilter.value) {
            visitCode = {
              visit_code: {
                [Op.iLike]: `%${advanceFilter.value}%`,
              },
            };
          }
          break;
        case "visit_type":
          if (advanceFilter.value) {
            visitType = {
              visit_type: {
                [Op.iLike]: `%${advanceFilter.value}%`,
              },
            };
          }
          break;
        case "scheduled_date":
          if (advanceFilter.value) {
            visitScheduleDate = {
              scheduled_date: Sequelize.where(
                Sequelize.fn("date", Sequelize.col("scheduled_date")),
                {
                  [Op.eq]: advanceFilter.value,
                }
              ),
            };
          }
          break;

        case "is_active":
          if (advanceFilter.value) {
            isActive = {
              pm_status: ["Confirmed", "	Tentative"],
            };
          }
          break;
        case "is_valid":
          if (advanceFilter.value) {
            is_valid = {
              is_valid: advanceFilter?.value?.toLowerCase()?.includes("y")
                ? false
                : true,
            };
          }
          break;
      }
    }
  });
  if (sort) {
    switch (sort?.field) {
      case "market":
        if (sort?.sort) {
          siteMarketSort = ["market", sort?.sort?.toUpperCase()];
        }
        break;
      case "field_engineer":
        if (sort?.sort) {
          fieldEngineerSort = ["full_name", sort?.sort?.toUpperCase()];
        }
        break;
      case "visit_code":
        if (sort?.sort) {
          visitCodeSort = ["visit_code", sort?.sort?.toUpperCase()];
        }
        break;
      case "scheduled_date":
        if (sort?.sort) {
          visitScheduleDateSort = ["scheduled_date", sort?.sort?.toUpperCase()];
        }
        break;
    }
  }
  return {
    visitCode,
    fieldEngineer,
    siteMarket,
    visitScheduleDate,
    fieldEngineerId,
    siteMarketSort,
    fieldEngineerSort,
    visitCodeSort,
    isActive,
    is_valid,
    visitScheduleDateSort,
    fieldEngineerId,
    pm_status,
    visitType,
  };
}

async function filterVisits(body, user) {
  var visits = [];
  let filters = {};
  const paginationConfig = { limit: body?.limit, offset: body?.offset };
  if (body?.advanceFilter?.length > 0) {
    filters = await getAdvanceFiltersMobile(
      body?.advanceFilter,
      body?.sort,
      user
    );
  } else {
    filters = await getAdvanceFilters(body?.advanceFilter, body?.sort, user);
  }

  switch (user?.user_type?.toLowerCase()) {
    case "field engineer":
      visits = await getFilterVisitsForFE(filters, paginationConfig, user);
      break;
    case "admin":
      visits = await getFilterVisitsForAdmin(filters, paginationConfig, user);
      break;
    case "project manager":
      visits = await getFilterVisitsForPM(filters, paginationConfig, user);
      break;
    default:
      visits = await getFilterVisitsForAdmin(filters, paginationConfig, user);
  }
  return visits;
}

async function getVisitsByID(id, user) {
  let filter = {
    visit_id: id,
  };
  if (
    user?.user_type?.toLowerCase() == "field engineer" ||
    user?.user_type?.toLowerCase() == "project manager"
  ) {
    filter = {
      visit_id: id,
      is_valid: true,
    };
  }
  var calculate = await calculateTotalAmount(id);
  const result = await sequelizeServer.models.visits.findOne({
    include: [
      "visit_additional_pictures",
      "tower_visits",
      "midband_fdd_tdd_scops",
      "visit_integration",
      "visit_ratings",
      {
        model: sequelizeServer.models.users,
        attributes: USER_ATTRIBUES,
        as: "field_engineer",
      },
      {
        model: sequelizeServer.models.tickets,
        include: [
          {
            model: sequelizeServer.models.projects,
            as: "project",
            include: ["project_managers", "users", "sites"],
          },
          "site",
        ],
        as: "ticket",
      },
    ],
    where: filter,
    attributes: {
      exclude: [
        "time_in",
        "time_out",
        "on_site_time",
        "return_travel_time_in",
        "return_travel_time_out",
        "travel_time_in",
        "travel_time_out",
        "travel_time",
        "total_visit_time",
        "total_travel_time",
      ],
    },
  });

  return result;
}

async function getVisitsByUserID(data, userID) {
  let role = data?.role;
  if (role?.toLowerCase() == "field engineer") {
    const result = await sequelizeServer.models.visits.findAll({
      order: [["scheduled_date", "DESC"]],
      include: [
        "visit_additional_pictures",
        "tower_visits",
        "midband_fdd_tdd_scops",
        {
          model: sequelizeServer.models.users,
          attributes: USER_ATTRIBUES,
          as: "field_engineer",
          where: { user_id: userID },
        },
        {
          model: sequelizeServer.models.tickets,
          include: [
            {
              model: sequelizeServer.models.projects,
              as: "project",
              include: ["project_managers", "users", "sites"],
            },
            "site",
          ],
          as: "ticket",
        },
      ],
      where: { is_valid: true },
      attributes: {
        exclude: [
          "time_in",
          "time_out",
          "on_site_time",
          "return_travel_time_in",
          "return_travel_time_out",
          "travel_time_in",
          "travel_time_out",
          "travel_time",
          "total_visit_time",
          "total_travel_time",
        ],
      },
    });
    return result;
  } else if (role?.toLowerCase() == "project manager") {
    const result = await sequelizeServer.models.visits.findAll({
      order: [["scheduled_date", "DESC"]],

      include: [
        "visit_additional_pictures",
        "tower_visits",
        "midband_fdd_tdd_scops",
        {
          model: sequelizeServer.models.users,
          attributes: USER_ATTRIBUES,
          as: "field_engineer",
        },
        {
          model: sequelizeServer.models.tickets,
          include: [
            "project",
            {
              model: sequelizeServer.models.site,
              as: "site",
            },
          ],

          where: {
            project_id: {
              [Op.in]: sequelizeServer.literal(
                "(SELECT project_id FROM projects_project_managers WHERE user_id = " +
                  userID +
                  ")"
              ),
            },
          },
          as: "ticket",
        },
      ],
      where: { is_valid: true },
      attributes: {
        exclude: [
          "time_in",
          "time_out",
          "on_site_time",
          "return_travel_time_in",
          "return_travel_time_out",
          "travel_time_in",
          "travel_time_out",
          "travel_time",
          "total_visit_time",
          "total_travel_time",
        ],
      },
      distinct: "visits.visit_id",
    });
    return result;
  }

  // if (role?.toLowerCase() == "field engineer") {
  //   // let arrd= result?.filter((visit) => visit?.field_engineer_id === userID);

  //   let arr = [];
  //   result?.forEach((v) => {

  //       if (v?.field_engineer_id === userID) {
  //         arr.push(v);
  //       }

  //   });
  //   return arr
  // } else if (role?.toLowerCase() == "project manager") {
  //   let arr = [];
  //   result?.forEach((v) => {
  //     v?.ticket?.project?.project_managers?.forEach((u) => {
  //       if (u?.user_id === userID) {
  //         arr.push(v);
  //       }
  //     });
  //   });

  //   return arr;
  // }
  //return [];
}

// async function getVisitsByUserID(user) {
//   const result = await sequelizeServer.models.visits.findAll({
//     include: [
//       "visit_additional_pictures",
//       "tower_visits",
//       "midband_fdd_tdd_scops",
//       {
//         model: sequelizeServer.models.users,
//         attributes: USER_ATTRIBUES,
//         as: "field_engineer",
//       },
//       {
//         model: sequelizeServer.models.tickets,
//         include: [
//           {
//             model: sequelizeServer.models.projects,
//             as: "project",
//             include: ["project_managers", "users", "sites"],
//           },
//           "site",
//         ],
//         as: "ticket",
//       },
//     ],
//     attributes: {
//       exclude: [
//         "time_in",
//         "time_out",
//         "on_site_time",
//         "return_travel_time_in",
//         "return_travel_time_out",
//         "travel_time_in",
//         "travel_time_out",
//         "travel_time",
//         "total_visit_time",
//         "total_travel_time",
//       ],
//     },
//   });
//   if (user?.user_type?.toLowerCase() == "field engineer") {
//     return result?.filter(
//       (visit) => visit?.field_engineer?.user_id === user.user_id
//     );
//   } else if (user?.user_type?.toLowerCase() == "project manager") {
//     let arr = [];
//     result?.forEach((v) => {
//       v?.ticket?.project?.project_managers?.forEach((u) => {
//         if (u?.user_id === user?.user_id) {
//           arr.push(v);
//         }
//       });
//     });

//     return arr;
//   }
//   return result;
// }

async function getVisitsByAdmin(user) {
  const result = await sequelizeServer.models.visits.findAll({
    order: [["scheduled_date", "DESC"]],

    include: [
      "visit_additional_pictures",
      "tower_visits",
      "midband_fdd_tdd_scops",
      {
        model: sequelizeServer.models.users,
        attributes: USER_ATTRIBUES,
        as: "field_engineer",
      },
      {
        model: sequelizeServer.models.tickets,
        include: [
          {
            model: sequelizeServer.models.projects,
            as: "project",
            include: ["project_managers", "users", "sites"],
          },
          "site",
        ],
        as: "ticket",
      },
    ],
    attributes: {
      exclude: [
        "time_in",
        "time_out",
        "on_site_time",
        "return_travel_time_in",
        "return_travel_time_out",
        "travel_time_in",
        "travel_time_out",
        "travel_time",
        "total_visit_time",
        "total_travel_time",
      ],
    },
  });

  return result;
}
//talonView_screenshot,png
async function AddVisit(visit) {
  try {
    let r_id = 0;

    const lastVisitR_ID = await sequelizeServer.models.tower_visits.findOne({
      order: [["id", "DESC"]],
    });
    if (lastVisitR_ID?.r_id != null) {
      let lastRid = parseInt(lastVisitR_ID?.r_id.slice(1));
      lastRid = lastRid + 1;
      r_id = lastRid;

      const visits = sequelizeServer.models.tower_visits.create({
        visit_id: `${visit?.s_id}_V${r_id}`,
        market: visit?.market,
        lat_long: visit?.lat_long,
        employee_email: visit?.employee_email,
        scheduled_date: visit?.scheduled_date,
        cm: visit?.cm,
        pm_status: visit?.pm_status,
        driver_code: visit?.driver_code,
        billable: visit?.billable,
        gc: visit?.gc,
        btse: visit?.btse,
        cr_number: visit?.cr_number,
        scope_activity: visit?.scope_activity,
        scope_completed: visit?.scope_completed,
        issue_encountered: visit?.issue_encountered,
        pending_items: visit?.pending_items,
        materials_used: visit?.materials_used,
        time_in: visit?.time_in,
        time_out: visit?.time_out,
        on_site_time: visit?.on_site_time,
        revisit_required: visit?.revisit_required,
        active_alarms_checkout: visit?.active_alarms_checkout,
        talonView_screenshot: visit?.talonView_screenshot,
        mla_checkin: visit?.mla_checkin,
        mla_checkout: visit?.mla_checkout,
        outage_type: visit?.outage_type,
        nest_status: visit?.nest_status,
        nestIn_screenshot: visit?.nestIn_screenshot,
        nest_duration: visit?.nest_duration,
        nestOut_screenshot: visit?.nestOut_screenshot,
        jsa: visit?.jsa,
        timeIn_location: visit?.timeIn_location,
        timeOut_location: visit?.timeOut_location,
        complete_site_picture: visit?.complete_site_picture,
        mla_sign_picture: visit?.mla_sign_picture,
        compound_shelter: visit?.compound_shelter,
        pre_photos: visit?.pre_photos,
        pre_cabinet: visit?.pre_cabinet,
        pre_covp_bottom: visit?.pre_covp_bottom,
        pre_covp_top: visit?.pre_covp_top,
        pre_battery_cabinet: visit?.pre_battery_cabinet,
        pre_alpha_RRU: visit?.pre_alpha_RRU,
        pre_beta_RRU: visit?.pre_beta_RRU,
        pre_gamma_RRU: visit?.pre_gamma_RRU,
        rating: visit?.rating,
        eod_send: visit?.eod_send,
        site_id: visit?.site_id,
        r_id: `V${r_id}`,
        post_photos: visit?.post_photos,
        post_cabinet: visit?.post_cabinet,
        post_covp_bottom: visit?.post_covp_bottom,
        post_covp_top: visit?.post_covp_top,
        post_battery_cabinet: visit?.post_battery_cabinet,
        post_alpha_RRU: visit?.post_alpha_RRU,
        post_beta_RRU: visit?.post_beta_RRU,
        post_gamma_RRU: visit?.post_gamma_RRU,
        field_engineer_id: visit?.field_engineer_id,
        eod: visit?.eod,
        units_of_work: visit?.units_of_work,
        ticket_id: visit?.ticket_id,
      });

      return visits;
    } else {
      throw "R ID cannot be 0";
    }
  } catch (err) {
    console.log(err);
  }
}

async function AddVisitImages(visit_images) {
  try {
    const visits = await sequelizeServer.models.tower_visits_pictures.create({
      visit_id: parseInt(visit_images?.body.visit_id),
      image: visit_images?.file.filename,
      title: visit_images?.body?.title,
      description: visit_images?.body?.description,
    });
    return visits;
  } catch (err) {
    console.log(err);
  }
}
async function UpdateVisitImages(visit, id) {
  try {
    const visits = sequelizeServer.models.tower_visits_pictures.update(
      {
        visit_id: parseInt(visit?.body.visit_id),
        image: visit?.file.filename,
        title: visit?.body?.title,
        description: visit?.body?.description,
      },
      {
        where: { id: parseInt(visit?.body.visit_Pic_id) },
      }
    );
    return visits;
  } catch (err) {
    console.log(err);
  }
}

async function sendEmailToFEandPM(id) {
  try {
    const visit = await sequelizeServer.models.visits.findOne({
      include: [
        "visit_additional_pictures",
        "tower_visits",
        "midband_fdd_tdd_scops",
        {
          model: sequelizeServer.models.users,
          attributes: USER_ATTRIBUES,
          as: "field_engineer",
        },
        {
          model: sequelizeServer.models.tickets,
          include: [
            {
              model: sequelizeServer.models.projects,
              as: "project",
              include: ["project_managers", "users", "sites"],
            },
            "site",
          ],
          as: "ticket",
        },
      ],
      where: {
        visit_id: id,
      },
    });

    if (visit) {
      let visitSite = visit?.ticket?.site;
      let data = {
        pushContent: `Visit Assigned : ${visitSite?.id}-${
          visit?.ticket?.site?.market
        } - ${visit?.scheduled_date} - ${
          visit?.field_engineer?.first_name ?? "N/A"
        } ${visit?.field_engineer?.last_name}`,
        pushTitle: "Visit Assigned",
        baseURL: baseUrl,
        project: visit?.ticket?.project?.project_name ?? "N/A",
        ticket: `TCKT_${visit?.ticket?.ticket_id}`,
        last_modified: visit?.last_modified_visit,
        pm_status: visit?.pm_status,
        directions_description: visit?.ticket?.site?.directions_desc,
        gate_combo: visit?.ticket?.site?.gate_combo,
        site_access_notes: visit?.ticket?.site?.site_access_notes,
        equipment_combo: visit?.ticket?.site?.equipment_combo,
        aav_access: visit?.ticket?.site?.aav_access,
        power_gen_plug: visit?.ticket?.site?.power_gen_plug,
        remote_route_desc: "",
        faa_notam: visit?.ticket?.site?.faa_notam,
        access_24_7_flg: visit?.ticket?.site?.access_24_7_flg,
        telco_access: visit?.ticket?.site?.telco_access,
        telco_demark_location: visit?.ticket?.site?.telco_demark_location,
        telco_route_desc: visit?.ticket?.site?.telco_route_desc,
        power_access: visit?.ticket?.site?.power_access,
        last_update_site_access: visit?.ticket?.site?.last_update_site_access,
        site_id: visit?.site_id ?? "N/A",
        link: `${process.env.CLIENT_APP_BASE_URL}/VisitView/${visit?.visit_id}`,
        link2: `https://www.google.com/maps/search/?api=1&query=${visit?.ticket?.site?.latitude}%2C${visit?.ticket?.site?.longitude}`,
        visit_code: visit?.visit_code ?? "N/A",
        visit_type: visit?.visit_type ?? "N/A",
        site_id: visitSite?.id ?? "N/A",
        market: visitSite?.market ?? "N/A",
        cm: visit?.cm ?? "N/A",
        scope_activity: visit?.scope_activity ?? "N/A",
        field_engineer: `${visit?.field_engineer?.first_name ?? "N/A"} ${
          visit?.field_engineer?.last_name
        }`,
        first_name: visit?.field_engineer?.first_name,
        field_engineer_email: visit?.field_engineer?.work_email ?? "N/A",
        scheduled_date: visit?.scheduled_date ?? "N/A",
        project_managers: visit?.ticket?.project?.project_managers
          ?.map((d) => {
            return `${d?.first_name} ${d?.last_name}`;
          })
          .toString(),

        subject: `Visit Assigned : ${visitSite?.id}-${
          visit?.ticket?.site?.market
        } - ${visit?.scheduled_date} - ${
          visit?.field_engineer?.first_name ?? "N/A"
        } ${visit?.field_engineer?.last_name}`,
      };

      novu.trigger("visitassigned", {
        to: {
          subscriberId: `${visit?.field_engineer?.user_id}`,
          email: `${visit?.field_engineer?.work_email}`,
        },
        payload: data,
      });

      await sequelizeServer.models.notifications.create({
        user_id: visit?.field_engineer?.user_id,
        title: data?.pushTitle,
        content: data?.pushContent,
        created_on: new Date(),
        read: false,
        visit_id: visit?.visit_id,
      });

      // let html = await readFile(
      //   "public/UseEmailTemplates/visitAssigned.html",
      //   "utf8"
      // );
      // let template = handlebars.compile(html);
      // let htmlToSend = template(data);
      let PMs = visit?.ticket?.project?.project_managers?.map(async (d) => {
        novu.trigger("visitassigned", {
          to: {
            subscriberId: `${d?.user_id}`,
            email: `${d?.work_email}`,
          },
          payload: data,
        });

        await sequelizeServer.models.notifications.create({
          user_id: `${d?.user_id}`,
          title: data?.pushTitle,
          content: data?.pushContent,
          created_on: new Date(),
          read: false,
          visit_id: visit?.visit_id,
        });
        return d?.work_email;
      });

      //send email
      // var mailOptions = {
      //   from: "TechApp Support support@techapp.co",
      //   to: [visit?.field_engineer?.work_email].concat(PMs),
      //   //to: "hamzabilalbaig@gmail.com",
      //   subject: `Visit Assigned : ${data?.site_id}-${data?.market} - ${data?.scheduled_date} - ${data?.field_engineer}`,
      //   html: htmlToSend,
      // };
      // const result = await transporter.sendMail(mailOptions);

      // console.log(result);
      return "done";
    }
  } catch (error) {
    console.log(error);
  }
}
async function UpdateVisit(visit, id, user) {
  try {
    const result = sequelizeServer.transaction(async (t) => {
      const visitBeforeUpdate = await sequelizeServer.models.visits.findOne({
        where: { visit_id: id },
      });
      let scopeProgress = 0;

      scopeProgress = await countScope(visit);

      var withScopeProgress = Object.assign({}, visit, {
        scope_progress: scopeProgress,
      });
      const resultVisit = await sequelizeServer.models.visits.update(
        withScopeProgress,
        { where: { visit_id: id } },
        { transaction: t }
      );

      if (visit?.pm_status !== visitBeforeUpdate?.pm_status) {
        await sequelizeServer.models.visit_activity.create({
          visit_id: id,
          user_id: user.user_id,
          time: visit?.last_modified_visit ?? new Date(),
          activity: `PM Status changed to ${visit?.pm_status}`,
        });
      }

      if (visit?.complete_scop) {
        await sequelizeServer.models.visit_activity.create({
          visit_id: id,
          user_id: user.user_id,
          time: visit?.last_modified_visit ?? new Date(),
          activity: "cs",
        });
      }

      //Additional Picture add and delete
      if (visit?.visit_additional_pictures?.length > 0) {
        const existingAddionalPics =
          await sequelizeServer.models.visit_additional_pictures.findAll({
            where: { visit_id: id },
          });
        const picsWithIds = visit?.visit_additional_pictures?.filter(
          (pics) => pics?.id != undefined
        );
        const picsToRemove = _loadash.differenceWith(
          existingAddionalPics,
          picsWithIds,
          (obj1, obj2) => obj1.id === obj2.id
        );
        const ids = picsToRemove.map((d) => {
          return d?.id;
        });
        await sequelizeServer.models.visit_additional_pictures.destroy({
          where: { id: ids },
        });
        const newPics = visit?.visit_additional_pictures?.filter(
          (pics) => pics?.id == undefined
        );
        if (newPics?.length > 0) {
          const savedAdditional =
            await sequelizeServer.models.visit_additional_pictures.bulkCreate(
              newPics
            );
          console.log(savedAdditional);
        }
      }
      if (visit?.tower_visits) {
        var clone = Object.assign({}, visit?.tower_visits, { visit_id: id });
        if (clone?.id) {
          delete clone?.id;

          await sequelizeServer.models.tower_visits.update(
            clone,
            {
              where: { id: visit?.tower_visits?.id },
            },
            { transaction: t }
          );
        } else {
          await sequelizeServer.models.tower_visits.create(
            clone,

            { transaction: t }
          );
        }
      }
      if (visit?.midband_fdd_tdd_scops) {
        var clone = Object.assign({}, visit?.midband_fdd_tdd_scops, {
          visit_id: id,
        });
        if (clone?.id) {
          delete clone?.id;

          await sequelizeServer.models.midband_fdd_tdd_scop.update(
            clone,
            {
              where: { id: visit?.midband_fdd_tdd_scops?.id },
            },
            { transaction: t }
          );
        } else {
          await sequelizeServer.models.midband_fdd_tdd_scop.create(clone, {
            transaction: t,
          });
        }
      }
      if (visit?.visit_integration) {
        var clone = Object.assign({}, visit?.visit_integration, {
          visit_id: id,
        });
        if (clone?.id) {
          delete clone?.id;

          await sequelizeServer.models.visit_integration.update(
            clone,
            {
              where: { id: visit?.visit_integration?.id },
            },
            { transaction: t }
          );
        } else {
          await sequelizeServer.models.visit_integration.create(clone, {
            transaction: t,
          });
        }
      }

      if (resultVisit == 1) {
        if (visitBeforeUpdate?.field_engineer_id !== visit?.field_engineer_id) {
          sendEmailToFEandPM(id);
        } else if (
          !visitBeforeUpdate?.field_engineer_id &&
          visit?.field_engineer_id
        ) {
          sendEmailToFEandPM(id);
        }
      }
      addToQB(id);

      return { resultVisit };
    });
    return result;
  } catch (err) {
    console.log(err);
  }
}
async function countScope(data) {
  let result;
  const form_name = "visits";
  const role_id = 15;
  const form = await sequelizeServer.models.forms.findOne({
    where: {
      form_name: sequelize.where(
        sequelize.fn("LOWER", sequelize.col("form_name")),
        "LIKE",
        "%" + form_name.toLowerCase() + "%"
      ),
    },
  });
  if (form) {
    result = await sequelizeServer.models.form_fields.findAll({
      where: { form_id: form?.form_id },
      include: [
        {
          model: sequelizeServer.models.form_field_role_permission,
          as: "form_field_role_permission",
          where: { role_id },
        },
      ],
    });
  }

  let resultInegration;
  const form_name_Inegration = "visit_integration";

  const formInegration = await sequelizeServer.models.forms.findOne({
    where: {
      form_name: sequelize.where(
        sequelize.fn("LOWER", sequelize.col("form_name")),
        "LIKE",
        "%" + form_name_Inegration.toLowerCase() + "%"
      ),
    },
  });
  if (formInegration) {
    resultInegration = await sequelizeServer.models.form_fields.findAll({
      where: { form_id: form?.form_id },
      include: [
        {
          model: sequelizeServer.models.form_field_role_permission,
          as: "form_field_role_permission",
          where: { role_id },
        },
      ],
    });
  }
  console.log(result, data?.visit_integration);
  const visitIntegration = [
    "ret_naming_screenshot_pre",
    "router_picture_showing_port_up_post",
    "router_picture_showing_port_up_pre",
    "router_post",
    "router_pre",
    "technologies",
    "threeg_nodes_post",
    "threeg_nodes_pre",
    "fiveg_site_view_screenshot_post",
    "fiveg_site_view_screenshot_pre",
    "fsee_alarm_block_post",
    "fsee_alarm_block_pre",
    "lte_nodes_post",
    "lte_nodes_pre",
    "lte_sran_alarm_view_screenshot_post",
    "lte_sran_alarm_view_screenshot_pre",
    "lte_sran_sfp_reading_screenshot_post",
    "lte_sran_sfp_reading_screenshot_pre",
    "lte_sran_site_view_screenshot_post",
    "lte_sran_site_view_screenshot_pre",
    "mit_bt_support_team_email_screens_post",
    "mit_bt_support_team_email_screens_pre",
    "mit_rtwp_result_file_upload_post",
    "mit_rtwp_result_file_upload_pre",
    "mit_vswr_result_file_upload_post",
    "mit_vswr_result_file_upload_pre",
    "ret_naming_screenshot_post",

    "aafia_alarm_view_screenshot_post",
    "aafia_alarm_view_screenshot_pre",
    "aafia_reading_screenshot_post",
    "aafia_reading_screenshot_pre",
    "aafia_site_view_screenshot_post",
    "aafia_site_view_screenshot_pre",
    "alpha_cordex_delta_orion_picture_post",
    "alpha_cordex_delta_orion_picture_pre",
    "bts_screenshot_of_alarms_active_post",
    "bts_screenshot_of_alarms_active_pre",
    "cabinet_full_front_pic_door_open_post",
    "cabinet_full_front_pic_door_open_pre",
    "configuration_status",
    "fiveg_alarm_view_screenshot_post",
    "fiveg_alarm_view_screenshot_pre",
    "fiveg_nodes_post",
    "fiveg_nodes_pre",
    "fiveg_sfp_reading_screenshot_post",
    "fiveg_sfp_reading_screenshot_pre",
  ];
  const midbandImagesScope = [
    "abil_asset_tags",
    "abil_installations",
    "abio_asset_tags",
    "abio_installations",
    "asik_asset_tags",
    "asik_installations",
    "asil_asset_tags",
    "asil_installations",
    "catslite_scan",
    "material_pickup",
    "rma_decomm_form",
    "router_mounted",
    "show_ssc_cabinat_inside_post_swap",
    "show_ssc_cabinat_inside_pre_swap",
    "show_ssc_interior",
  ];

  const scope = [
    "accept_site",
    "active_alarms_at_check_out",
    "call_testing",
    "complete_integration_report",
    "complete_scop",
    "complete_site_picture",
    "compound_shelter",
    "fiveG_bbu_live",
    "issues_encountered",
    "load_new_scf",
    "material_used",

    "mla_checkin",
    "mla_checkout",
    "mla_sign_picture",
    "nest_duration",
    "nest_status",
    "nestIn_screenshot",
    "nestOut_screenshot",
    "outage_type",
    "pending_items",
    "perform_remote_ci",
    "post_battery_cabinet",
    "post_cabinet",
    "post_covp_bottom",
    "post_covp_top",
    "live_e_nine_eleven_test",
    "site_overall_photos_east",
    "site_overall_photos_north",
    "site_overall_photos_south",
    "site_overall_photos_west",
    "support_remove_integration",

    "pre_battery_cabinet",
    "pre_cabinet",
    "pre_covp_bottom",
    "pre_covp_top",
    "pre_photo_ciena_equipment",
    "pre_photo_csr",
    "pre_photo_csr_cable_routing",

    "revisit_required",
    "scope_completed",
  ];

  const TowerScope = [
    "active_alarms_at_check_out",

    "complete_site_picture",
    "compound_shelter",

    "issues_encountered",

    "material_used",

    "mla_checkin",
    "mla_checkout",
    "mla_sign_picture",
    "nest_duration",
    "nest_status",
    "nestIn_screenshot",
    "nestOut_screenshot",
    "outage_type",
    "pending_items",

    "post_battery_cabinet",
    "post_cabinet",
    "post_covp_bottom",
    "post_covp_top",

    "site_overall_photos_east",
    "site_overall_photos_north",
    "site_overall_photos_south",
    "site_overall_photos_west",
    "support_remove_integration",

    "pre_battery_cabinet",
    "pre_cabinet",
    "pre_covp_bottom",
    "pre_covp_top",
    "pre_photo_ciena_equipment",
    "pre_photo_csr",
    "pre_photo_csr_cable_routing",

    "revisit_required",

    "scope_completed",
  ];

  const towerImagesScope = [
    "jsa",
    "post_alpha_RRU",
    "post_beta_RRU",
    "post_gamma_RRU",
    "pre_alpha_RRU",
    "pre_beta_RRU",
    "pre_gamma_RRU",
  ];

  const MidbandScope = [
    "accept_site",
    "active_alarms_at_check_out",
    "call_testing",
    "complete_integration_report",
    "complete_scop",
    "complete_site_picture",
    "compound_shelter",
    "fiveG_bbu_live",
    "issues_encountered",

    "load_new_scf",
    "material_used",

    "mla_checkin",
    "mla_checkout",
    "mla_sign_picture",
    "nest_duration",
    "nest_status",
    "nestIn_screenshot",
    "nestOut_screenshot",
    "outage_type",
    "pending_items",
    "perform_remote_ci",
    "post_battery_cabinet",
    "post_cabinet",
    "post_covp_bottom",
    "post_covp_top",
    "live_e_nine_eleven_test",
    "site_overall_photos_east",
    "site_overall_photos_north",
    "site_overall_photos_south",
    "site_overall_photos_west",
    "support_remove_integration",

    "pre_battery_cabinet",
    "pre_cabinet",
    "pre_covp_bottom",
    "pre_covp_top",
    "pre_photo_ciena_equipment",
    "pre_photo_csr",
    "pre_photo_csr_cable_routing",

    "revisit_required",
    "scope_completed",
  ];
  const baisc = [
    "active_alarms_at_check_out",

    "complete_site_picture",
    "compound_shelter",

    "issues_encountered",

    "material_used",

    "mla_checkin",
    "mla_checkout",
    "mla_sign_picture",
    "nest_duration",
    "nest_status",
    "nestIn_screenshot",
    "nestOut_screenshot",
    "outage_type",
    "pending_items",

    "post_battery_cabinet",
    "post_cabinet",
    "post_covp_bottom",
    "post_covp_top",

    "site_overall_photos_east",
    "site_overall_photos_north",
    "site_overall_photos_south",
    "site_overall_photos_west",
    "support_remove_integration",

    "pre_battery_cabinet",
    "pre_cabinet",
    "pre_covp_bottom",
    "pre_covp_top",
    "pre_photo_ciena_equipment",
    "pre_photo_csr",
    "pre_photo_csr_cable_routing",

    "revisit_required",

    "scope_completed",
  ];

  if (data?.visit_type === "All") {
    let length =
      scope.length + visitIntegration.length + midbandImagesScope.length;
    let count = 0;
    const config = result?.reduce((acc, cur) => {
      acc[cur?.field_name] = cur;
      return acc;
    }, {});
    const config2 = resultInegration?.reduce((acc, cur) => {
      acc[cur?.field_name] = cur;
      return acc;
    }, {});
    towerImagesScope.forEach((d, i) => {
      if (config?.[d]?.form_field_role_permission?.is_visible) {
        if (data?.tower_visits?.[d]) {
          count++;
        }
      } else {
        length--;
      }
    });
    midbandImagesScope.forEach((d, i) => {
      if (config?.[d]?.form_field_role_permission?.is_visible) {
        if (data?.midband_fdd_tdd_scops?.[d]) {
          count++;
        }
      } else {
        length--;
      }
    });
    scope.forEach((d, i) => {
      if (config?.[d]?.form_field_role_permission?.is_visible) {
        if (data?.[d]) {
          count++;
        }
      } else {
        length--;
      }
    });
    visitIntegration.forEach((d, i) => {
      if (config2?.[d]?.form_field_role_permission?.is_visible) {
        if (data?.visit_integration[d]) {
          count++;
        }
      } else {
        length--;
      }
    });

    let Fresult = Math.floor((count / length) * 100);
    return Fresult;
  } else if (data?.visit_type === "Tower Visit") {
    let length = TowerScope.length + towerImagesScope.length;
    let count = 0;
    const config = result?.reduce((acc, cur) => {
      acc[cur?.field_name] = cur;
      return acc;
    }, {});
    towerImagesScope.forEach((d, i) => {
      if (config?.[d]?.form_field_role_permission?.is_visible) {
        if (data?.tower_visits?.[d]) {
          count++;
        }
      } else {
        length--;
      }
    });
    TowerScope.forEach((d, i) => {
      if (config?.[d]?.form_field_role_permission?.is_visible) {
        if (data?.[d]) {
          count++;
        }
      } else {
        length--;
      }
    });

    let Fresult = Math.floor((count / length) * 100);
    return Fresult;
  } else if (data?.visit_type === "Midband FDD & TDD SCOP") {
    let length = MidbandScope.length + midbandImagesScope.length;
    let count = 0;
    const config = result?.reduce((acc, cur) => {
      acc[cur?.field_name] = cur;
      return acc;
    }, {});
    midbandImagesScope.forEach((d, i) => {
      if (config?.[d]?.form_field_role_permission?.is_visible) {
        if (data?.midband_fdd_tdd_scops?.[d]) {
          count++;
        }
      } else {
        length--;
      }
    });
    MidbandScope.forEach((d, i) => {
      if (config?.[d]?.form_field_role_permission?.is_visible) {
        if (data?.[d]) {
          count++;
        }
      } else {
        length--;
      }
    });

    let Fresult = Math.floor((count / length) * 100);
    return Fresult;
  } else if (data?.visit_type === "visit_integration") {
    let length = baisc.length + visitIntegration.length;
    let count = 0;
    const config = result?.reduce((acc, cur) => {
      acc[cur?.field_name] = cur;
      return acc;
    }, {});
    const config2 = resultInegration?.reduce((acc, cur) => {
      acc[cur?.field_name] = cur;
      return acc;
    }, {});
    baisc.forEach((d, i) => {
      if (config?.[d]?.form_field_role_permission?.is_visible) {
        if (data?.[d]) {
          count++;
        }
      } else {
        length--;
      }
    });
    visitIntegration.forEach((d, i) => {
      if (config2?.[d]?.form_field_role_permission?.is_visible) {
        if (data?.visit_integration[d]) {
          count++;
        }
      } else {
        length--;
      }
    });

    let Fresult = Math.floor((count / length) * 100);
    return Fresult;
  }
}
async function DeleteVisit(id) {
  try {
    const visits = sequelizeServer.models.tower_visits.destroy({
      where: { id: id },
    });
    return visits;
  } catch (err) {
    console.log(err);
  }
}

// async function recordVisit(visit){
//   const
// }
async function addNewVisit(visitModel) {
  try {
    const visit = sequelizeServer.models.visits.create(visitModel);
    return visit;
  } catch (error) {
    console.log(error);
  }
}

// async function updateVisit(visit, id) {
//   try {
//     const visits = sequelizeServer.models.visits.update(visit, {
//       where: { id: id },
//     });
//     return visits;
//   } catch (err) {
//     console.log(err);
//   }
// }

async function removeVisit(id) {
  try {
    const result = await sequelizeServer.models.visits.update(
      { is_valid: false },
      {
        where: { visit_id: id },
      }
    );
    return result;
  } catch (err) {
    console.log(err);
  }
}

async function undoDeleteVisit(id) {
  try {
    const result = await sequelizeServer.models.visits.update(
      { is_valid: true },
      {
        where: { visit_id: id },
      }
    );
    return result;
  } catch (err) {
    console.log(err);
  }
}

async function uploadVisitFile(req, visit_id) {
  try {
    if (req?.body?.type === "Additional_Photos") {
      const result =
        await sequelizeServer.models.visit_additional_pictures.create({
          visit_id: visit_id,
          name: req?.body?.name + path.extname(req?.file?.originalname),
          description: req?.body?.description,
        });

      console.log(result);
      if (result == 1) {
        return req?.body?.name + path.extname(req?.file?.originalname);
      } else {
        return result;
      }
    }
    return [];
  } catch (error) {}
}

async function getAdditionalPictures(visit_id) {
  const result = await sequelizeServer.models.visit_additional_pictures.findAll(
    { where: { visit_id } }
  );

  return result;
}

async function removeVisitFile(folder, file) {
  try {
    const fullFileName = fromDir(
      require("path").resolve(`${__dirname}../../../public/visits/${folder}`),
      file
    );
    if (fullFileName === undefined) {
      return undefined;
    } else {
      const file = require("path").resolve(
        `${__dirname}../../../public/visits/${folder}/${fullFileName}`
      );

      fs.unlink(file, function (err) {
        if (err) throw err;
        // if no error, file has been deleted successfully
        console.log("File deleted!");
        return "deleted";
      });
    }
  } catch (error) {
    console.log(error);
  }
}

async function removeVisitAdditionalFile(folder, file, id) {
  try {
    const fullFileName = fromDir(
      require("path").resolve(`${__dirname}../../../public/visits/${folder}`),
      file
    );
    if (fullFileName === undefined) {
      return undefined;
    } else {
      const file = require("path").resolve(
        `${__dirname}../../../public/visits/${folder}/${fullFileName}`
      );

      fs.unlink(file, async function (err) {
        if (err) throw err;
        // if no error, file has been deleted successfully
        console.log("File deleted!");
        await sequelizeServer.models.visit_additional_pictures.destroy({
          where: { id },
        });
        return "deleted";
      });
    }
  } catch (error) {
    console.log(error);
  }
}

const readFile = promisify(fs.readFile);
var handlebars = require("handlebars");
const { emails } = require("../constants/email-adresses");
const { templates } = require("../constants/sendGrid.template.constants");
const { insertVisitIntoQuickbaseTable } = require("./quickbase.services");
const { count, Console } = require("console");
const { default: axios } = require("axios");
const sequelize = require("sequelize");

async function sendSummeryReport(visit_id, eodData, user) {
  try {
    await sequelizeServer.models.visit_activity.create({
      visit_id: visit_id,
      user_id: user.user_id,
      time: eodData?.eod_send,
      activity: `s`,
    });
    const visit = await sequelizeServer.models.visits.findOne({
      include: [
        "visit_additional_pictures",
        "tower_visits",
        "midband_fdd_tdd_scops",
        "visit_integration",
        {
          model: sequelizeServer.models.users,
          attributes: USER_ATTRIBUES,
          as: "field_engineer",
        },
        {
          model: sequelizeServer.models.tickets,
          include: [
            {
              model: sequelizeServer.models.projects,
              as: "project",
              include: ["project_managers", "users", "sites"],
            },
            "site",
          ],
          as: "ticket",
        },
      ],
      where: {
        visit_id: visit_id,
      },
    });
    await sequelizeServer.models.visits.update(
      { eod_send: eodData?.eod_send },
      { where: { visit_id: visit_id } }
    );
    // let html = await readFile(
    //   "public/UseEmailTemplates/visitSummary.html",
    //   "utf8"
    // );
    const interruption_count = await sequelizeServer.models.Interruptions.count(
      {
        where: { visit_id, is_valid: true },
      }
    );
    // let template = handlebars.compile(html);
    let visitSite = visit?.ticket?.site;
    let data = {
      pushContent: `${visit?.visit_code}-${visitSite?.id ?? "N/A"} - ${
        visit?.scheduled_date ?? "N/A"
      } - ${visit?.visit_type ?? "N/A"}`,
      pushTitle: "Visit Summary",
      subject: `${visit?.visit_code}-${visitSite?.id ?? "N/A"} - ${
        visit?.scheduled_date ?? "N/A"
      } - ${visit?.visit_type ?? "N/A"}`,
      on_site_time: mstotime(visit?.on_site_time),
      total_visit_time: mstotime(visit?.total_visit_time),
      total_travel_time: mstotime(visit?.total_travel_time),
      Interruption_count: interruption_count,
      last_modified: visit?.last_modified_visit ?? visit?.last_modified ?? "",
      scope_progress: visit?.scope_progress ?? "N/A",
      efficiency_gained: "0%",
      baseURL: baseUrl,
      assetUrl: `${baseUrl}/visits/visit_${visit?.visit_id}/`,
      midband_visit:
        visit?.visit_type == "Midband FDD & TDD SCOP" ? true : false,
      tower_visit: visit?.visit_type == "Tower Visit" ? true : false,
      visit_integration:
        visit?.visit_type == "visit_integration" ? true : false,
      all_type: visit?.visit_type == "All" ? true : false,
      visit_type: visit?.visit_type ?? "N/A",
      site_id: visitSite?.id ?? "N/A",
      market: visitSite?.market ?? "N/A",
      cm: visit?.cm ?? "N/A",
      scope_activity: visit?.scope_activity ?? "N/A",
      scope_completed: visit?.scope_completed ?? "N/A",
      issue_encountered: visit?.issue_encountered ?? "N/A",
      materials_used: visit?.materials_used ?? "N/A",
      pending_items: visit?.pending_items ?? "N/A",
      cr_number: visit?.cr_number ?? "N/A",
      pm_status: visit?.pm_status ?? "N/A",
      rating: visit?.rating ?? "N/A",
      units_of_work: visit?.units_of_work ?? "N/A",
      mla_checkin: visit?.mla_checkin ?? "N/A",
      mla_checkout: visit?.mla_checkout ?? "N/A",
      nest_status: visit?.nest_status ?? "N/A",
      nestIn_screenshot: visit?.nestIn_screenshot?.split(","),
      nestOut_screenshot: visit?.nestOut_screenshot?.split(","),
      complete_site_picture: visit?.complete_site_picture?.split(","),
      mla_sign_picture: visit?.mla_sign_picture?.split(","),
      compound_shelter: visit?.compound_shelter?.split(","),
      jsa: visit?.tower_visits?.jsa?.split(","),
      pre_cabinet: visit?.pre_cabinet?.split(","),
      pre_covp_bottom: visit?.pre_covp_bottom?.split(","),
      pre_covp_top: visit?.pre_covp_top?.split(","),
      pre_battery_cabinet: visit?.pre_battery_cabinet?.split(","),
      pre_alpha_RRU: visit?.tower_visits?.pre_alpha_RRU?.split(","),
      pre_beta_RRU: visit?.tower_visits?.pre_beta_RRU?.split(","),
      pre_gamma_RRU: visit?.tower_visits?.pre_gamma_RRU?.split(","),
      post_cabinet: visit?.post_cabinet?.split(","),
      post_covp_bottom: visit?.post_covp_bottom?.split(","),
      post_covp_top: visit?.post_covp_top?.split(","),
      post_battery_cabinet: visit?.post_battery_cabinet?.split(","),
      post_alpha_RRU: visit?.tower_visits?.post_alpha_RRU?.split(","),
      post_beta_RRU: visit?.tower_visits?.post_beta_RRU?.split(","),
      post_gamma_RRU: visit?.tower_visits?.post_gamma_RRU?.split(","),
      site_overall_photos_east: visit?.site_overall_photos_east?.split(","),
      site_overall_photos_north: visit?.site_overall_photos_north?.split(","),
      site_overall_photos_south: visit?.site_overall_photos_south?.split(","),
      site_overall_photos_west: visit?.site_overall_photos_west?.split(","),
      pre_photo_ciena_equipment: visit?.pre_photo_ciena_equipment?.split(","),
      pre_photo_csr_cable_routing:
        visit?.pre_photo_csr_cable_routing?.split(","),
      pre_photo_csr: visit?.pre_photo_csr?.split(","),

      visit_additional_pictures_length:
        visit?.visit_additional_pictures?.length > 0 ? true : false,
      visit_additional_pictures: visit?.visit_additional_pictures?.map((d) => {
        return { key: d?.name, value: d?.name, description: d?.description };
      }),
      nest_duration: visit?.nest_duration ?? "N/A",
      outage_type: visit?.outage_type ?? "N/A",
      time_in_location: visit?.time_in_location,
      time_out_location: visit?.time_out_location,
      gc: visit?.gc ?? "N/A",
      time_in: visit?.time_in,
      time_out: visit?.time_out,

      travel_time_in: visit?.travel_time_in,
      travel_time_out: visit?.travel_time_out,
      travel_time: miliToTime(visit?.travel_time),
      return_travel_time_in: visit?.return_travel_time_in,
      return_travel_time_out: visit?.return_travel_time_out,
      total_return_travel_time: mstotime(visit?.total_return_travel_time),

      revisit_required: visit?.revisit_required ?? "N/A",
      project: visit?.ticket?.project?.project_name,
      ticket: visit?.ticket?.ticket_id,
      field_engineer: `${visit?.field_engineer?.first_name ?? "N/A"} ${
        visit?.field_engineer?.last_name
      }`,
      field_engineer_email: visit?.field_engineer?.work_email ?? "N/A",
      scheduled_date: visit?.scheduled_date ?? "N/A",
      revisit_required: visit?.revisit_required ? "Yes" : "No",
      active_alarms_at_checkout: visit?.active_alarms_at_checkout
        ? "Yes"
        : "No",
      midband_fields: [
        { key: "load new scf", value: visit?.load_new_scf },
        { key: "fiveG bbu live", value: visit?.fiveG_bbu_live },
        { key: "commission", value: visit?.commission },
        { key: "perform remote ci", value: visit?.perform_remote_ci },
        {
          key: "support remove integration",
          value: visit?.support_remove_integration,
        },
        { key: "call testing", value: visit?.call_testing },
        { key: "Call testing, e911", value: visit?.live_e_nine_eleven_test },
        {
          key: "complete integration report",
          value: visit?.complete_integration_report,
        },
        { key: "complete scop", value: visit?.complete_scop },
        { key: "accept site", value: visit?.accept_site },
      ],

      material_pickup:
        visit?.midband_fdd_tdd_scops?.material_pickup?.split(","),
      rma_decomm_form:
        visit?.midband_fdd_tdd_scops?.rma_decomm_form?.split(","),
      show_ssc_cabinat_inside_pre_swap:
        visit?.midband_fdd_tdd_scops?.show_ssc_cabinat_inside_pre_swap?.split(
          ","
        ),
      show_ssc_cabinat_inside_post_swap:
        visit?.midband_fdd_tdd_scops?.show_ssc_cabinat_inside_post_swap?.split(
          ","
        ),
      show_ssc_interior:
        visit?.midband_fdd_tdd_scops?.show_ssc_interior?.split(","),
      router_mounted: visit?.midband_fdd_tdd_scops?.router_mounted?.split(","),
      catslite_scan: visit?.midband_fdd_tdd_scops?.catslite_scan?.split(","),
      abil_installations:
        visit?.midband_fdd_tdd_scops?.abil_installations?.split(","),
      abil_asset_tags:
        visit?.midband_fdd_tdd_scops?.abil_asset_tags?.split(","),
      asik_installations:
        visit?.midband_fdd_tdd_scops?.asik_installations?.split(","),
      asik_asset_tags:
        visit?.midband_fdd_tdd_scops?.asik_asset_tags?.split(","),
      abio_installations:
        visit?.midband_fdd_tdd_scops?.abio_installations?.split(","),
      abio_asset_tags:
        visit?.midband_fdd_tdd_scops?.abio_asset_tags?.split(","),
      asil_installations:
        visit?.midband_fdd_tdd_scops?.asil_installations?.split(","),
      asil_asset_tags:
        visit?.midband_fdd_tdd_scops?.asil_asset_tags?.split(","),
      configuration_status: visit?.visit_integration?.configuration_status,
      created_by: visit?.visit_integration?.created_by,
      modified_by: visit?.visit_integration?.modified_by,
      created_date: visit?.visit_integration?.created_date,
      modified_date: visit?.visit_integration?.modified_date,
      is_valid: visit?.visit_integration?.is_valid,
      threeg_nodes_pre: visit?.visit_integration?.threeg_nodes_pre?.split(","),
      threeg_nodes_post:
        visit?.visit_integration?.threeg_nodes_post?.split(","),
      router_pre: visit?.visit_integration?.router_pre?.split(","),
      router_post: visit?.visit_integration?.router_post?.split(","),
      mit_bt_support_team_email_screens_pre:
        visit?.visit_integration?.mit_bt_support_team_email_screens_pre?.split(
          ","
        ),
      mit_bt_support_team_email_screens_post:
        visit?.visit_integration?.mit_bt_support_team_email_screens_post?.split(
          ","
        ),
      router_picture_showing_port_up_pre:
        visit?.visit_integration?.router_picture_showing_port_up_pre?.split(
          ","
        ),
      router_picture_showing_port_up_post:
        visit?.visit_integration?.router_picture_showing_port_up_post?.split(
          ","
        ),
      fsee_alarm_block_pre:
        visit?.visit_integration?.fsee_alarm_block_pre?.split(","),
      fsee_alarm_block_post:
        visit?.visit_integration?.fsee_alarm_block_post?.split(","),
      alpha_cordex_delta_orion_picture_pre:
        visit?.visit_integration?.alpha_cordex_delta_orion_picture_pre?.split(
          ","
        ),
      alpha_cordex_delta_orion_picture_post:
        visit?.visit_integration?.alpha_cordex_delta_orion_picture_post?.split(
          ","
        ),
      bts_screenshot_of_alarms_active_pre:
        visit?.visit_integration?.bts_screenshot_of_alarms_active_pre?.split(
          ","
        ),
      bts_screenshot_of_alarms_active_post:
        visit?.visit_integration?.bts_screenshot_of_alarms_active_post?.split(
          ","
        ),
      ret_naming_screenshot_pre:
        visit?.visit_integration?.ret_naming_screenshot_pre?.split(","),
      ret_naming_screenshot_post:
        visit?.visit_integration?.ret_naming_screenshot_post?.split(","),
      lte_sran_site_view_screenshot_pre:
        visit?.visit_integration?.lte_sran_site_view_screenshot_pre?.split(","),
      lte_sran_site_view_screenshot_post:
        visit?.visit_integration?.lte_sran_site_view_screenshot_post?.split(
          ","
        ),
      lte_sran_alarm_view_screenshot_pre:
        visit?.visit_integration?.lte_sran_alarm_view_screenshot_pre?.split(
          ","
        ),
      lte_sran_alarm_view_screenshot_post:
        visit?.visit_integration?.lte_sran_alarm_view_screenshot_post?.split(
          ","
        ),
      lte_sran_sfp_reading_screenshot_pre:
        visit?.visit_integration?.lte_sran_sfp_reading_screenshot_pre?.split(
          ","
        ),
      lte_sran_sfp_reading_screenshot_post:
        visit?.visit_integration?.lte_sran_sfp_reading_screenshot_post?.split(
          ","
        ),
      aafia_site_view_screenshot_pre:
        visit?.visit_integration?.aafia_site_view_screenshot_pre?.split(","),
      aafia_site_view_screenshot_post:
        visit?.visit_integration?.aafia_site_view_screenshot_post?.split(","),
      aafia_alarm_view_screenshot_pre:
        visit?.visit_integration?.aafia_alarm_view_screenshot_pre?.split(","),
      aafia_alarm_view_screenshot_post:
        visit?.visit_integration?.aafia_alarm_view_screenshot_post?.split(","),
      aafia_reading_screenshot_pre:
        visit?.visit_integration?.aafia_reading_screenshot_pre?.split(","),
      aafia_reading_screenshot_post:
        visit?.visit_integration?.aafia_reading_screenshot_post?.split(","),
      fiveg_site_view_screenshot_pre:
        visit?.visit_integration?.fiveg_site_view_screenshot_pre?.split(","),
      fiveg_site_view_screenshot_post:
        visit?.visit_integration?.fiveg_site_view_screenshot_post?.split(","),
      fiveg_alarm_view_screenshot_pre:
        visit?.visit_integration?.fiveg_alarm_view_screenshot_pre?.split(","),
      fiveg_alarm_view_screenshot_post:
        visit?.visit_integration?.fiveg_alarm_view_screenshot_post?.split(","),
      fiveg_sfp_reading_screenshot_pre:
        visit?.visit_integration?.fiveg_sfp_reading_screenshot_pre?.split(","),
      fiveg_sfp_reading_screenshot_post:
        visit?.visit_integration?.fiveg_sfp_reading_screenshot_post?.split(","),
      mit_vswr_result_file_upload_pre:
        visit?.visit_integration?.mit_vswr_result_file_upload_pre?.split(","),
      mit_vswr_result_file_upload_post:
        visit?.visit_integration?.mit_vswr_result_file_upload_post?.split(","),
      mit_rtwp_result_file_upload_pre:
        visit?.visit_integration?.mit_rtwp_result_file_upload_pre?.split(","),
      mit_rtwp_result_file_upload_post:
        visit?.visit_integration?.mit_rtwp_result_file_upload_post?.split(","),
      technologies: visit?.visit_integration?.technologies?.split(","),
      cabinet_full_front_pic_door_open_pre:
        visit?.visit_integration?.cabinet_full_front_pic_door_open_pre?.split(
          ","
        ),
      cabinet_full_front_pic_door_open_post:
        visit?.visit_integration?.cabinet_full_front_pic_door_open_post?.split(
          ","
        ),
      lte_nodes_pre: visit?.visit_integration?.lte_nodes_pre?.split(","),
      lte_nodes_post: visit?.visit_integration?.lte_nodes_post?.split(","),
      fiveg_nodes_pre: visit?.visit_integration?.fiveg_nodes_pre?.split(","),
      fiveg_nodes_post: visit?.visit_integration?.fiveg_nodes_post?.split(","),
    };

    let PMs = visit?.ticket?.project?.project_managers?.map(async (d) => {
      novu.trigger("visitsummary", {
        to: {
          subscriberId: `${d?.user_id}`,
          email: d?.work_email,
        },
        payload: data,
      });
      await sequelizeServer.models.notifications.create({
        user_id: `${d?.user_id}`,
        title: data?.pushTitle,
        content: data?.pushContent,
        created_on: new Date(),
        read: false,
        visit_id: visit?.visit_id,
      });
      return d?.work_email;
    });

    novu.trigger("visitsummary", {
      to: {
        subscriberId: `${visit?.field_engineer?.user_id}`,
        email: visit?.field_engineer?.work_email,
      },
      payload: data,
    });
    await sequelizeServer.models.notifications.create({
      user_id: `${visit?.field_engineer?.user_id}`,
      title: data?.pushTitle,
      content: data?.pushContent,
      created_on: new Date(),
      read: false,
      visit_id: visit?.visit_id,
    });
    //send email
    // var mailOptions = {
    //   from: "TechApp Support support@techapp.co",
    //   to: [visit?.field_engineer?.work_email].concat(PMs),
    //   //to: "hamzabilalbaig@gmail.com",
    //   subject: `${visit?.visit_code}-${data?.site_id} - ${data?.scheduled_date} - ${data?.visit_type}`,
    //   html: htmlToSend,
    // };
    // const result = await transporter.sendMail(mailOptions);
    // sendGridMail.send({
    //   from: emails.ADMIN,
    //    dynamicTemplateData: data,
    //    subject:"VISIT NOTIFICATION FROM TECHAPP",
    //    templateId:templates.SEND_SUMMERY_REPORT,
    //    to:'mr.daniyal.baig@gmail.com'
    //    }).then(d=>{
    //     console.log('done',d)
    //    }).catch(ex=>{
    //     console.log('error',ex)
    //    })
    return "email sent";
  } catch (error) {
    return error;
  }
}

// async function removeVisitFile(req, visit_id) {
//   try {
//     const result = await sequelizeServer.models.visits.update(
//       {
//         [req?.body?.type]: null,
//       },
//       {
//         where: { visit_id: visit_id },
//       }
//     );
//     if (result == 1) {
//       return null;
//     } else {
//       return result;
//     }
//   } catch (error) {}
// }
async function sendNotification(result, isApproved) {
  //visitFinancialEmailApproved
  try {
    let date = new Date(result[0]?.approval_time).toDateString();
    let notApprovedMessage = `${result?.length} Driver codes are added for ${result[0]?.visit?.visit_code} of Site ${result[0]?.visit?.ticket?.site?.id} - ${date}`;
    let approvedMessage = `Below driver codes are approved for ${result[0]?.visit?.visit_code} of Site ${result[0]?.visit?.ticket?.site?.id} - ${date}`;
    const data = {
      subject: isApproved ? approvedMessage : notApprovedMessage,
      first_name: result[0]?.fe_user_driver_code?.user?.first_name,
      message: isApproved ? approvedMessage : notApprovedMessage,
      email: result[0]?.fe_user_driver_code?.user?.work_email,
      driver_code: result,
      baseURL: baseUrl,
      baseURLClient: process.env.CLIENT_APP_BASE_URL,
    };

    console.log(data);
    // let templateName = isApproved
    //   ? "visitFinancialEmailApproved.html"
    //   : "visitFinancialEmail.html";

    if (isApproved) {
      novu.trigger("visitfinancialapproved", {
        to: {
          subscriberId: `${result[0]?.fe_user_driver_code?.user?.user_id}`,
          email: data?.email,
        },
        payload: data,
      });
      await sequelizeServer.models.notifications.create({
        user_id: `${result[0]?.fe_user_driver_code?.user?.user_id}`,
        title: "Visit Financial Approved",
        content: data?.subject,
        created_on: new Date(),
        read: false,
        visit_id: result[0]?.visit?.visit_id,
      });
    } else {
      novu.trigger("visitfinancial", {
        to: {
          subscriberId: `${result[0]?.fe_user_driver_code?.user?.user_id}`,
          email: data?.email,
        },
        payload: data,
      });
      await sequelizeServer.models.notifications.create({
        user_id: `${result[0]?.fe_user_driver_code?.user?.user_id}`,
        title: "Visit Financial",
        content: data?.subject,
        created_on: new Date(),
        read: false,
        visit_id: result[0]?.visit?.visit_id,
      });
    }
    // let html = await readFile(
    //   `public/UseEmailTemplates/${templateName}`,
    //   "utf8"
    // );
    // let template = handlebars.compile(html);

    // let htmlToSend = template(data, { allowProtoPropertiesByDefault: true });
    // // expected output: 1
    // var mailOptions = {
    //   from: "TechApp Support support@techapp.co",
    //   to: [data?.email],
    //   //to: "hamzabilalbaig@gmail.com",
    //   subject: isApproved ? approvedMessage : notApprovedMessage,
    //   html: htmlToSend,
    // };
    // const res = await transporter.sendMail(mailOptions);

    // console.log("sent", res);
  } catch (error) {
    console.log(error);
  }
}
async function AddVisitFinancials(data) {
  try {
    const re = await sequelizeServer.models.visit_financials.findAll({
      where: { visit_id: data?.visit_id },
    });

    const additional_total_amount = data?.visitFinancials?.reduce(
      (a, b) => a + parseFloat(b?.driver_codes_total_amount),
      0
    );

    await sequelizeServer.models.visits.update(
      {
        additional_total: additional_total_amount,
      },
      {
        where: { visit_id: data?.visit_id },
      }
    );
    //let check = data?.driverCodes?.driverCodes.filter(b => re.findIndex(a => a.driver_codes_id === b.driver_codes_id) === -1);
    let removedCode = _loadash.differenceBy(
      re,
      data?.visitFinancials,
      "user_driver_code_id"
    );

    let reAdded = _loadash.intersectionBy(
      data?.visitFinancials,
      re,
      "user_driver_code_id"
    );
    let changedObjects;
    if (reAdded?.length > 0) {
      changedObjects = _loadash.differenceWith(
        data?.visitFinancials,
        re,
        (obj1, obj2) => {
          return (
            obj1.user_driver_code_id === obj2.user_driver_code_id &&
            obj1.approved === obj2.approved
          );
        }
      );
    }
    let newlyAdded = _loadash.differenceBy(
      data?.visitFinancials,
      re,
      "user_driver_code_id"
    );
    const tResult = sequelizeServer
      .transaction(async (t) => {
        if (reAdded?.length > 0) {
          reAdded?.forEach(async (d) => {
            await sequelizeServer.models.visit_financials.update(
              Object.assign(d, { is_valid: true }),
              {
                where: {
                  user_driver_code_id: d?.user_driver_code_id,
                  visit_id: data?.visit_id,
                },
              }
            );
          });
        }

        if (removedCode?.length > 0) {
          removedCode?.forEach(async (d) => {
            await sequelizeServer.models.visit_financials.update(
              { is_valid: false },
              {
                where: {
                  user_driver_code_id: d?.user_driver_code_id,
                  visit_id: data?.visit_id,
                },
              }
            );
          });
        }
        if (newlyAdded?.length > 0) {
          await sequelizeServer.models.visit_financials.bulkCreate(newlyAdded);
        }
      })
      .then(async (res) => {
        var result = await sequelizeServer.models.visit_financials.findAll({
          include: [
            {
              model: sequelizeServer.models.users,
            },
            {
              model: sequelizeServer.models.visits,
              include: [
                {
                  model: sequelizeServer.models.tickets,
                  include: ["site"],
                  as: "ticket",
                },
              ],
            },
            {
              model: sequelizeServer.models.fe_user_driver_codes_mappings,
              as: "fe_user_driver_code",
              include: ["driver_code", "user"],
            },
          ],
          where: { visit_id: data?.visit_id, is_valid: true },
        });
        //let approved = result?.filter((x) => x?.approved == true);
        //let notApproved = result?.filter((x) => x?.approved == false);
        let newlyaddedfirst = _loadash.intersectionBy(
          result,
          newlyAdded,
          "user_driver_code_id"
        );
        let reAddedApproved = _loadash
          .intersectionBy(result, changedObjects, "user_driver_code_id")
          ?.filter((x) => x?.approved == true);

        if (reAddedApproved?.length > 0) {
          console.log(reAddedApproved);
          sendNotification(reAddedApproved, true);
        }

        if (newlyaddedfirst?.length > 0) {
          console.log(newlyaddedfirst);

          sendNotification(newlyaddedfirst, false);
        }
        //addToQB(data?.visit_id);
        return result;
      });

    return tResult;
  } catch (error) {
    return error;
  }
}

async function addToQB(visitId) {
  if (process.env.ENVIRONMENT_TYPE === "Production") {
    const visitbyId = await sequelizeServer.models.visits.findOne({
      where: { visit_id: visitId },
      include: [
        {
          model: sequelizeServer.models.users,
          attributes: USER_ATTRIBUES,
          as: "field_engineer",
        },
        {
          model: sequelizeServer.models.tickets,
          include: [
            {
              model: sequelizeServer.models.projects,
              as: "project",
              include: ["project_managers", "users", "sites"],
            },
            "site",
          ],
          as: "ticket",
        },
      ],
    });

    if (visitbyId) {
      const visData = Object?.assign(visitbyId, {
        user_name: visitbyId?.field_engineer?.full_name,
        rate_type: visitbyId?.field_engineer?.rate_type,
        rate: visitbyId?.field_engineer?.hourly_rate,
        project_id: visitbyId?.ticket?.project?.project_id,
        project_name: visitbyId?.ticket?.project?.project_name,
        site_code: visitbyId?.ticket?.site?.id,
        market: visitbyId?.ticket?.site?.market,
        state: visitbyId?.ticket?.site?.State,
      });
      insertVisitIntoQuickbaseTable(visData, "bs3zsqc5b", visitId);
    }
  }
}

async function GetVisitFinancials(visit_id) {
  try {
    var result = await sequelizeServer.models.visit_financials.findAll({
      include: [
        {
          model: sequelizeServer.models.users,
        },
        {
          model: sequelizeServer.models.visits,
        },
        {
          model: sequelizeServer.models.fe_user_driver_codes_mappings,
          as: "fe_user_driver_code",
          include: ["driver_code", "user"],
        },
      ],
      where: { visit_id: visit_id, is_valid: true },
    });
    addToQB(visit_id);
    return result;
  } catch (error) {
    return error;
  }
}

async function calculateTotalAmount(visit_id) {
  const visit = await sequelizeServer.models.visits.findOne({
    where: { visit_id },
    include: [
      {
        model: sequelizeServer.models.users,
        attributes: USER_ATTRIBUES,
        as: "field_engineer",
      },
    ],
  });

  if (visit) {
    const fieldEngineer = visit?.field_engineer;
    let rate = 0;
    let amount = 0;
    if (fieldEngineer?.rate_type?.toLowerCase() == "hourly") {
      rate = fieldEngineer?.hourly_rate;
      amount = calculate(
        "hourly",
        rate,
        visit?.time_in,
        visit?.time_out,
        visit?.units_of_work
      );
    }
    if (fieldEngineer?.rate_type?.toLowerCase() == "monthly") {
      rate = fieldEngineer?.monthly_rate;
      amount = calculate(
        "monthly",
        rate,
        visit?.time_in,
        visit?.time_out,
        visit?.units_of_work
      );
    }
    if (fieldEngineer?.rate_type?.toLowerCase() == "daily") {
      rate = fieldEngineer?.daily_rate;
      amount = calculate(
        "daily",
        rate,
        visit?.time_in,
        visit?.time_out,
        visit?.units_of_work
      );
    }
    if (fieldEngineer?.rate_type?.toLowerCase() == "salary") {
      rate = fieldEngineer?.salary_rate;
      amount = calculate(
        "salary",
        rate,
        visit?.time_in,
        visit?.time_out,
        visit?.units_of_work
      );
    }

    var result = await sequelizeServer.models.visits.update(
      {
        total_amount: amount,
        visit_amount: amount,
      },
      { where: { visit_id }, returning: true }
    );
    addToQB(visit_id);

    return result;
  }

  function calculate(type, rate, time_in, time_out, uof) {
    if (type === "hourly") {
      if (time_in && time_out) {
        var a = new Date(time_in);
        var b = new Date(time_out);
        var hours = Math.abs(b - a) / 36e5;
        var amount = (rate * hours).toFixed(2); // for hourly
        return amount;
      } else {
        return 0;
      }
    }
    return rate * uof;
  }

  return null;
}

async function getVisitsByTicket(ticket_id, user) {
  try {
    if (ticket_id === "undefined") {
      return null;
    }
    let whereClause = { ticket_id: ticket_id };
    //if (user && user.user_type !== "Admin") {
    whereClause.is_valid = true;

    const visits = await sequelizeServer.models.visits.findAll({
      where: whereClause,
      include: [
        {
          model: sequelizeServer.models.users,
          attributes: USER_ATTRIBUES,
          as: "field_engineer",
        },
        {
          model: sequelizeServer.models.tickets,
          include: ["site"],
          as: "ticket",
        },
      ],
    });

    return visits;
  } catch (error) {
    console.log(error);
    return null;
  }
}

async function addWeather(visit_id, lat, long) {
  try {
    // const lat = visit?.ticket?.site?.latitude;
    // const long = visit?.ticket?.site?.longitude;

    const api = `https://api.openweathermap.org/data/2.5/weather?lat=${parseFloat(
      lat
    )}&lon=${parseFloat(long)}&appid=5f58dd13f49701455593303e69417c1c`;
    axios
      .get(api)
      .then(async (res) => {
        const weather = JSON.stringify(res?.data);
        const visits = await sequelizeServer.models.visits.update(
          { weather: weather },
          {
            where: { visit_id },
          }
        );
        return visits;
      })
      .catch((err) => {
        console.log(err);
        return null;
      });
  } catch (error) {
    console.log(error);
    return null;
  }
}

async function getWeather(lat, long) {
  try {
    const api = `https://api.openweathermap.org/data/2.5/weather?lat=${parseFloat(
      lat
    )}&lon=${parseFloat(long)}&appid=5f58dd13f49701455593303e69417c1c`;
    const res = await axios.get(api);
    const weather = res?.data;

    return weather;
  } catch (error) {
    console.log(error);
    return null;
  }
}

async function checkSheduledVisits(ticket_id, scheduled_date) {
  const visits = await sequelizeServer.models.visits.findAll({
    where: {
      ticket_id: ticket_id,
      scheduled_date: Sequelize.where(
        Sequelize.fn("date", Sequelize.col("scheduled_date")),
        {
          [Op.eq]: scheduled_date,
        }
      ),
      is_valid: true,
    },
  });

  return visits;
}

module.exports = {
  AllVisits,
  AddVisit,
  UpdateVisit,
  DeleteVisit,
  addNewVisit,
  AddVisitImages,
  UpdateVisitImages,
  getVisitsByID,
  removeVisit,
  uploadVisitFile,
  removeVisitFile,
  setTimeIn,
  setTimeOut,
  getTimeData,
  setTravelTimeIn,
  setTravelTimeOut,
  setReturnTravelTimeIn,
  setReturnTravelTimeOut,
  sendSummeryReport,
  getVisitsByUserID,
  visitPagination,
  filterVisits,
  setTotalAmount,
  AddVisitFinancials,
  GetVisitFinancials,
  getVisitsByAdmin,
  calculateTotalAmount,
  getVisitsByTicket,
  checkSheduledVisits,
  undoDeleteVisit,
  getAdditionalPictures,
  removeVisitAdditionalFile,
  resetTimes,
  addWeather,
  getWeather,
  getAdvanceFilters,
  getFilterVisitsForFE,
  getFilterVisitsForAdmin,
  getFilterVisitsForPM,
};
