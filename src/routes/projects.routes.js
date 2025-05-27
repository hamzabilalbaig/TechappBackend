var express = require("express");
const projectsController = require("../controllers/projects.controller");
var router = express.Router();
const auth = require("../middlewares/auth");

router.post("/projects/Add", auth, projectsController.AddNewProject);
router.delete("/projects/Delete/:id", auth, projectsController.DeleteProject);
router.delete("/projects/undoDelete/:id", auth, projectsController.UndoDeleteProject);

router.get("/projects", auth, projectsController.GetAllProjects);
router.put("/projects/Add/:id", auth, projectsController.UpdateProject);
router.get(
  "/projects/GetProjectByProjectID/:project_id",
  auth,
  projectsController.GetProjectByProjectID
);
router.get(
  "/projects/GetProjectSites/:project_id",
  auth,
  projectsController.ProjectSites
);

router.get(
  "/projects/getProjectVisits/:id",
  auth,
  projectsController.GetVisitsByProjectID
);

router.get(
  "/projects/getProjectTickets/:id",
  auth,
  projectsController.GetTicketsByProjectID
);

router.post(
  "/projects/getProjectsByPaging",
  auth,
  projectsController.GetProjectsByPaging
);
router.post(
  "/projects/getProjectsByRole",
  projectsController.GetProjectsByRole
);
router.post(
  "/projects/FilterProjects",
  auth,
  projectsController.FilterProjects
);

router.post(
  "/projects/addSitesToProject/:project_id",
  auth,
  projectsController.addSitesToProject
);

module.exports = router;
