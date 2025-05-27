const { sequelizeServer, baseUrl } = require("../configs/sequelize.config");
const { transporter } = require("../configs/mail.config");
const Sequelize = require("sequelize");
const Op = Sequelize.Op;
const { promisify } = require("util");
const fs = require("fs");
var handlebars = require("handlebars");
const readFile = promisify(fs.readFile);
const { Novu } = require("@novu/node");
const novu = new Novu(process.env.NOVU_API_KEY);
async function InsertProject(project) {
  var result = await sequelizeServer.models.projects.create(project);
  if (project.users?.length > 0) {
    await sequelizeServer.models.projects_users.bulkCreate(
      project.users.map((user) => {
        return { project_id: result.project_id, user_id: user.user_id };
      })
    );
  }

  console.log(project);

  if (project.sites?.length > 0) {
    await sequelizeServer.models.project_sites_mappings.bulkCreate(
      project.sites.map((site) => {
        return { project_id: result.project_id, site_id: site?.value };
      })
    );
  }
  if (project.project_managers?.length > 0) {
    console.log("INSIDE");

    await sequelizeServer.models.projects_project_managers.bulkCreate(
      project.project_managers.map((user) => {
        return { project_id: result.project_id, user_id: user.user_id };
      })
    );

    var managers = await sequelizeServer.models.projects.findOne({
      where: { project_id: result.project_id },
      include: ["users", "project_managers"],
    });

    //send email
    // let html = await readFile(
    //   "public/UseEmailTemplates/visitAssignedPM.html",
    //   "utf8"
    // );
    // let template = handlebars.compile(html);

    let pm = "";
    project?.project_managers?.map((e) => {
      if (e?.full_name) {
        pm = pm + e.full_name + ", ";
      } else {
        pm = pm + e.label + ", ";
      }
    });

    let fe = "";
    project?.users?.map((e) => {
      if (e?.full_name) {
        fe = fe + e.full_name + ", ";
      } else {
        fe = fe + e.label + ", ";
      }
    });
    const date = new Date(project?.project_startDate);
    const date2 = new Date(project?.project_endDate);

    const options = { month: "numeric", day: "numeric", year: "numeric" };
    const formattedDate = date.toLocaleDateString("en-US", options);
    const formattedDate2 = date2.toLocaleDateString("en-US", options);
    let data = {
      subject: "Techapp Assignment Email",
      PROJECTNAME: project?.project_name,
      PROJECTID: result?.project_id,
      project_type: project?.project_type,
      company: project?.company_customer?.company_legal_name,
      start_date: formattedDate,
      project_endDate: formattedDate2,
      pm: pm,
      fe: fe,
      tickets_count: project?.tickets?.filter(
        (ticket) => ticket?.is_valid == true
      )?.length,
      sites_count: project?.sites?.length,
      baseURLClient: process.env.CLIENT_APP_BASE_URL,
    };
    const recipients = managers?.project_managers?.map((manager) => {
      novu.trigger("visitassignedpm", {
        to: {
          subscriberId: `${manager.user_id}`,
          email: `${manager.work_email}`,
        },
        payload: data,
      });
    });

    // console.log(recipients);

    // let htmlToSend = template(data);

    //send email
    // var mailOptions = {
    //   from: "TechApp Support support@techapp.co",
    //   to: recipients,
    //   subject: "Techapp Assignment Email",
    //   html: htmlToSend,
    // };
    // await transporter.sendMail(mailOptions, function (error, info) {
    //   if (error) {
    //     console.log(error);
    //     return error;
    //   } else {
    //     console.log("Email sent: " + info.response);
    //     return "Email Sent Successfully";
    //   }
    // });
  }
  return result;
}
async function AddSitesToProject(sites, id) {
  if (sites?.length > 0) {
    // sites?.forEach(async site=>{
    //   const foundSiteawait sequelizeServer.models.project_sites_mappings.findAll({where:{
    //     project_id:id,
    //     site_id:site?.site_id
    //   }})
    // })
    let result = [];
    for (const site of sites) {
      let res =
        await sequelizeServer.models.project_sites_mappings.findOrCreate({
          where: {
            project_id: id,
            site_id: site?.site_id,
          },
        });

      console.log(res);
      result.push(res[0]);
    }
    // // const result =
    // //   await sequelizeServer.models.project_sites_mappings.bulkCreate(
    // //     sites.map((site) => {
    // //       return { project_id: id, site_id: site?.site_id };
    // //     }),
    // //     { updateOnDuplicate: ["project_id", "site_id"] }
    // //   );

    return result;
  }
  return null;
}
async function EditProject(project, id) {
  var result = await sequelizeServer.models.projects.update(project, {
    where: { project_id: id },
  });

  await sequelizeServer.models.projects_users.destroy({
    where: { project_id: id },
  });

  if (project.users?.length > 0) {
    await sequelizeServer.models.projects_users.bulkCreate(
      project.users.map((user) => {
        return { project_id: id, user_id: user.user_id };
      })
    );
  }
  await sequelizeServer.models.project_sites_mappings.destroy({
    where: { project_id: id },
  });
  if (project.sites?.length > 0) {
    await sequelizeServer.models.project_sites_mappings.bulkCreate(
      project.sites.map((site) => {
        return { project_id: id, site_id: site?.value ?? site?.site_id };
      })
    );
  }

  const oldManagers =
    await sequelizeServer.models.projects_project_managers.findAll({
      where: { project_id: id },
      raw: true,
    });

  console.log(oldManagers);
  const uniqueArray = project?.project_managers?.filter(
    (item, index, arr) =>
      arr.findIndex((obj) => obj.user_id === item.user_id) === index
  );
  const newManagers = project.project_managers.filter(
    (project_manager) =>
      !oldManagers
        ?.map((manager) => manager.user_id)
        .includes(project_manager.user_id)
  );

  let pm = "";
  project?.project_managers?.map((e) => {
    if (e?.full_name) {
      pm = pm + e.full_name + ", ";
    } else {
      pm = pm + e.label + ", ";
    }
  });

  let fe = "";
  project?.users?.map((e) => {
    if (e?.full_name) {
      fe = fe + e.full_name + ", ";
    } else {
      fe = fe + e.label + ", ";
    }
  });

  const date = new Date(project?.project_startDate);
  const date2 = new Date(project?.project_endDate);

  const options = { month: "numeric", day: "numeric", year: "numeric" };
  const formattedDate = date.toLocaleDateString("en-US", options);
  const formattedDate2 = date2.toLocaleDateString("en-US", options);

  let data = {
    subject: `TechApp:Project ${project?.project_name} Assigned to you`,
    PROJECTNAME: project?.project_name,
    PROJECTID: id,
    project_type: project?.project_type,
    company: project?.company_customer?.company_legal_name,
    start_date: formattedDate,
    project_endDate: formattedDate2,
    pm: pm,
    fe: fe,
    sites_count: project?.tickets?.filter((ticket) => ticket?.is_valid == true)
      ?.length,
    tickets_count: project?.sites?.length,
    baseURLClient: process.env.CLIENT_APP_BASE_URL,
  };

  const managersEmailsSQL = await sequelizeServer.models.users.findAll({
    where: { user_id: newManagers?.map((p) => p.user_id) },
    raw: true,
  });

  const managersEmails = managersEmailsSQL.map((e) => {
    novu.trigger("visitassignedpm", {
      to: {
        subscriberId: `${e.user_id}`,
        email: e.work_email,
      },
      payload: data,
    });
  });
  // if (managersEmails.length > 0) {
  //   //send email
  //   // let html = await readFile(
  //   //   "public/UseEmailTemplates/visitAssignedPM.html",
  //   //   "utf8"
  //   // );
  //   // let template = handlebars.compile(html);

  //   });

  await sequelizeServer.models.projects_project_managers.destroy({
    where: { project_id: id },
  });

  // let htmlToSend = template(data);

  //send email
  // var mailOptions = {
  //   from: "TechApp Support support@techapp.co",
  //   to: managersEmails,
  //   //to: "hamzabilalbaig@gmail.com",
  //   subject: `TechApp:Project ${project?.project_name} Assigned to you`,
  //   html: htmlToSend,
  // };
  // await transporter.sendMail(mailOptions, function (error, info) {
  //   if (error) {
  //     console.log(error);
  //     return error;
  //   } else {
  //     console.log("Email sent: " + info.response);
  //     return "Email Sent Successfully";
  //   }
  // });

  if (uniqueArray?.length > 0) {
    await sequelizeServer.models.projects_project_managers.bulkCreate(
      uniqueArray.map((user) => {
        return { project_id: id, user_id: user.user_id };
      })
    );
  }
  return result;
}

