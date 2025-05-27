const { sequelizeServer } = require("../configs/sequelize.config");

const fs = require("fs");
const { getFileExtension } = require("../utils/utils");
const { Op, Sequelize } = require("sequelize");

const csvParser = require("csv-parser");
async function GetAllInterruptionsForTable(user) {
  try {
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

    // }
  } catch (err) {
    console.log(err);
  }
}

async function SerarchByIntCode(code, user) {
  try {
    //  {
    //   const Interruptions = sequelizeServer.models.Interruptions.findAll({
    //     where: {
    //       interruption_code: {
    //         [Op.iLike]: `%${code}%`,
    //       },
    //     },
    //   });
    //   return Interruptions;
    // }

    if (user?.user_type?.toLowerCase() == "admin") {
      const Interruptions = sequelizeServer.models.Interruptions.findAll({
        where: {
          interruption_code: {
            [Op.iLike]: `%${code}%`,
          },
        },
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
          interruption_code: {
            [Op.iLike]: `%${code}%`,
          },
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
          interruption_code: {
            [Op.iLike]: `%${code}%`,
          },
        },
      });

      return Interruptions;
    }

    // }
  } catch (err) {
    console.log(err);
  }
}

async function filterInterruptions(filter, user) {
  try {
    const filterOptions = {
      where: {},
    };

    // Apply the code filter
    if (!filter?.sort) {
      filterOptions.order = [["created_on", "ASC"]];
    } else {
      filterOptions.order = [["created_on", "DESC"]];
    }

    // Apply the owner filter
    if (filter?.owner) {
      filterOptions.where.owner = {
        [Op.iLike]: `%${filter?.owner}%`,
      };
    }
    if (filter?.code) {
      filterOptions.where.interruption_code = {
        [Op.iLike]: `%${filter?.code}%`,
      };
    }

    // Apply the type filter
    if (filter?.type) {
      filterOptions.where.type = {
        [Op.iLike]: `%${filter?.type}%`,
      };
    }

    // Apply the severity filter
    if (filter?.severity) {
      filterOptions.where.severity = {
        [Op.iLike]: `%${filter?.severity}%`,
      };
    }

    // Apply the status filter
    if (filter?.status) {
      filterOptions.where.status = {
        [Op.iLike]: `%${filter?.status}%`,
      };
    }

    // const Interruptions = await sequelizeServer.models.Interruptions.findAll(
    //   filterOptions
    // );
    // return Interruptions;
    if (user?.user_type?.toLowerCase() == "admin") {
      filterOptions.include = [
        "approved_by_user",
        "created_by_user",
        "modified_by_user",
        "resolved_by_user",
      ];
      const Interruptions =
        sequelizeServer.models.Interruptions.findAll(filterOptions);
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
      filterOptions.where.is_valid = true;
      filterOptions.where.visit_id = {
        [sequelizeServer.Sequelize.Op.in]: visits,
      };
      filterOptions.include = [
        "approved_by_user",
        "created_by_user",
        "modified_by_user",
        "resolved_by_user",
      ];
      const Interruptions =
        sequelizeServer.models.Interruptions.findAll(filterOptions);

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

      filterOptions.include = [
        "approved_by_user",
        "created_by_user",
        "modified_by_user",
        "resolved_by_user",
      ];
      filterOptions.where.is_valid = true;
      filterOptions.where.visit_id = {
        [sequelizeServer.Sequelize.Op.in]: visits,
      };
      const Interruptions =
        sequelizeServer.models.Interruptions.findAll(filterOptions);

      return Interruptions;
    }
  } catch (err) {
    console.log(err);
  }
}

async function GetAllInterruptions(visit_id, user) {
  try {
    if (user?.user_type?.toLowerCase() == "admin") {
      const Interruptions = sequelizeServer.models.Interruptions.findAll({
        where: {
          visit_id,
        },
        include: [
          "approved_by_user",
          "created_by_user",
          "modified_by_user",
          "resolved_by_user",
        ],
      });
      return Interruptions;
    } else {
      const Interruptions = sequelizeServer.models.Interruptions.findAll({
        where: {
          visit_id,
          is_valid: true,
        },
        include: [
          "approved_by_user",
          "created_by_user",
          "modified_by_user",
          "resolved_by_user",
        ],
      });
      return Interruptions;
    }
  } catch (err) {
    console.log(err);
  }
}

async function GetInterruptionsById(id) {
  try {
    const Interruptions = sequelizeServer.models.Interruptions.findOne({
      where: { id, is_valid: true },
      include: [
        "approved_by_user",
        "created_by_user",
        "modified_by_user",
        "resolved_by_user",
      ],
    });
    return Interruptions;
  } catch (err) {
    console.log(err);
  }
}

