const { sequelizeServer } = require("../configs/sequelize.config");

async function getCustomers() {
  try {
    var result = await sequelizeServer.models.customers.findAll();
    return result;
  } catch (error) {
    console.log(error);
    return error;
  }
}

async function getCustomerUsers() {
  var result = await sequelizeServer.models.users.findAll({
    include: [
      {
        model: sequelizeServer.models.roles,
        as: "role",
        where: { role_id: 15 },
      },
    ],
    where: { is_active: true },
  });
  return result;
}

async function getCustomerById(id) {
  try {
    var result = await sequelizeServer.models.customers.findOne({
      where: { customer_id: id, is_active: true },
    });
    return result;
  } catch (error) {
    console.log(error);
    return error;
  }
}

async function insertCustomer(customer) {
  try {
    var result = await sequelizeServer.models.customers.create(customer);
    return result;
  } catch (error) {
    console.log(error);
    return error;
  }
}

async function editCustomer(customer, customer_id) {
  try {
    var result = await sequelizeServer.models.customers.update(customer, {
      where: { customer_id: customer_id },
    });
    return result;
  } catch (error) {
    console.log(error);
    return error;
  }
}

async function deactivateCustomer(customer_id) {
  try {
    var result = await sequelizeServer.models.customers.update(
      { is_active: false },
      {
        where: { customer_id: customer_id },
      }
    );
    return result;
  } catch (error) {
    console.log(error);
    return error;
  }
}

async function activateCustomer(customer_id) {
  try {
    var result = await sequelizeServer.models.customers.update(
      { is_active: true },
      {
        where: { customer_id: customer_id },
      }
    );
    return result;
  } catch (error) {
    console.log(error);
    return error;
  }
}

module.exports = {
  getCustomers,
  getCustomerUsers,
  insertCustomer,
  editCustomer,
  deactivateCustomer,
  getCustomerById,
  activateCustomer
};