// async function filterProjects(filters, user) {
//   var visits = [];
//   switch (user?.user_type?.toLowerCase()) {
//     case "field engineer":
//       visits = await getFilterVisitsForFE(filters, user);
//       break;
//     case "admin":
//       visits = await getFilterVisitsForAdmin(filters);
//       break;
//     case "project manager":
//       visits = await getFilterVisitsForPM(filters, user);
//       break;
//     default:
//       visits = await getFilterVisitsForAdmin(filters);
//   }
//   return visits;
// }

async function GetProjects(user) {
  if (user?.user_type?.toLowerCase() == "field engineer") {
    console.log("INSIDE FIELD ENGINEER 2");

    var result = await sequelizeServer.models.projects.findAll({
      include: [
        "users",
        "project_managers",
        "company_customer",
        "sites",
        "tickets",
      ],
    });
    return result?.filter((project) =>
      project.users?.find((userr) => userr.user_id == user.user_id)
    );
  } else if (user?.user_type?.toLowerCase() == "project manager") {
    console.log("INSIDE Project manager", "sites");

    var result = await sequelizeServer.models.projects.findAll({
      include: [
        "users",
        "project_managers",
        "company_customer",
        "sites",
        "tickets",
      ],
    });
    return result?.filter((project) =>
      project.project_managers?.find((userr) => userr.user_id == user.user_id)
    );
  } else {
    var result = sequelizeServer.models.projects.findAll({
      include: [
        "users",
        "project_managers",
        "company_customer",
        "sites",
        "tickets",
      ],
    });
    return result;
  }
}

