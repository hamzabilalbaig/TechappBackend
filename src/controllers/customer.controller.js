const {
  insertCustomer,
  getCustomers,
  editCustomer,
  deactivateCustomer,
  getCustomerById,
  getCustomerUsers,
  activateCustomer,
} = require("../services/customer.service");
const { responseFormat } = require("../utils/utils");

async function getAllCustomers(req, res, next) {
  try {
    const result = await getCustomers();
    res.json(
      responseFormat(true, result, "SuccessFully Received All Customer")
    );
  } catch (error) {
    res.json(
      responseFormat(false, error, "Unexpected error while getting Customers")
    );
    next(error);
  }
}

async function getAllCustomerUsers(req, res, next) {
  await getCustomerUsers()
    .then((result) => {
      res.json(
        responseFormat(true, result, "SuccessFully Received All Customer")
      );
    })
    .catch((error) => {
      res.json(
        responseFormat(false, error, "Unexpected error while getting Customers")
      );
      next(error);
    });
}

async function getCustomerByCustomerID(req, res, next) {
  try {
    const result = await getCustomerById(req?.params?.id);
    res.json(
      responseFormat(true, result, "SuccessFully Received the Customer")
    );
  } catch (error) {
    res.json(
      responseFormat(false, error, "Unexpected error while getting Customer")
    );
    next(error);
  }
}

async function createCustomer(req, res, next) {
  try {
    const result = await insertCustomer(req.body);
    res.json(responseFormat(true, result, "Customer Added SuccessFully"));
  } catch (error) {
    res
      .status(500)
      .json(
        responseFormat(
          false,
          error,
          "Unexpected error while Adding The customer"
        )
      );
    next(error);
  }
}

async function updateCustomer(req, res, next) {
  try {
    const result = await editCustomer(req.body, req.params.id);
    res.json(responseFormat(true, result, "Customer updated SuccessFully"));
  } catch (error) {
    res
      .status(500)
      .json(
        responseFormat(
          false,
          error,
          "Unexpected error while Updating the Customer"
        )
      );
    next(error);
  }
}

async function deleteCustomer(req, res, next) {
  try {
    const result = await deactivateCustomer(req.params.id);
    res.json(responseFormat(true, result, "Customer deleted SuccessFully"));
  } catch (error) {
    res
      .status(500)
      .json(
        responseFormat(
          false,
          error,
          "Unexpected error while Deleting the Customer"
        )
      );
    next(error);
  }
}
async function undoDeleteCustomer(req, res, next) {
  try {
    const result = await activateCustomer(req.params.id);
    res.json(responseFormat(true, result, "Customer restored SuccessFully"));
  } catch (error) {
    res
      .status(500)
      .json(
        responseFormat(
          false,
          error,
          "Unexpected error while Restoring the Customer"
        )
      );
    next(error);
  }
}

module.exports = {
  getAllCustomers,
  createCustomer,
  updateCustomer,
  deleteCustomer,
  getCustomerByCustomerID,
  getAllCustomerUsers,
  undoDeleteCustomer
};
