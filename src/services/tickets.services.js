const { sequelizeServer } = require("../configs/sequelize.config");
const Sequelize = require("sequelize");
const Op = Sequelize.Op;
const { USER_ATTRIBUES } = require("../utils/attributes");
async function InsertTicket(ticket) {
  try {
    const ticketCheck = await sequelizeServer.models.tickets.findAll({
      where: {
        site_id: ticket?.site_id,
        project_id: ticket?.project_id,
        is_valid: true,
      },
    });
    if (ticketCheck?.length > 0) {
      return "ap";
    } else {
      const result = await sequelizeServer.models.tickets.create(ticket);
      if (result?.ticket_id) {
        const ticket = await GetTicketById(result?.ticket_id);
        return ticket;
      }
      return result;
    }
  } catch (ex) {
    return ex;
  }
}

async function ticketCheck(site_id, project_id) {
  const checkTicket = await sequelizeServer.models.tickets.findOne({
    where: { site_id: site_id, project_id: project_id, is_valid: true },
  });
  return checkTicket;
}

async function EditTicket(ticket, id) {
  var result = sequelizeServer.models.tickets.update(ticket, {
    where: { ticket_id: id },
  });
  return result;
}

async function GetTickets(user) {
  if (user?.user_type?.toLowerCase() == "field engineer") {
    var result = await sequelizeServer.models.tickets.findAll({
      order: [["ticket_date", "DESC"]],
      include: [
        {
          model: sequelizeServer.models.projects,
          as: "project",
          include: ["project_managers", "users"],
        },
        "site",
      ],
    });
    return result?.filter((ticket) =>
      ticket?.project?.users?.find((userr) => userr.user_id == user.user_id)
    );
  } else if (user?.user_type?.toLowerCase() == "project manager") {
    var result = await sequelizeServer.models.tickets.findAll({
      order: [["ticket_date", "DESC"]],
      include: [
        {
          model: sequelizeServer.models.projects,
          as: "project",
          include: ["project_managers", "users"],
        },
        "site",
      ],
    });
    return result?.filter((ticket) =>
      ticket?.project?.project_managers?.find(
        (userr) => userr?.user_id == user?.user_id
      )
    );
  } else {
    var result = await sequelizeServer.models.tickets.findAll({
      order: [["ticket_date", "DESC"]],
      include: [
        {
          model: sequelizeServer.models.projects,
          as: "project",
          include: ["project_managers", "users"],
        },
        "site",
      ],
    });
    return result;
  }
}

async function GetTicketById(id, user) {
  try {
    await sequelizeServer.models.tickets.update(
      { is_new: false },
      { where: { ticket_id: id } }
    );
    let filter = { ticket_id: id };
    if (
      user?.user_type?.toLowerCase() == "field engineer" ||
      user?.user_type?.toLowerCase() == "project manager"
    ) {
      filter = { ticket_id: id, is_valid: true };
    }
    var result = await sequelizeServer.models.tickets.findOne({
      where: filter,
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
          include: [
            {
              model: sequelizeServer.models.users,
              attributes: USER_ATTRIBUES,
              as: "field_engineer",
            },
          ],
        },
      ],
    });
    return result;
  } catch (error) {
    console.log(error);
    return null;
  }
}

async function RemoveTicket(id) {
  var result = sequelizeServer.models.tickets.update(
    { is_valid: false },
    {
      where: { ticket_id: id },
    }
  );
  return result;
}

async function undoDeleteTicket(id) {
  try {
    var result = sequelizeServer.models.tickets.update(
      { is_valid: true },
      {
        where: { ticket_id: id },
      }
    );
    return result;
  } catch (ex) {
    return ex;
  }
}

async function PMTickets(user, filters) {
  var result = await sequelizeServer.models.tickets.findAndCountAll({
    include: [
      {
        model: sequelizeServer.models.projects,
        as: "project",
        include: [
          {
            model: sequelizeServer.models.users,
            as: "project_managers",
            where: { user_id: user?.user_id },
            required: true,
          },
          "users",
        ],
        required: true,
      },
      "site",
    ],
    limit: filters.limit,
    offset: filters.offset,
    where: {
      is_valid: true,
    },
    distinct: "ticket_id",
  });
  return result;
}