async function AddInterruption(Interruption, user) {
  try {
    const visit = await sequelizeServer.models.visits.findOne({
      where: { visit_id: Interruption.visit_id },
    });
    let username = user?.first_name + " " + user?.last_name;
    const dateObj = new Date(Interruption?.dateUser);
    const month = dateObj.getMonth() + 1; // Months are zero-indexed, so add 1
    const day = dateObj.getDate();
    const year = dateObj.getFullYear();
    const hours = dateObj.getHours().toString().padStart(2, "0"); // Pad hours with leading zero if necessary
    const minutes = dateObj.getMinutes().toString().padStart(2, "0");
    const date = `${month}/${day}/${year} ${hours}:${minutes}`;
    notes = Interruption.notes;
    delete Interruption.notes;
    const obj = Object.assign(Interruption, { visit_code: visit.visit_code });
    const Interruptions = await sequelizeServer.models.Interruptions.create(
      obj
    );
    const interruption_code = visit.visit_code + "_" + Interruptions.id;

    if (notes || notes === "") {
      const result = await sequelizeServer.models.Interruptions.update(
        {
          interruption_code: interruption_code,
          notes: `${username}-${date}: ${notes} \n`,
        },
        { where: { id: Interruptions.id } }
      );
      return result;
    } else {
      const result = await sequelizeServer.models.Interruptions.update(
        {
          interruption_code: interruption_code,
        },
        { where: { id: Interruptions.id } }
      );
      return result;
    }
  } catch (err) {
    console.log(err);
  }
}

async function UpdateInterruption(Interruption, id, user) {
  try {
    let username = user?.first_name + " " + user?.last_name;

    const dateObj = new Date(Interruption?.dateUser);

    const month = dateObj.getMonth() + 1; // Months are zero-indexed, so add 1
    const day = dateObj.getDate();
    const year = dateObj.getFullYear();
    const hours = dateObj.getHours().toString().padStart(2, "0"); // Pad hours with leading zero if necessary
    const minutes = dateObj.getMinutes().toString().padStart(2, "0");

    const date = `${month}/${day}/${year} ${hours}:${minutes}`;
    if (Interruption?.notes2 || Interruption?.notes2 === "") {
      notes = Interruption.notes;
      delete Interruption.notes;

      const Interruptions = sequelizeServer.models.Interruptions.update(
        Interruption,
        {
          where: { id: id },
        }
      );

      sequelizeServer.models.Interruptions.update(
        {
          notes: Sequelize.literal(
            `CONCAT(notes, '${username}-${date}: ${Interruption?.notes2} \n')`
          ),
        },
        {
          where: { id: id },
        }
      )
        .then(() => {
          console.log("Interruption updated successfully.");
        })
        .catch((error) => {
          console.error("Error updating interruption:", error);
        });
      return Interruptions;
    } else {
      const Interruptions = sequelizeServer.models.Interruptions.update(
        Interruption,
        {
          where: { id: id },
        }
      );
      // if (notes || notes === "") {
      //   sequelizeServer.models.Interruptions.update(
      //     {
      //       notes: Sequelize.literal(
      //         `CONCAT(notes, '${username}-${date}: ${notes} \n')`
      //       ),
      //     },
      //     {
      //       where: { id: id },
      //     }
      //   )
      //     .then(() => {
      //       console.log("Interruption updated successfully.");
      //     })
      //     .catch((error) => {
      //       console.error("Error updating interruption:", error);
      //     });
      // }

      return Interruptions;
    }
  } catch (err) {
    console.log(err);
    return err;
  }
}

async function DeleteInterruption(id) {
  try {
    const interrupt = await sequelizeServer.models.Interruptions.findOne({
      where: { id },
    });
    if (interrupt?.is_valid === true) {
      const Interruptions = sequelizeServer.models.Interruptions.update(
        { is_valid: false },
        {
          where: { id },
        }
      );
      return "Interruption Deleted Successfully";
    } else {
      const Interruptions = sequelizeServer.models.Interruptions.update(
        { is_valid: true },
        {
          where: { id },
        }
      );
      return "Interruption Restored Successfully";
    }
  } catch (err) {
    console.log(err);
  }
}

async function getUnresolvedCount(id) {
  try {
    const Interruptions = sequelizeServer.models.Interruptions.count({
      where: {
        status: {
          [Op.notILike]: "Resolved",
        },
        visit_id: id,
        is_valid: true,
      },
    });
    return Interruptions;
  } catch (err) {
    console.log(err);
  }
}

async function restore(id) {
  try {
    const Interruptions = sequelizeServer.models.Interruptions.update(
      { is_valid: true },
      {
        where: {
          id,
        },
      }
    );
    return Interruptions;
  } catch (err) {
    console.log(err);
  }
}

async function csvImport(csvData) {
  try {
    return new Promise((resolve, reject) => {
      const records = [];
      const parser = csvParser({ headers: true })
        .on("data", (data) => {
          records.push(data);
        })
        .on("end", async () => {
          const keys = Object.values(records[0]);
          const result = records.slice(1).map((obj) => {
            return Object.fromEntries(
              Object.entries(obj).map(([key, value], index) => {
                return [keys[index], value];
              })
            );
          });
          const Interruptions =
            await sequelizeServer.models.Interruptions.bulkCreate(result);
          resolve(Interruptions);
        })
        .on("error", (error) => {
          reject(error);
        });

      parser.write(csvData);
      parser.end();
    });
  } catch (err) {
    console.log(err);
  }
}

module.exports = {
  GetAllInterruptions,
  AddInterruption,
  UpdateInterruption,
  DeleteInterruption,
  GetInterruptionsById,
  GetAllInterruptionsForTable,
  SerarchByIntCode,
  getUnresolvedCount,
  restore,
  csvImport,
  filterInterruptions,
};