async function GetProjectVisits(project_id) {
  var tickets = await sequelizeServer.models.tickets.findAll({
    where: { project_id: project_id, is_valid: true },
    include: [
      {
        model: sequelizeServer.models.visits,
        as: "visits",
        include: [
          {
            model: sequelizeServer.models.visit_activity,
            as: "visit_activities",
            order: [["time", "DESC"]],
          },
          "visit_additional_pictures",
          "tower_visits",
          "midband_fdd_tdd_scops",
          {
            model: sequelizeServer.models.users,
            attributes: [
              "user_id",
              "first_name",
              "last_name",
              "email",
              "company",
              "position",
              "cell_phone",
              "state",
              "rate_type",
              "hourly_rate",
              "salary_rate",
              "day_rate",
              "monthly_rate",
            ],
            as: "field_engineer",
          },
        ],
        where: { is_valid: true },
        order: [["scheduled_date", "DESC"]],
      },
    ],
  });

  let visits = [];

  tickets?.forEach((t) => {
    if (t?.visits?.length > 0) {
      t?.visits?.forEach((v) => {
        visits.push(v);
      });
    }
  });
  let sorted = visits.sort(
    (a, b) => Date.parse(b?.scheduled_date) - Date.parse(a?.scheduled_date)
  );
  return sorted;
}
async function GetProjectByID(id, user) {
  let filter = { project_id: id };
  if (
    user?.user_type?.toLowerCase() == "field engineer" ||
    user?.user_type?.toLowerCase() == "project manager"
  ) {
    filter = { project_id: id, is_valid: true };
  }
  var result = await sequelizeServer.models.projects.findOne({
    where: filter,
    include: [
      "users",
      "project_managers",
      "company_customer",
      "sites",
      {
        model: sequelizeServer.models.tickets,
        //where: { is_valid: true },
        include: ["site"],
        as: "tickets",
      },
    ],
  });
  return result;
}

