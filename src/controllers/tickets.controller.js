const {
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
} = require("../services/tickets.services");
const { responseFormat } = require("../utils/utils");

async function CheckTicket(req, res, next) {
  await ticketCheck(req.params.site_id, req.params.project_id)
    .then((result) => {
      res.json(
        responseFormat(
          true,
          result,
          result ? "Tickets Already Exists" : "Ticket does not exists"
        )
      );
    })
    .catch((ex) => {
      res
        .status(500)
        .json(
          responseFormat(
            false,
            ex,
            "Unexpected error while Deleting the Tickets"
          )
        );
      next(ex);
    });
}

async function AddNewTicket(req, res, next) {
  try {
    const result = await InsertTicket(req.body);
    res.json(
      responseFormat(
        true,
        result,
        result === "ap"
          ? "A ticket is already available on this site."
          : "Tickets Added Successfully"
      )
    );
  } catch (error) {
    res
      .status(500)
      .json(
        responseFormat(false, ex, "Unexpected error while Adding the Tickets")
      );
    next(ex);
  }
}

async function DeleteTicket(req, res, next) {
  RemoveTicket(req.params.id)
    .then((result) => {
      res.json(responseFormat(true, result, "Tickets Deleted Successfully"));
    })
    .catch((ex) => {
      console.log("dedjweksd", ex);
      res
        .status(500)
        .json(
          responseFormat(
            false,
            ex,
            "Unexpected error while Deleting the Tickets"
          )
        );
      next(ex);
    });
}

async function UndoDeleteTicket(req, res, next) {
  undoDeleteTicket(req.params.id)
    .then((result) => {
      res.json(responseFormat(true, result, "Tickets Restored Successfully"));
    })
    .catch((ex) => {
      res
        .status(500)
        .json(
          responseFormat(
            false,
            ex,
            "Unexpected error while Restoring the Tickets"
          )
        );
      next(ex);
    });
}

async function UpdateTicket(req, res, next) {
  try {
    const result = await EditTicket(req.body, req.params.id);
    if (result == 0) {
      res.json(
        responseFormat(false, result, "Tickets not Updated Successfully")
      );
    } else {
      res.json(responseFormat(true, result, "Tickets Updated Successfully"));
    }
  } catch (error) {
    res
      .status(500)
      .json(
        responseFormat(
          false,
          error,
          "Unexpected error While Updating the Tickets"
        )
      );

    next(error);
  }
}

async function GetAllTickets(req, res, next) {
  try {
    const result = await GetTickets(req.user);
    res.json(responseFormat(true, result, "All Tickets"));
  } catch (error) {
    res.json(
      responseFormat(true, error, "Unexpected error While Getting All Tickets")
    );
  }
}

async function GetTicketTicketID(req, res, next) {
  try {
    const result = await GetTicketById(req.params.ticket_id, req.user);
    res.json(responseFormat(true, result, "Ticket Fetched"));
  } catch (error) {
    res.json(
      responseFormat(false, error, "Unexpected error While Getting Tickets")
    );
    next(error);
  }
}
async function GetTicketByPaging(req, res, next) {
  try {
    const result = await ticketPagination(req.user, req.body?.params);

    res.json(responseFormat(true, result, "list of all tickets"));
  } catch (error) {
    res
      .status(500)
      .json(
        responseFormat(false, error, "Unexpected error while getting the list")
      );
    next(error);
  }
}

async function FilterTickets(req, res, next) {
  try {
    const result = await filterTicket(req.user, req.body?.params);
    res.json(responseFormat(true, result, "list of all tickets"));
  } catch (error) {
    res
      .status(500)
      .json(
        responseFormat(false, error, "Unexpected error while getting the list")
      );
    next(error);
  }
}

async function getTicketsForRole(req, res, next) {
  try {
    const result = await getTicketForRole(req.body.user);
    res.json(responseFormat(true, result, "list of all tickets"));
  } catch (error) {
    res
      .status(500)
      .json(
        responseFormat(false, error, "Unexpected error while getting the list")
      );
    next(error);
  }
}

async function GetProjectFEsByTicketID(req, res, next) {
  await getProjectFEsByTicket(req.params.id)
    .then((result) => {
      res.json(responseFormat(true, result, "Project FEs"));
    })
    .catch((ex) => {
      res
        .status(500)
        .json(responseFormat(false, ex, "Unexpected error while Getting FEs"));
      next(ex);
    });
}
module.exports = {
  AddNewTicket,
  DeleteTicket,
  UpdateTicket,
  GetAllTickets,
  GetTicketTicketID,
  GetTicketByPaging,
  FilterTickets,
  CheckTicket,
  getTicketsForRole,
  GetProjectFEsByTicketID,
  UndoDeleteTicket,
};
