var express = require("express");
const ticketsController = require("../controllers/tickets.controller");
var router = express.Router();
const auth = require("../middlewares/auth");

router.post("/tickets/Add", auth, ticketsController.AddNewTicket);
router.delete("/tickets/Delete/:id", auth, ticketsController.DeleteTicket);
router.post("/tickets/UndoDelete/:id", auth, ticketsController.UndoDeleteTicket);

router.get("/tickets", auth, ticketsController.GetAllTickets);
router.put("/tickets/Add/:id", auth, ticketsController.UpdateTicket);
router.get("/tickets/:ticket_id", auth, ticketsController.GetTicketTicketID);
router.post(
  "/tickets/getTicketByPaging",
  auth,
  ticketsController.GetTicketByPaging
);
router.post("/tickets/filterTickets", auth, ticketsController.FilterTickets);
router.get(
  "/tickets/CheckTicket/:site_id/:project_id",
  auth,
  ticketsController.CheckTicket
);
router.post(
  "/tickets/getTicketForRole",
  auth,
  ticketsController.getTicketsForRole
);

router.get(
  "/tickets/GetProjectFEsByTicketID/:id",
  auth,
  ticketsController.GetProjectFEsByTicketID
);

module.exports = router;
