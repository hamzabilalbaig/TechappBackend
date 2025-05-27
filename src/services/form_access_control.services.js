const { sequelizeServer } = require("../configs/sequelize.config");
const sequelize = require("sequelize");
const _ = require("lodash");
async function getAllForms() {
  try {
    const result = await sequelizeServer.models.forms.findAll();
    return result;
  } catch (error) {
    return error;
  }
}

async function getAllFields(form_name, role_id) {
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
    const result = await sequelizeServer.models.form_fields.findAll({
      where: { form_id: form?.form_id },
      include: [
        {
          model: sequelizeServer.models.form_field_role_permission,
          as: "form_field_role_permission",
          where: { role_id },
        },
      ],
    });

    return result;
  }
  return [];
}

async function getAllFieldsWithPermissions(form_name, role_id) {
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
    const result = await sequelizeServer.models.form_fields.findAll({
      where: { form_id: form?.form_id },
      include: [
        {
          model: sequelizeServer.models.form_field_role_permission,
          as: "form_field_role_permission",
          where: { role_id },
        },
      ],
    });

    if (result?.length > 0) {
      const config = result?.reduce((acc, cur) => {
        acc[cur?.field_name] = cur;
        return acc;
      }, {});
      return config;
    }
  }
  return [];
}

async function editFormField(field_id, data) {
  try {
    const result = await sequelizeServer.models.form_fields.update(data, {
      where: { field_id: field_id },
    });
    return result;
  } catch (error) {
    return error;
  }
}

async function getFieldPermissionsByRoleID(body) {
  try {
    const result =
      await sequelizeServer.models.form_field_role_permission.findAll({
        where: { form_id: body?.form_id, role_id: body?.role_id },
      });
    return result;
  } catch (error) {
    return error;
  }
}

async function addFieldsByFormID(body) {
  try {
    await addFielsAndPermissions(body);
    // const attributes = sequelizeServer.models[body.model].getAttributes();
    // const fields = [];
    // _.forIn(attributes, function name(value, key) {
    //   fields.push({
    //     form_id: body.form_id,
    //     field_name: key,
    //     field_label: key,
    //     is_valid: true,
    //     data_type: value?.type?.key,
    //   });
    // });

    // console.log(fields);
    // const result = await sequelizeServer.models.form_fields.bulkCreate(fields);

    // return result;
  } catch (error) {
    return error;
  }
}

async function addField(body) {
  const result = await sequelizeServer.models.form_fields.create(body);
  return result;
}

async function addFielsAndPermissions(body) {
  const attributes = await sequelizeServer.models[body.model].getAttributes();
  for (const attr in attributes) {
    if (attributes.hasOwnProperty(attr)) {
      const attribute = attributes[attr];
      const field = await sequelizeServer.models.form_fields.findAll({
        where: { form_id: body.form_id, field_name: attribute?.field },
      });

      console.log(attribute);
      if (field?.length === 0) {
        const savedField = await sequelizeServer.models.form_fields.create({
          form_id: body.form_id,
          field_name: attribute?.field,
          field_label: attribute?.field,
          is_valid: true,
          data_type: attribute?.type?.key,
        });

        console.log(savedField);
      }
    }
  }
}

async function setUpSingleFieldPermissionsForAllRole(body) {
  const roles = await sequelizeServer.models.roles.findAll();
  const data = roles.map(async (role) => {
    const result =
      await sequelizeServer.models.form_field_role_permission.create({
        role_id: role?.role_id,
        field_id: body?.field_id,
        form_id: body.form_id,
        is_visible: true,
        is_editable: true,
        is_required: true,
      });
    return result;
  });
  return data;
}

async function setUpFieldPermissionsForAllRole(body) {
  try {
    const field_ids = await sequelizeServer.models[body.model].findAll({
      where: { form_id: body.form_id },
    });
    const roles = await sequelizeServer.models.roles.findAll();
    const data = roles.map(async (role) => {
      const result =
        await sequelizeServer.models.form_field_role_permission.bulkCreate(
          field_ids.map((data) => {
            return {
              role_id: role?.role_id,
              field_id: data?.field_id,
              form_id: body.form_id,
              is_visible: true,
              is_editable: true,
              is_required: true,
            };
          })
        );
      return result;
    });

    return data;
  } catch (error) {
    return error;
  }
}
async function updateFieldPermissions(body) {
  try {
    const per = {
      modify: body?.permission === "Modify" ? true : false,
      viewOnly: body?.permission === "View Only" ? true : false,
      hidden: body?.permission === "Hidden" ? false : true,
    };
    await sequelizeServer.models.form_field_role_permission.update(
      {
        is_visible: per.hidden,
        is_editable: per.modify ?? per.viewOnly,
        is_required: per.modify ?? per.viewOnly,
      },
      {
        where: { id: body.id },
      }
    );
    return true;
  } catch (error) {
    return error;
  }
}
module.exports = {
  getAllForms,
  getAllFields,
  getFieldPermissionsByRoleID,
  addFieldsByFormID,
  setUpSingleFieldPermissionsForAllRole,
  addField,
  setUpFieldPermissionsForAllRole,
  updateFieldPermissions,
  editFormField,
  getAllFieldsWithPermissions
};
