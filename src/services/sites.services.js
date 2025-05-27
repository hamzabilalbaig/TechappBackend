const { sequelizeServer } = require("./../../src/configs/sequelize.config");
const Sequelize = require("sequelize");
const Op = Sequelize.Op;
async function GetSites() {
  try {
    const sites = sequelizeServer.models.site.findAll({
      order: [["site_id", "ASC"]],
    });
    return sites;
  } catch (err) {
    return err;
  }
}

async function checkSiteId(siteID) {
  const site = await sequelizeServer.models.site.findOne({
    where: { id: siteID },
  });

  return site?.id ? false : true;
}

async function AddSite(site) {
  try {
    var result = sequelizeServer.models.site.create(site);
    return result;
  } catch (error) {
    return error;
  }
}
async function getFilterSites(filters, paginationConfig, user) {
  var result = await sequelizeServer.models.site.findAndCountAll({
    include: {
      model: sequelizeServer.models.projects,
      through: "project_sites_mappings",
      as: "projects",
    },
    where: {
      ...filters?.id,
      ...filters?.Operator,
      ...filters?.region_name,
      ...filters?.market,
      ...filters?.project_status,
    },
    offset: paginationConfig?.offset,
    limit: paginationConfig?.limit,
    order: filters?.hard_cost_vendor_sort
      ? [[filters?.hard_cost_vendor_sort]]
      : [],
  });
  return result;
}
async function filterSites(body) {
  try {
    const paginationConfig = { limit: body?.limit, offset: body?.offset };
    let filters = await getAdvanceFilters(body?.advanceFilter, body?.sort);
    const sites = await getFilterSites(filters, paginationConfig);
    return sites;
  } catch (error) {
    return error;
  }
}

async function getSitesForDropdownFilter(filter) {
  try {
    var result = await sequelizeServer.models.site.findAndCountAll({
      where: {
        id: {
          [Op.iLike]: `%${filter?.input}%`,
        },
      },
      offset: filter?.offset,
      limit: filter?.limit,
    });
    return result;
  } catch (error) {
    return error;
  }
}

async function checkSites(idList) {
  var result = await sequelizeServer.models.site.findAll({
    where: { id: idList?.sites },
    attributes: ["id", "site_id"],
  });
  return result;
}
async function getAdvanceFilters(advanceFilter, sort, user) {
  let id = {};
  let Operator = {};
  let region_name = {};
  let market = {};
  let project_status = {};
  let hard_cost_vendor_sort = null;
  if (advanceFilter) {
    switch (advanceFilter.columnField) {
      case "site_id":
        if (advanceFilter.value) {
          id = {
            id: {
              [Op.iLike]: `%${advanceFilter.value}%`,
            },
          };
        }
        break;
      case "Operator":
        if (advanceFilter.value) {
          Operator = {
            Operator: {
              [Op.iLike]: `%${advanceFilter.value}%`,
            },
          };
        }
        break;
      case "region_name":
        if (advanceFilter.value) {
          region_name = {
            region_name: {
              [Op.iLike]: `%${advanceFilter.value}%`,
            },
          };
        }
        break;
      case "market":
        if (advanceFilter.value) {
          market = {
            market: {
              [Op.iLike]: `%${advanceFilter.value}%`,
            },
          };
        }
        break;
      case "project_status":
        if (advanceFilter.value) {
          project_status = {
            project_status: {
              [Op.iLike]: `%${advanceFilter.value}%`,
            },
          };
        }
        break;
      case "project_startDate":
        if (advanceFilter.value) {
          project_startDate = {
            project_startDate: Sequelize.where(
              Sequelize.fn("date", Sequelize.col("project_startDate")),
              {
                [Op.eq]: advanceFilter.value,
              }
            ),
          };
        }
        break;
      case "project_endDate":
        if (advanceFilter.value) {
          project_endDate = {
            project_endDate: Sequelize.where(
              Sequelize.fn("date", Sequelize.col("project_endDate")),
              {
                [Op.eq]: advanceFilter.value,
              }
            ),
          };
        }
        break;
    }
  }
  if (sort) {
    switch (sort?.field) {
      case "hard_cost_vendor":
        if (sort?.sort) {
          hard_cost_vendor_sort = [
            "hard_cost_vendor",
            sort?.sort?.toUpperCase(),
          ];
        }
        break;
    }
  }
  return {
    id,
    Operator,
    region_name,
    market,
    project_status,
    hard_cost_vendor_sort,
  };
}