async function GetProjectUsers(id) {
  var project = await sequelizeServer.models.projects.findOne({
    where: { project_id: id },
    include: ["users", "project_managers"],
  });

  if (project) {
    var users = project?.users?.concat(project?.project_managers);
    return users;
  }
  return [];
}

async function GetProjectSites(id) {
  var result = await sequelizeServer.models.projects.findOne({
    where: { project_id: id },
    include: [
      {
        model: sequelizeServer.models.site,
        as: "sites",
        attributes: [
          "site_id",
          "id",
          "structure_type",
          "site_desc",
          "Operator",
          "region_name",
          "market",
          "lat_long",
          "latitude",
          "longitude",
        ],
        through: { attributes: [] },
      },
    ],
  });
  const sites = result?.sites;
  return sites;
}

async function deleteProject(id) {
  try {
    const isProjectDeleted = await sequelizeServer.models.projects.update(
      { is_valid: false },
      { where: { project_id: id } }
    );
    return { isProjectDeleted };
  } catch (error) {
    return error;
  }
}

async function undoDeleteProject(id) {
  try {
    const isProjectDeleted = await sequelizeServer.models.projects.update(
      { is_valid: true },
      { where: { project_id: id } }
    );
    return { isProjectDeleted };
  } catch (error) {
    return error;
  }
}
async function RemoveProject(id) {
  const result = await sequelizeServer.transaction(async (t) => {
    const isProjectDeleted = await sequelizeServer.models.projects.destroy(
      {
        where: { project_id: id },
      },
      { transaction: t }
    );

    const ticket = await sequelizeServer.models.tickets.findOne({
      where: { project_id: id },
    });
    if (ticket != null || ticket != undefined) {
      const isTicketDeleted = await sequelizeServer.models.tickets.destroy(
        ticket,
        { transaction: t }
      );

      return isProjectDeleted;
    }
  });

  return result;
}

async function GetProjectTickets(project_id) {
  var tickets = await sequelizeServer.models.tickets.findAll({
    where: { project_id: project_id, is_valid: true },
    order: [["ticket_date", "DESC"]],
    include: [
      {
        model: sequelizeServer.models.projects,
        as: "project",
        include: ["project_managers", "users"],
      },
      "site",
      {
        model: sequelizeServer.models.visits,
        as: "visits",
        where: { is_valid: true },
        attributes: ["visit_id", "pm_status", "is_valid"],
        required: false,
      },
    ],
  });

  return tickets;
}

// async function getProjectsPaginationForFE(filters,user){

// }

async function getProjectsPaginationAdmin(filters) {
  try {
    const projects = await sequelizeServer.models.projects.findAndCountAll({
      include: [
        "users",
        "project_managers",
        "company_customer",
        {
          model: sequelizeServer.models.tickets,
          as: "tickets",
          attributes: ["ticket_id"],
        },
      ],
      limit: filters.limit,
      offset: filters.offset,
      where: { is_valid: true },
      distinct: "projects.project_id",
    });
    return projects;
  } catch (error) {
    return error;
  }
}

async function getProjectsPaginationForPM(filters, user) {
  try {
    const projects = await sequelizeServer.models.projects.findAndCountAll({
      include: [
        "users",
        {
          model: sequelizeServer.models.users,
          where: { user_id: user.user_id },
          as: "project_managers",
        },
        "company_customer",
        {
          model: sequelizeServer.models.tickets,
          as: "tickets",
          attributes: ["ticket_id"],
        },
      ],
      limit: filters.limit,
      offset: filters.offset,
      where: { is_valid: true },
      distinct: "projects.project_id",
    });
    return projects;
  } catch (error) {
    return error;
  }
}

