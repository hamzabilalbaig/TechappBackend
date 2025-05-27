const {
  GetSites,
  AddSite,
  UpdateSite,
  DeleteSite,
  GetSiteBySiteID,
  getSitesForDropdown,
  checkSiteId,
  filterSites,
  sitePagination,
  getSitesByVisits,
  getSitesForDropdownFilter,
  checkSites,
} = require("../services/sites.services");
const { responseFormat } = require("../utils/utils");

async function allSites(req, res, next) {
  try {
    const result = await GetSites();
    res.json(responseFormat(true, result, "list of all sites"));
  } catch (error) {
    res
      .status(500)
      .json(
        responseFormat(false, error, "Unexpected error while getting the list")
      );
    next(error);
  }
}

async function SiteCheck(req, res, next) {
  await checkSites(req.body)
    .then((result) => {
      res.json(responseFormat(true, result, "sites"));
    })
    .catch((ex) => {
      res
        .status(500)
        .json(
          responseFormat(false, ex, "Unexpected error while getting sites")
        );
      next(ex);
    });
}

async function allSitesByVisits(req, res, next) {
  try {
    const result = await getSitesByVisits(req.user);
    res.json(responseFormat(true, result, "list of all sites"));
  } catch (error) {
    res
      .status(500)
      .json(responseFormat(false, error, "error while getting the list"));
    next(error);
  }
}

async function allSitesForSiteDropdownFilter(req, res, next) {
  try {
    const result = await getSitesForDropdownFilter(req.body?.params);
    res.json(responseFormat(true, result, "list of sites"));
  } catch (error) {
    res
      .status(500)
      .json(responseFormat(false, error, "error while getting the list"));
    next(error);
  }
}

async function getSiteByPaging(req, res, next) {
  try {
    const result = await sitePagination(req.body?.params);

    res.json(responseFormat(true, result, "list of sites"));
  } catch (error) {
    res
      .status(500)
      .json(
        responseFormat(false, error, "Unexpected error while getting the list")
      );
    next(error);
  }
}

async function FilterSites(req, res, next) {
  try {
    const result = await filterSites(req.body?.params);
    res.json(responseFormat(true, result, "list of all sites"));
  } catch (error) {
    res
      .status(500)
      .json(
        responseFormat(false, error, "Unexpected error while getting the list")
      );
    next(error);
  }
}

async function checkSiteIdValidation(req, res, next) {
  try {
    const result = await checkSiteId(req.params.id);
    res.json(responseFormat(true, result, "site"));
  } catch (error) {
    res.status(500).json(responseFormat(false, error, "error"));
    next(error);
  }
}

async function allSitesforDropdown(req, res, next) {
  try {
    const result = await getSitesForDropdown();
    res.json(responseFormat(true, result, "list of all sites"));
  } catch (error) {
    res
      .status(500)
      .json(
        responseFormat(false, error, "Unexpected error while getting the list")
      );
    next(error);
  }
}

async function addNewSite(req, res, next) {
  try {
    const result = await AddSite(req.body);
    res.json(responseFormat(true, result, "Site Added SuccessFully"));
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json(
        responseFormat(false, error, "Unexpected error while Adding The Site")
      );
    next(error);
  }
}

async function editSite(req, res, next) {
  try {
    const result = await UpdateSite(req.body, req.params.id);
    if (result == 0) {
      res.json(
        responseFormat(false, result, "Unexpected error, Site update failed!")
      );
    } else {
      res.json(responseFormat(true, result, "Site Updated SuccessFully"));
    }
  } catch (error) {
    res
      .status(500)
      .json(
        responseFormat(false, error, "Unexpected error while updating The Site")
      );
    next(error);
  }
}

async function removeSite(req, res, next) {
  try {
    const result = await DeleteSite(req.params.id);
    if (result == 0) {
      res.json(
        responseFormat(false, result, "Unexpected error, Site delete failed!")
      );
    } else {
      res.json(responseFormat(true, result, "Site Deleted SuccessFully"));
    }
  } catch (error) {
    res
      .status(500)
      .json(
        responseFormat(false, error, "Unexpected error while Deleting The Site")
      );
    next(error);
  }
}

async function getSiteByID(req, res, next) {
  GetSiteBySiteID(req.params.site_id, req.user)
    .then((data) => {
      res.json(responseFormat(true, data, "site data"));
    })
    .catch((err) => {
      res
        .status(500)
        .json(
          responseFormat(false, err, "Unexpected error while getting site data")
        );
      next(err);
    });
}
module.exports = {
  allSites,
  addNewSite,
  editSite,
  removeSite,
  getSiteByID,
  allSitesforDropdown,
  checkSiteIdValidation,
  FilterSites,
  getSiteByPaging,
  allSitesByVisits,
  allSitesForSiteDropdownFilter,
  SiteCheck,
};
