const { sequelizeServer } = require("../configs/sequelize.config");

const fs = require("fs");
const { getFileExtension } = require("../utils/utils");

async function GetAllIssues(user) {
  try {
    if (user?.user_type?.toLowerCase() == "field engineer") {
      const issues = sequelizeServer.models.issues.findAll({
        where: { user_id: user.user_id },
        include: ["site", "user", "visit"],
      });
      return issues;
    } else {
      const issues = sequelizeServer.models.issues.findAll({
        include: ["site", "user", "visit"],
      });
      return issues;
    }
  } catch (err) {
    console.log(err);
  }
}

async function AddIssue(issue) {
  try {
    const issues = sequelizeServer.models.issues.create(issue);
    return issues;
  } catch (err) {
    console.log(err);
  }
}

async function UpdateIssue(issue, id) {
  try {
    const issues = sequelizeServer.models.issues.update(issue, {
      where: { issue_id: id },
    });
    return issues;
  } catch (err) {
    console.log(err);
    return err;
  }
}

async function DeleteIssue(id) {
  try {
    const issues = sequelizeServer.models.issues.destroy({
      where: { issue_id: id },
    });
    return issues;
  } catch (err) {
    console.log(err);
  }
}

module.exports = { GetAllIssues, AddIssue, UpdateIssue, DeleteIssue };