async function getProjectsPM(user) {
  try {
    const projects = await sequelizeServer.models.projects.findAndCountAll({
      include: [
        "users",
        {
          model: sequelizeServer.models.users,
          where: { user_id: user },
          as: "project_managers",
        },
        "company_customer",
        {
          model: sequelizeServer.models.tickets,
          as: "tickets",
          attributes: ["ticket_id"],
        },
      ],
      // order: [["scheduled_date", "DESC"]],

      where: { is_valid: true },
      distinct: "projects.project_id",
    });
    return projects;
  } catch (error) {
    return error;
  }
}

async function getProjectsFE(user) {
  try {
    const projects = await sequelizeServer.models.projects.findAndCountAll({
      include: [
        {
          model: sequelizeServer.models.users,
          where: { user_id: user },
          as: "users",
        },
        "project_managers",
        "company_customer",
        {
          model: sequelizeServer.models.tickets,
          as: "tickets",
          attributes: ["ticket_id"],
        },
      ],
      // order: [["scheduled_date", "DESC"]],
      where: { is_valid: true },
      distinct: "projects.project_id",
    });
    return projects;
  } catch (error) {
    return error;
  }
}

async function getProjectsPaginationForFE(filters, user) {
  try {
    const projects = await sequelizeServer.models.projects.findAndCountAll({
      include: [
        {
          model: sequelizeServer.models.users,
          where: { user_id: user.user_id },
          as: "users",
        },
        "project_managers",
        "company_customer",
        {
          model: sequelizeServer.models.tickets,
          as: "tickets",
          attributes: ["ticket_id"],
        },
      ],
      limit: filters.limit,
      offset: filters.offset,
      where: { is_valid: true },
      distinct: "projects.project_id",
    });
    return projects;
  } catch (error) {
    return error;
  }
}

async function projectPagination(filters, user) {
  var projects = [];
  switch (user?.user_type?.toLowerCase()) {
    case "field engineer":
      projects = await getProjectsPaginationForFE(filters, user);
      break;
    case "admin":
      projects = await getProjectsPaginationAdmin(filters);
      break;
    case "project manager":
      projects = await getProjectsPaginationForPM(filters, user);
      break;
    default:
      projects = await getProjectsPaginationAdmin(filters);
  }
  return projects;
}

async function projectforRole(body) {
  var projects = [];
  switch (body.params.type?.toLowerCase()) {
    case "field engineer":
      projects = await getProjectsFE(body.params.id);
      break;
    case "project manager":
      projects = await getProjectsPM(body.params.id);
      break;
  }
  return projects;
}

async function getFilterProjectsForAdmin(filters, paginationConfig, user) {
  try {
    const projects = await sequelizeServer.models.projects.findAndCountAll({
      include: [
        "users",
        "project_managers",
        "company_customer",
        "sites",
        {
          model: sequelizeServer.models.tickets,
          as: "tickets",
          attributes: ["ticket_id"],
        },
      ],
      offset: paginationConfig?.offset,
      limit: paginationConfig?.limit,
      where: {
        ...filters?.project_name,
        ...filters?.project_type,
        ...filters?.project_startDate,
        ...filters?.project_endDate,
        ...filters?.is_valid,
      },
      order: filters?.project_date_sort ? [[filters?.project_date_sort]] : [],
      distinct: "projects.project_id",
    });
    return projects;
  } catch (error) {
    return error;
  }
}

async function getFilterProjectsForPM(filters, paginationConfig, user) {
  try {
    const projects = await sequelizeServer.models.projects.findAndCountAll({
      include: [
        "users",
        {
          model: sequelizeServer.models.users,
          where: { user_id: user.user_id },
          as: "project_managers",
        },
        {
          model: sequelizeServer.models.customers,
          as: "company_customer",
          where: filters?.company_legal_name,
        },
        "sites",
        {
          model: sequelizeServer.models.tickets,
          as: "tickets",
          attributes: ["ticket_id"],
        },
      ],
      offset: paginationConfig?.offset,
      limit: paginationConfig?.limit,
      where: {
        is_valid: true,
        ...filters?.project_name,
        ...filters?.project_type,
        ...filters?.project_startDate,
        ...filters?.project_endDate,
      },
      order: filters?.project_date_sort ? [[filters?.project_date_sort]] : [],
      distinct: "projects.project_id",
    });
    return projects;
  } catch (error) {
    return error;
  }
}

