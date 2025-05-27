const { sequelizeServer } = require("../configs/sequelize.config");
const Sequelize = require("sequelize");
const Op = Sequelize.Op;
const { USER_ATTRIBUES } = require("../utils/attributes");
const { getValueFromMoneyField } = require("../utils/utils");
const visitService = require("./visits.services");
const ticketService = require("./tickets.services");
const projectService = require("./projects.services");
const siteService = require("./sites.services");
const { filterUsers } = require("./users.services");

const getVisitAdvanceFilters = visitService.getAdvanceFilters;
const getTicketAdvanceFilters = ticketService.getAdvanceFilters;
const getProjectAdvanceFilters = projectService.getAdvanceFilters;
const getSiteAdvanceFilters = siteService.getAdvanceFilters;

const requiredAttributes = [
  "revisit_required",
  "visit_id",
  "scheduled_date",
  "total_visit_time",
];

async function getVisitsForFE(user, body) {
  try {
    let visitScheduleDate = {};
    if (body?.range) {
      visitScheduleDate = {
        scheduled_date: Sequelize.where(
          Sequelize.fn("date", Sequelize.col("scheduled_date")),
          {
            [Op.between]: body?.range,
          }
        ),
      };
    }

    const visits = await sequelizeServer.models.visits.findAll({
      where: {
        is_valid: true,
        field_engineer_id: user?.user_id,
        ...visitScheduleDate,
      },
      distinct: "visits.visit_id",
    });
    const amount = visits
      ?.filter((item) => item?.total_amount != null)
      .map((a) => parseFloat(a?.total_amount?.replace(/[^0-9.-]+/g, "")));
    const amountData = visits
      ?.filter((item) => item?.total_amount != null)
      ?.map((x) => x?.total_amount);
    const visitAmountData = visits
      ?.filter((item) => item?.visit_amount != null)
      ?.map((x) => x?.visit_amount);
    const visitAdditionalAmountData = visits
      ?.filter((item) => item?.additional_total != null)
      ?.map((x) => x?.additional_total);
    const units_of_work = visits?.map((item) => item?.units_of_work);
    const total_visits = visits?.length;
    const dateVisitObject = visits
      ?.sort((a, b) => {
        return new Date(a?.scheduled_date) - new Date(b?.scheduled_date);
      })
      .map((item) => item?.scheduled_date);
    var total_amount = amountData.reduce(
      (a, b) => a + parseFloat(b?.replace(/[^0-9.-]+/g, "")),
      0
    );

    var total_visit_amount = visitAmountData.reduce(
      (a, b) => a + parseFloat(b?.replace(/[^0-9.-]+/g, "")),
      0
    );
    var total_additional_amount = visitAdditionalAmountData.reduce(
      (a, b) => a + parseFloat(b?.replace(/[^0-9.-]+/g, "")),
      0
    );
    var total_units_of_work = units_of_work.reduce((a, b) => a + b, 0);
    var average_visit_amount = total_amount / total_visits;
    var count_visits = total_visits;
    return {
      total_amount,
      total_visit_amount,
      total_additional_amount,
      total_units_of_work,
      average_visit_amount,
      count_visits,
      dateVisit: dateVisitObject,
      amounts: amount,
    };
  } catch (error) {
    console.log(error);
    return error;
  }
}

