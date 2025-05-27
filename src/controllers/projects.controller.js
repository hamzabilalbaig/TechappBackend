const {
  InsertProject,
  RemoveProject,
  EditProject,
  GetProjects,
  GetProjectByID,
  GetProjectVisits,
  GetProjectTickets,
  projectPagination,
  filterProjects,
  deleteProject,
  GetProjectSites,
  AddSitesToProject,
  projectforRole,
  undoDeleteProject,
} = require("../services/projects.services");
const { responseFormat } = require("../utils/utils");

async function AddNewProject(req, res, next) {
  InsertProject(req.body)
    .then((result) => {
      res.json(responseFormat(true, result, "Project Added Successfully"));
    })
    .catch((ex) => {
      res
        .status(500)
        .json(
          responseFormat(false, ex, "Unexpected error while adding The Project")
        );
      next(ex);
    });
}

async function GetVisitsByProjectID(req, res, next) {
  try {
    const result = await GetProjectVisits(req?.params?.id);
    res.json(responseFormat(true, result, "vis"));
  } catch (error) {
    res.json(
      responseFormat(false, error, "Unexpected error while getting data")
    );
    next(error);
  }
}

async function GetTicketsByProjectID(req, res, next) {
  try {
    const result = await GetProjectTickets(req?.params?.id);
    res.json(responseFormat(true, result, "vis"));
  } catch (error) {
    res.json(
      responseFormat(false, error, "Unexpected error while getting data")
    );
    next(error);
  }
}



async function DeleteProject(req, res, next) {
  await deleteProject(req.params.id).then(result=>{
    res.json(responseFormat(true, result, "project deleted successfully"));

  }).catch(error=>{
    res
    .status(500)
    .json(
      responseFormat(false, error, "Unexpected error while deleting project")
    );
  next(error);
  })
}

async function UndoDeleteProject(req, res, next) {
  await undoDeleteProject(req.params.id).then(result=>{
    res.json(responseFormat(true, result, "project restored successfully"));

  }).catch(error=>{
    res
    .status(500)
    .json(
      responseFormat(false, error, "Unexpected error while restoring project")
    );
  next(error);
  })
}



async function UpdateProject(req, res, next) {
  try {
    const result = await EditProject(req.body, req.params.id);
    if (result == 0) {
      res.json(
        responseFormat(
          false,
          result,
          "Unexpected error, Project update failed!"
        )
      );
    } else {
      res.json(responseFormat(true, result, "Project Updated Successfully"));
    }
  } catch (error) {
    res
      .status(500)
      .json(
        responseFormat(
          false,
          error,
          "Unexpected error While Updating the Project"
        )
      );
    next(error);
  }
}

async function GetAllProjects(req, res, next) {
  try {
    const result = await GetProjects(req.user);
    res.json(responseFormat(true, result, "All Projects"));
  } catch (error) {
    res.json(
      responseFormat(true, error, "Unexpected error While Getting All Projects")
    );
    next(error);
  }
}

async function GetProjectByProjectID(req, res, next) {
  try {
    const result = await GetProjectByID(req.params.project_id, req.user);
    res.json(responseFormat(true, result, "Project"));
  } catch (error) {
    res.json(
      responseFormat(true, error, "Unexpected error While Getting Project")
    );
    next(error);
  }
}

async function ProjectSites(req, res, next) {
  GetProjectSites(req.params.project_id)
    .then((result) => {
      res.json(responseFormat(true, result, "Project Sites"));
    })
    .catch((error) => {
      res.json(
        responseFormat(false, error, "Unexpected error While Getting Project")
      );
      next(error);
    });
}

async function addSitesToProject(req, res, next) {
  await AddSitesToProject(req?.body, req?.params?.project_id)
    .then((result) => {
      res.json(responseFormat(true, result, "Sites Added Successfully"));
    })
    .catch((error) => {
      res
        .status(500)
        .json(responseFormat(false, error, "error while adding sites to list"));
      next(error);
    });
}

async function GetProjectsByPaging(req, res, next) {
  try {
    const result = await projectPagination(req.body?.params, req.user);
    res.json(responseFormat(true, result, "list of all projects"));
  } catch (error) {
    res
      .status(500)
      .json(responseFormat(false, error, "error while getting the list"));
    next(error);
  }
}

async function GetProjectsByRole(req, res, next) {
  try {
    const result = await projectforRole(req.body);
    res.json(responseFormat(true, result, "list of all projects"));
  } catch (error) {
    res
      .status(500)
      .json(responseFormat(false, error, "error while getting the list"));
    next(error);
  }
}

async function FilterProjects(req, res, next) {
  try {
    const result = await filterProjects(req.body?.params, req.user);
    res.json(responseFormat(true, result, "list of all projects"));
  } catch (error) {
    res
      .status(500)
      .json(responseFormat(false, error, "error while getting the list"));
    next(error);
  }
}
module.exports = {
  AddNewProject,
  DeleteProject,
  UpdateProject,
  UndoDeleteProject,
  GetProjectByProjectID,
  GetAllProjects,
  GetVisitsByProjectID,
  GetTicketsByProjectID,
  GetProjectsByPaging,
  FilterProjects,
  ProjectSites,
  addSitesToProject,
  GetProjectsByRole,
};