async function UpdateSite(site, id) {
  try {
    var result = sequelizeServer.models.site.update(site, {
      where: { site_id: id },
    });
    return result;
  } catch (error) {
    return error;
  }
}

async function DeleteSite(id) {
  try {
    var result = sequelizeServer.models.site.destroy({
      where: { site_id: id },
    });
    return result;
  } catch (error) {
    return error;
  }
}

async function GetSiteBySiteID(id) {
  await sequelizeServer.models.site.update(
    { is_new: false },
    { where: { site_id: id } }
  );
  const site = await sequelizeServer.models.site.findOne({
    where: { site_id: id },
  });

  return site;
}

async function getSitesForDropdown() {
  const sites = await sequelizeServer.models.site.findAll({
    attributes: [
      ["id", "label"],
      ["site_id", "value"],
    ],
  });
  return sites;
}

async function sitePagination(filters) {
  const sites = await sequelizeServer.models.site.findAndCountAll({
    include: {
      model: sequelizeServer.models.projects,
      through: "project_sites_mappings",
      as: "projects",
    },
    limit: filters.limit,
    offset: filters.offset,
  });

  return sites;
}

async function getSitesByVisitsForFE(user) {
  try {
    const sites = await sequelizeServer.models.site.findAll({
      include: [
        {
          model: sequelizeServer.models.tickets,
          as: "tickets",
          include: [
            {
              model: sequelizeServer.models.visits,
              as: "visits",
              where: { is_valid: true, field_engineer_id: user.user_id },
            },
          ],
        },
      ],
      where: {
        "$tickets.visits.visit_id$": { [Op.ne]: null },
      },
      group: ["site.site_id", "tickets.ticket_id", "tickets->visits.visit_id"],
    });

    return sites;
  } catch (error) {
    console.log(error);
    return error;
  }
}

async function getSitesByVisitsForPM(user) {
  try {
    const sites = await sequelizeServer.models.site.findAll({
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
          as: "tickets",

          include: [
            {
              model: sequelizeServer.models.visits,
              as: "visits",
              where: { is_valid: true },
            },
          ],
        },
      ],

      where: {
        "$tickets.visits.visit_id$": { [Op.ne]: null },
      },
      group: ["site.site_id", "tickets.ticket_id", "tickets->visits.visit_id"],
    });

    return sites;
  } catch (error) {
    console.log(error);
    return error;
  }
}

async function getSitesByVisitsAdmin() {
  try {
    const sites = await sequelizeServer.models.site.findAll({
      include: [
        {
          model: sequelizeServer.models.tickets,
          as: "tickets",
          include: [
            {
              model: sequelizeServer.models.visits,
              as: "visits",
            },
          ],
        },
      ],
      order: [["last_updated", "DESC"]],
      where: {
        "$tickets.visits.visit_id$": { [Op.ne]: null },
      },
      group: ["site.site_id", "tickets.ticket_id", "tickets->visits.visit_id"],
    });

    return sites;
  } catch (error) {
    console.log(error);
    return error;
  }
}

async function getSitesByVisits(user) {
  var visits = [];
  switch (user?.user_type?.toLowerCase()) {
    case "field engineer":
      visits = await getSitesByVisitsForFE(user);
      break;
    case "admin":
      visits = await getSitesByVisitsAdmin();
      break;
    case "project manager":
      visits = await getSitesByVisitsForPM(user);
      break;
    default:
      visits = await getSitesByVisitsAdmin();
  }
  return visits;
}

module.exports = {
  GetSites,
  AddSite,
  UpdateSite,
  DeleteSite,
  GetSiteBySiteID,
  getSitesForDropdown,
  checkSiteId,
  filterSites,
  sitePagination,
  getSitesByVisits,
  getSitesForDropdownFilter,
  checkSites,
  getAdvanceFilters,
  getFilterSites
};