async function getVisitsForPM(user, body) {
  try {
    let visitScheduleDate = {};
    if (body?.range) {
      visitScheduleDate = {
        scheduled_date: Sequelize.where(
          Sequelize.fn("date", Sequelize.col("scheduled_date")),
          {
            [Op.between]: body?.range,
          }
        ),
      };
    }
    const visits = await sequelizeServer.models.visits.findAll({
      include: [
        {
          model: sequelizeServer.models.tickets,
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
      where: { is_valid: true, ...visitScheduleDate },
      distinct: "visits.visit_id",
    });
    const amount = visits
      ?.filter((item) => item?.total_amount != null)
      .map((a) => parseFloat(a?.total_amount?.replace(/[^0-9.-]+/g, "")));
    const amountData = visits
      ?.filter((item) => item?.total_amount != null)
      ?.map((x) => x?.total_amount);
    const visitAmountData = visits
      ?.filter((item) => item?.visit_amount != null)
      ?.map((x) => x?.visit_amount);
    const visitAdditionalAmountData = visits
      ?.filter((item) => item?.additional_total != null)
      ?.map((x) => x?.additional_total);
    const units_of_work = visits?.map((item) => item?.units_of_work);
    const total_visits = visits?.length;
    const dateVisitObject = visits
      ?.sort((a, b) => {
        return new Date(a?.scheduled_date) - new Date(b?.scheduled_date);
      })
      .map((item) => item?.scheduled_date);
    var total_amount = amountData.reduce(
      (a, b) => a + parseFloat(b?.replace(/[^0-9.-]+/g, "")),
      0
    );
    var total_visit_amount = visitAmountData.reduce(
      (a, b) => a + parseFloat(b?.replace(/[^0-9.-]+/g, "")),
      0
    );
    var total_additional_amount = visitAdditionalAmountData.reduce(
      (a, b) => a + parseFloat(b?.replace(/[^0-9.-]+/g, "")),
      0
    );
    var total_units_of_work = units_of_work.reduce((a, b) => a + b, 0);
    var average_visit_amount = total_amount / total_visits;
    var count_visits = total_visits;
    return {
      total_amount,
      total_visit_amount,
      total_additional_amount,
      total_units_of_work,
      average_visit_amount,
      count_visits,
      dateVisit: dateVisitObject,
      amounts: amount,
    };
  } catch (error) {
    console.log(error);
    return error;
  }
}

async function getVisitsAdmin(body) {
  try {
    let visitScheduleDate = {};
    if (body?.range) {
      visitScheduleDate = {
        scheduled_date: Sequelize.where(
          Sequelize.fn("date", Sequelize.col("scheduled_date")),
          {
            [Op.between]: body?.range,
          }
        ),
      };
    }
    const visits = await sequelizeServer.models.visits.findAll({
      where: { is_valid: true, ...visitScheduleDate },
      distinct: "visits.visit_id",
    });

    const amount = visits
      ?.filter((item) => item?.total_amount != null)
      .map((a) => parseFloat(a?.total_amount?.replace(/[^0-9.-]+/g, "")));
    //.filter((item) => !Number.isNaN(item));

    const amountData = visits
      ?.filter((item) => item?.total_amount != null)
      ?.map((x) => x?.total_amount);
    const visitAmountData = visits
      ?.filter((item) => item?.visit_amount != null)
      ?.map((x) => x?.visit_amount);
    const visitAdditionalAmountData = visits
      ?.filter((item) => item?.additional_total != null)
      ?.map((x) => x?.additional_total);
    //.filter((item) => !Number.isNaN(item))?.map((item) => Number(item?.total_amount?.slice(1)))
    const units_of_work = visits?.map((item) => item?.units_of_work);
    const total_visits = visits?.length;
    const dateVisitObject = visits
      ?.sort((a, b) => {
        return new Date(a?.scheduled_date) - new Date(b?.scheduled_date);
      })
      .map((item) => item?.scheduled_date);

    var total_amount = amountData.reduce(
      (a, b) => a + parseFloat(b?.replace(/[^0-9.-]+/g, "")),
      0
    );
    var total_visit_amount = visitAmountData.reduce(
      (a, b) => a + parseFloat(b?.replace(/[^0-9.-]+/g, "")),
      0
    );
    var total_additional_amount = visitAdditionalAmountData.reduce(
      (a, b) => a + parseFloat(b?.replace(/[^0-9.-]+/g, "")),
      0
    );
    var total_units_of_work = units_of_work.reduce((a, b) => a + b, 0);
    var average_visit_amount = total_amount / total_visits;
    var count_visits = total_visits;
    return {
      total_amount,
      total_visit_amount,
      total_additional_amount,
      total_units_of_work,
      average_visit_amount,
      count_visits,
      dateVisit: dateVisitObject,
      amounts: amount,
    };
  } catch (error) {
    console.log(error);
    return error;
  }
}

async function generalizeSearch(body, user) {
  var visits = [];
  var projects = [];
  var tickets = [];
  var sites = [];
  var users=  [];
  const paginationConfig = { limit: body?.limit, offset: body?.offset };

  let visitfilters = await getVisitAdvanceFilters(
    body?.advanceVisitFilter,
    body?.sort,
    user
  );
  let ticketfilters = await getTicketAdvanceFilters(
    body?.advanceTicketFilter,
    body?.sort,
    user
  );
  let projectfilters = await getProjectAdvanceFilters(
    body?.advanceProjectFilter,
    body?.sort,
    user
  );
  let sitefilters = await getSiteAdvanceFilters(
    body?.advanceSiteFilter,
    body?.sort,
    user
  );

  switch (user?.user_type?.toLowerCase()) {
    case "field engineer":
      if (body?.advanceVisitFilter) {
        visits = await visitService.getFilterVisitsForFE(
          visitfilters,
          paginationConfig,
          user
        );
      }
      if (body?.advanceTicketFilter) {
        tickets = await ticketService.getFilterTicketsForFE(
          ticketfilters,
          paginationConfig,
          user
        );
      }
      if (body?.advanceProjectFilter) {
        projects = await projectService.getFilterProjectsForFE(
          projectfilters,
          paginationConfig,
          user
        );
      }
      if (body?.advanceSiteFilter) {
        sites = await siteService.getFilterSites(
          sitefilters,
          paginationConfig,
          user
        );
      }
      
      if (body?.advanceUserFilter) {
        users = await filterUsers(
          body?.advanceUserFilter?.filters,
          user
        );
      }

      break;
    case "admin":
      if (body?.advanceVisitFilter) {
        visits = await visitService.getFilterVisitsForAdmin(
          visitfilters,
          paginationConfig,
          user
        );
      }
      if (body?.advanceTicketFilter) {
        tickets = await ticketService.getFilterTicketsForAdmin(
          ticketfilters,
          paginationConfig,
          user
        );
      }
      if (body?.advanceProjectFilter) {
        projects = await projectService.getFilterProjectsForAdmin(
          projectfilters,
          paginationConfig,
          user
        );
      }
      if (body?.advanceSiteFilter) {
        sites = await siteService.getFilterSites(
          sitefilters,
          paginationConfig,
          user
        );
      }
      if (body?.advanceUserFilter) {
        users = await filterUsers(
          body?.advanceUserFilter?.filters,
          user
        );
      }

      break;
    case "project manager":
      if (body?.advanceVisitFilter) {
        visits = await visitService.getFilterVisitsForPM(
          visitfilters,
          paginationConfig,
          user
        );
      }
      if (body?.advanceTicketFilter) {
        tickets = await ticketService.getFilterTicketsForPM(
          ticketfilters,
          paginationConfig,
          user
        );
      }
      if (body?.advanceProjectFilter) {
        projects = await projectService.getFilterProjectsForPM(
          projectfilters,
          paginationConfig,
          user
        );
      }
      if (body?.advanceUserFilter) {
        users = await filterUsers(
          body?.advanceUserFilter?.filters,
          user
        );
      }
      if (body?.advanceSiteFilter) {
        sites = await siteService.getFilterSites(
          sitefilters,
          paginationConfig,
          user
        );
      }

      break;
    default:
      if (body?.advanceVisitFilter) {
        visits = await visitService.getFilterVisitsForAdmin(
          visitfilters,
          paginationConfig,
          user
        );
      }
      if (body?.advanceTicketFilter) {
        tickets = await ticketService.getFilterTicketsForAdmin(
          ticketfilters,
          paginationConfig,
          user
        );
      }
      if (body?.advanceProjectFilter) {
        projects = await projectService.getFilterProjectsForAdmin(
          projectfilters,
          paginationConfig,
          user
        );
      }
      if (body?.advanceSiteFilter) {
        sites = await siteService.getFilterSites(
          sitefilters,
          paginationConfig,
          user
        );
      }
      if (body?.advanceUserFilter) {
        users = await filterUsers(
          body?.advanceUserFilter?.filters,
          user
        );
      }
  }
  return {
    visits,
    projects,
    tickets,
    sites,
    users
  };
}
async function getVisitFinancials(user, body) {
  var visits = [];
  switch (user?.user_type?.toLowerCase()) {
    case "field engineer":
      visits = await getVisitsForFE(user, body);
      break;
    case "admin":
      visits = await getVisitsAdmin(body);
      break;
    case "project manager":
      visits = await getVisitsForPM(user, body);
      break;
    default:
      visits = await getVisitsAdmin(body);
  }
  return visits;
}
async function getVisitCountFE(user, conditions) {
  try {
    const forFE = conditions;
    conditions["field_engineer_id"] = user.user_id;
    let c = typeof user?.user_id;
    const result = await sequelizeServer.models.visits.count({
      where: forFE,
    });
    return result;
  } catch (error) {
    return error;
  }
}
async function getVisitCountPM(user, conditions) {
  try {
    const result = await sequelizeServer.models.visits.count({
      include: [
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
      where: conditions,
    });
    return result;
  } catch (error) {
    return error;
  }
}
async function getVisitCountAdmin(user, conditions) {
  try {
    const result = await sequelizeServer.models.visits.count({
      where: conditions,
    });
    return result;
  } catch (error) {
    return error;
  }
}

async function getActiveVisitCount(user, filters) {
  try {
    let result = [];
    let conditions = {
      is_valid: true,
      [Op.or]: [{ pm_status: { [Op.notIn]: ["Cancelled"] } }],
    };
    if (filters.is_active) {
      conditions = {
        is_valid: true,
        pm_status: ["Confirmed", "	Tentative"],
        // [Op.or]: [{ pm_status: { [Op.notIn]: ["Complete", "Cancelled"] } }],
      };
    }
    if(filters?.completed){
      conditions = {
        is_valid: true,
        pm_status: ["Complete"],
        // [Op.or]: [{ pm_status: { [Op.notIn]: ["Complete", "Cancelled"] } }],
      };
    }
    switch (user?.user_type?.toLowerCase()) {
      case "field engineer":
        result = await getVisitCountFE(user, conditions);
        break;
      case "admin":
        result = await getVisitCountAdmin(user, conditions);
        break;
      case "project manager":
        result = await getVisitCountPM(user, conditions);
        break;
      default:
        result = await getVisitCountAdmin(user, conditions);
    }
    return result;
  } catch (error) {
    return error;
  }
}

async function getVisitsScheduleForFE(user, conditions) {
  try {
    const forFE = conditions;
    conditions["field_engineer_id"] = user.user_id;
    const visits = await sequelizeServer.models.visits.findAll({
      attributes: requiredAttributes,
      where: forFE,
    });

    return visits;
  } catch (error) {
    console.log(error);
    return error;
  }
}

async function getVisitsScheduleForPM(user, conditions) {
  try {
    const visits = await sequelizeServer.models.visits.findAll({
      include: [
        {
          model: sequelizeServer.models.tickets,
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
      where: conditions,
      attributes: requiredAttributes,
      distinct: "visits.visit_id",
    });

    return visits;
  } catch (error) {
    console.log(error);
    return error;
  }
}

async function getVisitsSchedulesAdmin(user, conditions) {
  try {
    const visits = await sequelizeServer.models.visits.findAll({
      where: conditions,
      attributes: requiredAttributes,
      distinct: "visits.visit_id",
    });

    return visits;
  } catch (error) {
    console.log(error);
    return error;
  }
}

async function getVisitsScheduleDates(user, filters) {
  try {
    let result = 0;
    let conditions = {
      is_valid: true,
    };
    // if (filters.is_active) {
    //   conditions = {
    //     is_valid: true,
    //     [Op.or]: [{ pm_status: { [Op.notIn]: ["Complete", "Cancelled"] } }],
    //   };
    // }
    switch (user?.user_type?.toLowerCase()) {
      case "field engineer":
        result = await getVisitsScheduleForFE(user, conditions);
        break;
      case "admin":
        result = await getVisitsSchedulesAdmin(user, conditions);
        break;
      case "project manager":
        result = await getVisitsScheduleForPM(user, conditions);
        break;
      default:
        result = await getVisitsSchedulesAdmin(user, conditions);
    }
    return result;
  } catch (error) {
    return error;
  }
}

async function getSitesCount() {
  try {
    const result = await sequelizeServer.models.site.count();
    return result;
  } catch (error) {
    return error;
  }
}

async function getProjectsCountAdmin(user) {
  try {
    const result = await sequelizeServer.models.projects.count({
      where: { is_valid: true },
    });
    return result;
  } catch (error) {
    return error;
  }
}
async function getProjectsCountPM(user) {
  try {
    const result = await sequelizeServer.models.projects.count({
      include: [
        {
          model: sequelizeServer.models.users,
          where: { user_id: user.user_id },
          as: "project_managers",
        },
      ],
      where: { is_valid: true },
    });
    return result;
  } catch (error) {
    return error;
  }
}
async function getProjectsCountFE(user) {
  try {
    const result = await sequelizeServer.models.projects.count({
      include: [
        {
          model: sequelizeServer.models.users,
          where: { user_id: user.user_id },
          as: "users",
        },
      ],
      where: { is_valid: true },
    });
    return result;
  } catch (error) {
    return error;
  }
}

async function getProjectsCount(user) {
  try {
    let result = [];
    switch (user?.user_type?.toLowerCase()) {
      case "field engineer":
        result = await getProjectsCountFE(user);
        break;
      case "admin":
        result = await getProjectsCountAdmin(user);
        break;
      case "project manager":
        result = await getProjectsCountPM(user);
        break;
      default:
        result = await getProjectsCountAdmin(user);
    }
    return result;
  } catch (error) {
    return error;
  }
}

async function getTicketsCount() {
  try {
    const result = await sequelizeServer.models.tickets.count({
      where: { is_valid: true },
    });
    return result;
  } catch (error) {
    return error;
  }
}

async function getIssuesCount() {
  try {
    const result = await sequelizeServer.models.issues.count();
    return result;
  } catch (error) {
    return error;
  }
}

async function getInterruptionCount(user) {
  try {
    // if (user?.user_type?.toLowerCase() == "admin") {
    //   const result = await sequelizeServer.models.Interruptions.findAll({});
    //   return result;
    // } else {
    //   const result = await sequelizeServer.models.Interruptions.findAll({
    //     where: {
    //       [Op.or]: [
    //         { created_by: user.user_id },
    //         { modified_by: user.user_id },
    //         { approved_by: user.user_id },
    //         { resolved_by: user.user_id },
    //       ],
    //       is_valid: true,
    //     },
    //   });
    //   return result;

    if (user?.user_type?.toLowerCase() == "admin") {
      const Interruptions = sequelizeServer.models.Interruptions.findAll({
        include: [
          "approved_by_user",
          "created_by_user",
          "modified_by_user",
          "resolved_by_user",
        ],
      });
      return Interruptions;
    } else if (user?.user_type?.toLowerCase() == "field engineer") {
      const result = await sequelizeServer.models.visits.findAll({
        where: {
          field_engineer_id: user?.user_id,
          is_valid: true,
        },
      });
      let visits = [];
      result?.map((c) => {
        visits.push(c.visit_id);
      });
      console.log(visits);
      const Interruptions = sequelizeServer.models.Interruptions.findAll({
        include: [
          "approved_by_user",
          "created_by_user",
          "modified_by_user",
          "resolved_by_user",
        ],
        where: {
          visit_id: {
            [sequelizeServer.Sequelize.Op.in]: visits,
          },
          is_valid: true,
        },
      });

      return Interruptions;
    } else {
      const result = await sequelizeServer.models.users.findAll({
        where: {
          user_id: user?.user_id,
        },
        attributes: ["user_id"],
        include: [
          {
            model: sequelizeServer.models.projects,
            through: "projects_project_managers",
            as: "project_management_projects",
            attributes: ["project_id"],
            where: {
              is_valid: true,
            },
            include: [
              {
                model: sequelizeServer.models.tickets,
                as: "tickets",
                attributes: ["ticket_id"],
                where: {
                  is_valid: true,
                },
                include: [
                  {
                    model: sequelizeServer.models.visits,
                    as: "visits",
                    attributes: ["visit_id"],
                    where: {
                      is_valid: true,
                    },
                  },
                ],
              },
            ],
          },
        ],
      });
      let visits = [];
      result[0]?.dataValues?.project_management_projects?.map((a) => {
        a?.dataValues?.tickets?.map((b) => {
          b?.dataValues?.visits?.map((c) => {
            visits.push(c.visit_id);
          });
        });
      });

      const Interruptions = sequelizeServer.models.Interruptions.findAll({
        include: [
          "approved_by_user",
          "created_by_user",
          "modified_by_user",
          "resolved_by_user",
        ],
        where: {
          visit_id: {
            [sequelizeServer.Sequelize.Op.in]: visits,
          },
          is_valid: true,
        },
      });

      return Interruptions;
    }
  } catch (error) {
    return error;
  }
}

async function getApprovedInterruptionCount(user) {
  try {
    // if (user?.user_type?.toLowerCase() == "admin") {
    //   const result = await sequelizeServer.models.Interruptions.findAll({
    //     where: {
    //       [Op.or]: [
    //         { created_by: user.user_id },
    //         { modified_by: user.user_id },
    //         { approved_by: user.user_id },
    //         { resolved_by: user.user_id },
    //       ],
    //       approved: true,
    //     },
    //   });
    //   return result;
    // } else {
    //   const result = await sequelizeServer.models.Interruptions.findAll({
    //     where: {
    //       [Op.or]: [
    //         { created_by: user.user_id },
    //         { modified_by: user.user_id },
    //         { approved_by: user.user_id },
    //         { resolved_by: user.user_id },
    //       ],
    //       approved: true,
    //       is_valid: true,
    //     },
    //   });
    //   return result;
    // }
    if (user?.user_type?.toLowerCase() == "admin") {
      const Interruptions = sequelizeServer.models.Interruptions.findAll({
        include: [
          "approved_by_user",
          "created_by_user",
          "modified_by_user",
          "resolved_by_user",
        ],
        where: { approved: true },
      });
      return Interruptions;
    } else if (user?.user_type?.toLowerCase() == "field engineer") {
      const result = await sequelizeServer.models.visits.findAll({
        where: {
          field_engineer_id: user?.user_id,
          is_valid: true,
        },
      });
      let visits = [];
      result?.map((c) => {
        visits.push(c.visit_id);
      });
      console.log(visits);
      const Interruptions = sequelizeServer.models.Interruptions.findAll({
        include: [
          "approved_by_user",
          "created_by_user",
          "modified_by_user",
          "resolved_by_user",
        ],
        where: {
          visit_id: {
            [sequelizeServer.Sequelize.Op.in]: visits,
          },
          is_valid: true,
          approved: true,
        },
      });

      return Interruptions;
    } else {
      const result = await sequelizeServer.models.users.findAll({
        where: {
          user_id: user?.user_id,
        },
        attributes: ["user_id"],
        include: [
          {
            model: sequelizeServer.models.projects,
            through: "projects_project_managers",
            as: "project_management_projects",
            attributes: ["project_id"],
            where: {
              is_valid: true,
            },
            include: [
              {
                model: sequelizeServer.models.tickets,
                as: "tickets",
                attributes: ["ticket_id"],
                where: {
                  is_valid: true,
                },
                include: [
                  {
                    model: sequelizeServer.models.visits,
                    as: "visits",
                    attributes: ["visit_id"],
                    where: {
                      is_valid: true,
                    },
                  },
                ],
              },
            ],
          },
        ],
      });
      let visits = [];
      result[0]?.dataValues?.project_management_projects?.map((a) => {
        a?.dataValues?.tickets?.map((b) => {
          b?.dataValues?.visits?.map((c) => {
            visits.push(c.visit_id);
          });
        });
      });

      const Interruptions = sequelizeServer.models.Interruptions.findAll({
        include: [
          "approved_by_user",
          "created_by_user",
          "modified_by_user",
          "resolved_by_user",
        ],
        where: {
          visit_id: {
            [sequelizeServer.Sequelize.Op.in]: visits,
          },
          is_valid: true,
          approved: true,
        },
      });

      return Interruptions;
    }
  } catch (error) {
    return error;
  }
}

async function getInterruptionCountByVisitId(user, visit_id) {
  try {
    if (user?.user_type?.toLowerCase() == "admin") {
      const Interruptions = sequelizeServer.models.Interruptions.findAll({
        include: [
          "approved_by_user",
          "created_by_user",
          "modified_by_user",
          "resolved_by_user",
        ],
        where: { visit_id: visit_id },
      });
      return Interruptions;
    } else {
      const Interruptions = sequelizeServer.models.Interruptions.findAll({
        include: [
          "approved_by_user",
          "created_by_user",
          "modified_by_user",
          "resolved_by_user",
        ],
        where: {
          visit_id,
          is_valid: true,
        },
      });

      return Interruptions;
    }
  } catch (error) {
    return error;
  }
}

async function getApprovedInterruptionCountByVisitId(user, visit_id) {
  try {
    if (user?.user_type?.toLowerCase() == "admin") {
      const Interruptions = sequelizeServer.models.Interruptions.findAll({
        include: [
          "approved_by_user",
          "created_by_user",
          "modified_by_user",
          "resolved_by_user",
        ],
        where: { status: "Resolved", visit_id: visit_id },
      });
      return Interruptions;
    } else {
      const Interruptions = sequelizeServer.models.Interruptions.findAll({
        include: [
          "approved_by_user",
          "created_by_user",
          "modified_by_user",
          "resolved_by_user",
        ],
        where: {
          visit_id,
          is_valid: true,
          status: "Resolved",
        },
      });

      return Interruptions;
    }
  } catch (error) {
    return error;
  }
}
module.exports = {
  getActiveVisitCount,
  getSitesCount,
  getProjectsCount,
  getTicketsCount,
  getIssuesCount,
  getVisitsScheduleDates,
  getVisitFinancials,
  getInterruptionCount,
  getApprovedInterruptionCount,
  generalizeSearch,
  getInterruptionCountByVisitId,
  getApprovedInterruptionCountByVisitId,
};
