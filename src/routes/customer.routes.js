var express = require("express");
const customerController = require("../controllers/customer.controller");
var router = express.Router();
const auth = require("../middlewares/auth");

router.get("/customers", auth, customerController.getAllCustomers);
router.get("/customerUsers", auth, customerController.getAllCustomerUsers);
router.get("/customers/:id", auth, customerController.getCustomerByCustomerID);
router.post("/customers", auth, customerController.createCustomer);
router.put("/customers/:id", auth, customerController.updateCustomer);
router.delete("/customers/:id", auth, customerController.deleteCustomer);
router.put("/undoCustomers/:id", auth, customerController.undoDeleteCustomer);


module.exports = router;