async function getFilterProjectsForFE(filters, paginationConfig, user) {
  try {
    const projects = await sequelizeServer.models.projects.findAndCountAll({
      include: [
        {
          model: sequelizeServer.models.users,
          where: { user_id: user.user_id },
          as: "users",
        },
        "project_managers",
        {
          model: sequelizeServer.models.customers,
          as: "company_customer",
          where: filters?.company_legal_name,
        },
        "sites",
        {
          model: sequelizeServer.models.tickets,
          as: "tickets",
          attributes: ["ticket_id"],
        },
      ],
      limit: filters.limit,
      offset: filters.offset,
      offset: paginationConfig?.offset,
      limit: paginationConfig?.limit,
      where: {
        is_valid: true,
        ...filters?.project_name,
        ...filters?.project_type,
        ...filters?.project_startDate,
        ...filters?.project_endDate,
      },
      order: filters?.project_date_sort ? [[filters?.project_date_sort]] : [],
      distinct: "projects.project_id",
    });
    return projects;
  } catch (error) {
    return error;
  }
}
async function filterProjects(body, user) {
  var projects = [];
  const paginationConfig = { limit: body?.limit, offset: body?.offset };
  let filters = await getAdvanceFilters(body?.advanceFilter, body?.sort, user);
  switch (user?.user_type?.toLowerCase()) {
    case "field engineer":
      projects = await getFilterProjectsForFE(filters, paginationConfig, user);
      break;
    case "admin":
      projects = await getFilterProjectsForAdmin(
        filters,
        paginationConfig,
        user
      );
      break;
    case "project manager":
      projects = await getFilterProjectsForPM(filters, paginationConfig, user);
      break;
    default:
      projects = await getFilterProjectsForAdmin(
        filters,
        paginationConfig,
        user
      );
  }
  return projects;
}

async function getAdvanceFilters(advanceFilter, sort, user) {
  let project_name = {};
  let project_type = {};
  let project_startDate = {};
  let project_endDate = {};
  let company_legal_name = null;
  let project_date_sort = null;
  let is_valid = null;
  let user_id = null;
  if (user?.user_type?.toLowerCase() === "field engineer") {
    user_id = user.user_id;
  }
  if (advanceFilter) {
    switch (advanceFilter.columnField) {
      case "project_name":
        if (advanceFilter.value) {
          project_name = {
            project_name: {
              [Op.iLike]: `%${advanceFilter.value}%`,
            },
          };
        }
        break;
      case "project_type":
        if (advanceFilter.value) {
          project_type = {
            project_type: {
              [Op.iLike]: `%${advanceFilter.value}%`,
            },
          };
        }
        break;
      case "company":
        if (advanceFilter.value) {
          company_legal_name = {
            company_legal_name: {
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
      case "project_startDate":
        if (sort?.sort) {
          project_date_sort = ["project_startDate", sort?.sort?.toUpperCase()];
        }
        break;
      case "project_endDate":
        if (sort?.sort) {
          project_date_sort = ["project_endDate", sort?.sort?.toUpperCase()];
        }
        break;
    }
  }
  return {
    project_name,
    project_type,
    project_startDate,
    project_endDate,
    company_legal_name,
    project_date_sort,
    user_id,
    is_valid,
  };
}
module.exports = {
  InsertProject,
  GetProjects,
  GetProjectByID,
  RemoveProject,
  deleteProject,
  EditProject,
  GetProjectVisits,
  GetProjectTickets,
  projectPagination,
  filterProjects,
  GetProjectSites,
  AddSitesToProject,
  projectforRole,
  GetProjectUsers,
  undoDeleteProject,
  getAdvanceFilters,
  getFilterProjectsForFE,
  getFilterProjectsForAdmin,
  getFilterProjectsForPM,
};