async function ticketPagination(user, filters) {
  if (user?.user_type?.toLowerCase() == "field engineer") {
    var result = await sequelizeServer.models.tickets.findAndCountAll({
      include: [
        {
          model: sequelizeServer.models.projects,
          as: "project",
          include: [
            "project_managers",
            {
              model: sequelizeServer.models.users,
              as: "users",
              where: { user_id: user?.user_id },
              required: true,
            },
          ],
          required: true,
        },
        "site",
      ],
      limit: filters.limit,
      offset: filters.offset,
      where: {
        is_valid: true,
      },
      distinct: "ticket_id",
    });
    return result;
    // return result?.filter((ticket) =>
    //   ticket?.project?.users?.find((userr) => userr.user_id == user.user_id)
    // );
  } else if (user?.user_type?.toLowerCase() == "project manager") {
    return PMTickets(user, filters);
    // var result = await sequelizeServer.models.tickets.findAndCountAll({
    //   include: [
    //     {
    //       model: sequelizeServer.models.projects,
    //       as: "project",
    //       include: ["project_managers", "users"],
    //     },
    //     "site",
    //   ],
    //   limit: filters.limit,
    //   offset: filters.offset,
    //   distinct: "ticket_id",
    // });
    // return result?.filter((ticket) =>
    //   ticket?.project?.project_managers?.find(
    //     (userr) => userr?.user_id == user?.user_id
    //   )
    // );
  } else {
    var result = await sequelizeServer.models.tickets.findAndCountAll({
      include: [
        {
          model: sequelizeServer.models.projects,
          as: "project",
          include: ["project_managers", "users"],
        },
        "site",
      ],
      limit: filters.limit,
      offset: filters.offset,
      where: {
        is_valid: true,
      },
      distinct: "ticket_id",
    });
    return result;
  }
}
async function getFilterTicketsForAdmin(filters, paginationConfig, user) {
  try {
    var result = await sequelizeServer.models.tickets.findAndCountAll({
      include: [
        {
          model: sequelizeServer.models.projects,
          as: "project",
          include: ["project_managers", "users"],
          where: filters?.project_name,
        },
        {
          model: sequelizeServer.models.site,
          as: "site",
          where: filters?.site_id,
        },
        {
          model: sequelizeServer.models.visits,
          as: "visits",
          attributes: ["visit_id"],
        },
      ],
      offset: paginationConfig?.offset,
      limit: paginationConfig?.limit,
      where: {
        ...filters?.ticket_date,
        ...filters?.is_valid,
      },
      order: filters?.ticket_sort ? [[filters?.ticket_sort]] : [],
      distinct: "ticket_id",
    });
    return result;
  } catch (error) {
    return error;
  }
}
async function getFilterTicketsForFE(filters, user) {
  try {
    var result = await sequelizeServer.models.tickets.findAndCountAll({
      include: [
        {
          model: sequelizeServer.models.projects,
          as: "project",
          include: [
            "project_managers",
            {
              model: sequelizeServer.models.users,
              as: "users",
              where: { user_id: user?.user_id },
              required: true,
            },
          ],
          where: filters?.project_name,
          required: true,
        },
        {
          model: sequelizeServer.models.site,
          as: "site",
          where: filters?.site_id,
        },
        {
          model: sequelizeServer.models.visits,
          as: "visits",
          attributes: ["visit_id"],
        },
      ],

      offset: paginationConfig?.offset,
      limit: paginationConfig?.limit,
      where: {
        ...filters?.ticket_date,
        is_valid: true,
      },
      order: filters?.ticket_sort ? [[filters?.ticket_sort]] : [],
      distinct: "ticket_id",
    });
    return result;
  } catch (error) {
    return error;
  }
}
async function getTicketsForFE(user) {
  try {
    var result = await sequelizeServer.models.tickets.findAll({
      order: [["ticket_date", "DESC"]],
      include: [
        {
          model: sequelizeServer.models.projects,
          as: "project",
          include: [
            "project_managers",
            {
              model: sequelizeServer.models.users,
              as: "users",
              where: { user_id: user?.user_id },
              required: true,
            },
          ],

          required: true,
        },
        {
          model: sequelizeServer.models.site,
          as: "site",
        },
        {
          model: sequelizeServer.models.visits,
          as: "visits",
          attributes: ["visit_id"],
        },
      ],
      where: {
        is_valid: true,
      },
      distinct: "ticket_id",
    });
    return result;
  } catch (error) {
    return error;
  }
}

async function getTicketsForPM(filters) {
  try {
    var result = await sequelizeServer.models.tickets.findAll({
      order: [["ticket_date", "DESC"]],
      include: [
        {
          model: sequelizeServer.models.projects,
          as: "project",
          include: [
            {
              model: sequelizeServer.models.users,
              as: "project_managers",
              where: { user_id: filters?.user_id },
              required: true,
            },
            "users",
          ],
          required: true,
        },
        {
          model: sequelizeServer.models.site,
          as: "site",
        },
        {
          model: sequelizeServer.models.visits,
          as: "visits",
          attributes: ["visit_id"],
        },
      ],

      where: {
        is_valid: true,
      },
      distinct: "ticket_id",
    });
    return result;
  } catch (error) {
    return error;
  }
}

