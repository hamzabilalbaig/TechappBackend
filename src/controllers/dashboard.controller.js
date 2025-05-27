const {
  getActiveVisitCount,
  getSitesCount,
  getProjectsCount,
  getTicketsCount,
  getIssuesCount,
  getVisitsScheduleDates,
  getVisitFinancials,
  getInterruptionCount,
  getApprovedInterruptionCount,
  generalizeSearch,
  getInterruptionCountByVisitId,
  getApprovedInterruptionCountByVisitId,
} = require("../services/dashboard.service");
const { responseFormat } = require("../utils/utils");

async function countActiveVisits(req, res, next) {
  try {
    const result = await getActiveVisitCount(req.user, req.body);
    res.json(responseFormat(true, result, "visit count"));
  } catch (error) {
    res.json(responseFormat(false, error, "error while getting count"));
    next(error);
  }
}
async function getVisitsFinancialDashboard(req, res, next) {
  try {
    const result = await getVisitFinancials(req?.user, req?.body);

    res.json(responseFormat(true, result, "list of visits"));
  } catch (error) {
    res
      .status(500)
      .json(
        responseFormat(false, error, "Unexpected error while getting the list")
      );
    next(error);
  }
}
async function visitsSchedule(req, res, next) {
  try {
    const result = await getVisitsScheduleDates(req.user, req.body);
    res.json(responseFormat(true, result, "visit "));
  } catch (error) {
    res.json(responseFormat(false, error, "error while getting "));
    next(error);
  }
}
async function countSites(req, res, next) {
  try {
    const result = await getSitesCount();
    res.json(responseFormat(true, result, "site count"));
  } catch (error) {
    res.json(responseFormat(false, error, "error while getting count"));
    next(error);
  }
}

async function countProjects(req, res, next) {
  try {
    const result = await getProjectsCount(req.user);
    res.json(responseFormat(true, result, "project count"));
  } catch (error) {
    res.json(responseFormat(false, error, "error while getting count"));
    next(error);
  }
}

async function countTickets(req, res, next) {
  try {
    const result = await getTicketsCount();
    res.json(responseFormat(true, result, "ticket count"));
  } catch (error) {
    res.json(responseFormat(false, error, "error while getting count"));
    next(error);
  }
}

async function countIssues(req, res, next) {
  try {
    const result = await getIssuesCount();
    res.json(responseFormat(true, result, "issue count"));
  } catch (error) {
    res.json(responseFormat(false, error, "error while getting count"));
    next(error);
  }
}

async function countInterruptions(req, res, next) {
  try {
    let result = [];
    result = await getInterruptionCount(req.user);
    res.json(responseFormat(true, result.length, "issue count"));
  } catch (error) {
    res.json(responseFormat(false, error, "error while getting count"));
    next(error);
  }
}
async function countApprovedInterruptions(req, res, next) {
  try {
    let result = [];
    result = await getApprovedInterruptionCount(req.user);
    res.json(responseFormat(true, result.length, "issue count"));
  } catch (error) {
    res.json(responseFormat(false, error, "error while getting count"));
    next(error);
  }
}

async function generalizeSearchAll(req, res, next) {
  try {
    const result = await generalizeSearch(req.body?.params, req?.user);
    res.json(responseFormat(true, result, "list of all object"));
  } catch (error) {
    res
      .status(500)
      .json(
        responseFormat(false, error, "Unexpected error while getting the list")
      );
    next(error);
  }
}
async function countInterruptionsByVisitId(req, res, next) {
  try {
    let result = [];
    result = await getInterruptionCountByVisitId(req.user, req.params.id);
    res.json(responseFormat(true, result.length, "issue count"));
  } catch (error) {
    res.json(responseFormat(false, error, "error while getting count"));
    next(error);
  }
}
async function countApprovedInterruptionsByVisitId(req, res, next) {
  try {
    let result = [];
    result = await getApprovedInterruptionCountByVisitId(
      req.user,
      req.params.id
    );
    res.json(responseFormat(true, result.length, "issue count"));
  } catch (error) {
    res.json(responseFormat(false, error, "error while getting count"));
    next(error);
  }
}
module.exports = {
  countActiveVisits,
  countSites,
  countProjects,
  countTickets,
  countIssues,
  visitsSchedule,
  getVisitsFinancialDashboard,
  countInterruptions,
  countApprovedInterruptions,
  generalizeSearchAll,
  countInterruptionsByVisitId,
  countApprovedInterruptionsByVisitId,
};