async function getFilterTicketsForPM(filters, paginationConfig, user) {
  try {
    var result = await sequelizeServer.models.tickets.findAndCountAll({
      include: [
        {
          model: sequelizeServer.models.projects,
          as: "project",
          include: [
            {
              model: sequelizeServer.models.users,
              as: "project_managers",
              where: { user_id: user?.user_id },
              required: true,
            },
            "users",
          ],
          where: filters?.project_name,
          required: true,
        },
        {
          model: sequelizeServer.models.site,
          as: "site",
          where: filters?.site_id,
        },
        {
          model: sequelizeServer.models.visits,
          as: "visits",
          attributes: ["visit_id"],
        },
      ],
      offset: paginationConfig?.offset,
      limit: paginationConfig?.limit,
      where: {
        ...filters?.ticket_date,
        is_valid: true,
      },
      order: filters?.ticket_sort ? [[filters?.ticket_sort]] : [],
      distinct: "ticket_id",
    });
    return result;
  } catch (error) {
    return error;
  }
}
// async function filterTicket(user, filters) {
//   if (user?.user_type?.toLowerCase() == "field engineer") {
//     var result = await sequelizeServer.models.tickets.findAndCountAll({
//       include: [
//         {
//           model: sequelizeServer.models.projects,
//           as: "project",
//           include: ["project_managers", "users"],
//         },
//         "site",
//       ],
//       limit: filters.limit,
//       offset: filters.offset,

//       where: {
//         ticket_id: {
//           [Op.iLike]: `%${filters?.input?.toString()}%`,
//         },
//       },
//     });
//     return result?.filter((ticket) =>
//       ticket?.project?.users?.find((userr) => userr.user_id == user.user_id)
//     );
//   } else if (user?.user_type?.toLowerCase() == "project manager") {
//     var result = await sequelizeServer.models.tickets.findAndCountAll({
//       include: [
//         {
//           model: sequelizeServer.models.projects,
//           as: "project",
//           include: ["project_managers", "users"],
//         },
//         "site",
//       ],
//       limit: filters.limit,
//       offset: filters.offset,

//       where: {
//         ticket_id: {
//           [Op.iLike]: `%${filters?.input?.toString()}%`,
//         },
//       },
//     });
//     return result?.filter((ticket) =>
//       ticket?.project?.project_managers?.find(
//         (userr) => userr?.user_id == user?.user_id
//       )
//     );
//   } else {
//     var result = await sequelizeServer.models.tickets.findAndCountAll({
//       include: [
//         {
//           model: sequelizeServer.models.projects,
//           as: "project",
//           include: ["project_managers", "users"],
//         },
//         "site",
//       ],
//       limit: filters.limit,
//       offset: filters.offset,

//       where: { ticket_id: filters?.input },
//     });
//     return result;
//   }
// }

async function getTicketForRole(user) {
  var tickets = [];

  switch (user?.user_type?.toLowerCase()) {
    case "field engineer":
      tickets = await getTicketsForFE(user);
      break;

    case "project manager":
      tickets = await getTicketsForPM(user);
      break;
  }
  return tickets;
}

async function filterTicket(user, body) {
  var tickets = [];
  const paginationConfig = { limit: body?.limit, offset: body?.offset };
  let filters = await getAdvanceFilters(body?.advanceFilter, body?.sort, user);
  switch (user?.user_type?.toLowerCase()) {
    case "field engineer":
      projects = await getFilterTicketsForFE(filters, paginationConfig, user);
      break;
    case "admin":
      tickets = await getFilterTicketsForAdmin(filters, paginationConfig, user);
      break;
    case "project manager":
      tickets = await getFilterTicketsForPM(filters, paginationConfig, user);
      break;
    default:
      tickets = await getFilterTicketsForAdmin(filters, paginationConfig, user);
  }
  return tickets;
}
async function getAdvanceFilters(advanceFilter, sort, user) {
  let ticket_date = {};
  let site_id = {};
  let project_name = {};
  let ticket_sort = null;
  let ticket_date_sort = null;
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
      case "site_id":
        if (advanceFilter.value) {
          site_id = {
            id: {
              [Op.iLike]: `%${advanceFilter.value}%`,
            },
          };
        }
        break;

      case "ticket_date":
        if (advanceFilter.value) {
          ticket_date = {
            ticket_date: Sequelize.where(
              Sequelize.fn("date", Sequelize.col("ticket_date")),
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
      case "ticket_id":
        if (sort?.sort) {
          ticket_sort = ["ticket_id", sort?.sort?.toUpperCase()];
        }
        break;
      case "ticket_date":
        if (sort?.sort) {
          ticket_sort = ["ticket_date", sort?.sort?.toUpperCase()];
        }
        break;
    }
  }
  return {
    ticket_date,
    site_id,
    project_name,
    ticket_sort,
    user_id,
    ticket_date_sort,
    is_valid,
  };
}

async function getProjectFEsByTicket(ticket_id) {
  const users = await sequelizeServer.models.users.findAll({
    include: [
      {
        model: sequelizeServer.models.projects,
        through: "projects_users",
        as: "projects",
        include: {
          model: sequelizeServer.models.tickets,
          as: "tickets",
        },
      },
    ],
  });

  const les = users?.find((x) => x.user_id == 103);
  return les;
}

module.exports = {
  InsertTicket,
  EditTicket,
  GetTickets,
  GetTicketById,
  RemoveTicket,
  ticketPagination,
  filterTicket,
  ticketCheck,
  getTicketForRole,
  getProjectFEsByTicket,
  undoDeleteTicket,
  getAdvanceFilters,
  getFilterTicketsForFE,
  getFilterTicketsForAdmin,
  getFilterTicketsForPM,
};
