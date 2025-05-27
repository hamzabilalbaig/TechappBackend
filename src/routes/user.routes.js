const bcryptjs = require("bcryptjs");
var express = require("express");
const authenticationController = require("../controllers/authentication.controller");
const usersController = require("../controllers/users.controller");
var router = express.Router();
const auth = require("../middlewares/auth");
const ProfilePictureUpload = require("../middlewares/multer");
const UserLicenseUpload = require("../middlewares/multer-license");
const { Novu, PushProviderIdEnum } = require("@novu/node");
const novu = new Novu(process.env.NOVU_API_KEY);
const upload = require("../middlewares/multer");
const { ProfilePicUpload } = require("../services/users.services");
const { sequelizeServer } = require("../configs/sequelize.config");

router.post("/authenticate", authenticationController.loginUser);
router.post("/confirmPass", authenticationController.PasswordConfirm);
router.post("/changePass", authenticationController.ChangePassword);
router.post("/resetpassword", authenticationController.ResetPassword);
router.post(
  "/resetpasswordvalidate",
  authenticationController.ResetPasswordValidate
);
router.post(
  "/resetpasswordconfirm",
  authenticationController.ResetPasswordConfirm
);
router.post("/loginByRefreshToken", authenticationController.loginUserByToken);
//USERS
router.get("/users", auth, usersController.AllUsers);
router.get("/usersFE", auth, usersController.AllUserFE);
router.get("/userswo", auth, usersController.AllUsersWithoutAuth);
router.post("/users", auth, usersController.addNewUser);
router.put("/users/:id", auth, usersController.editUser);
router.delete("/users/:id", auth, usersController.removeUser);
router.get("/users/permissions", auth, usersController.getPermissions);
router.get("/users/GetRoles", usersController.GetRoles);
router.get("/users/getuserbyid", auth, usersController.GetUserbyID);
router.get("/users/getuserbyuserid/:id", usersController.GetUserbyUserID);

router.get(
  "/users/getUserDetailsbyID/:user_id",

  usersController.GetUserDetailsbyID
);

router.post(
  "/users/UploadProfilePic/:id",
  ProfilePictureUpload.single("myFile"),
  usersController.UploadProfilePic
);
router.post(
  "/users/UserLicenseUpload/:id",
  UserLicenseUpload.single("myFile"),
  usersController.UploadUserLicense
);

router.post(
  "/users/usersWithPagingation",
  auth,
  usersController.getAllUserByPagination
);
router.post("/users/filterUsers", auth, usersController.FilterUsers);
router.post(
  "/users/AssignDriverCodes",
  auth,
  usersController.setAssignDriverCodes
);
router.get(
  "/users/GetAssignDriverCodes/:id",
  auth,
  usersController.getAssignedDriverCodes
);

router.get("/users/emailcheck", auth, usersController.emailcheck);
router.get("/giveTour", auth, usersController.giveTour);
router.get("/giveTourFE", auth, usersController.giveTourFE);
router.get("/giveTourPM", auth, usersController.giveTourPM);
router.put(
  "/users/ChangePassword/:pass",
  auth,
  usersController.changePasswordOnce
);

router.post(
  "/users/setUserOnlineStatus/:id",
  usersController.setUserOnlineStatus
);
router.get("/users/checkOnlineStatus/:id", usersController.checkOnlineStatus);
router.get("/users/checkUserLastSeen/:id", usersController.checkUserLastSeen);
router.post("/users/setUserLastSeen/:id", usersController.setUserLastSeen);
router.get("/users/verifyUser/:id", usersController.VerifyEmail);
router.post("/users/reverifyUser", usersController.ReVerifyEmail);
router.post("/users/checkVerifyEmail", usersController.CheckVerifyEmail);
router.post(
  "/users/SendEmailVerificationEmail",
  usersController.SendEmailVerificationEmail
);
// router.get("/users/addalltonovu", async (req, res) => {
//   const user = await sequelizeServer.models.users.findAll();
//   user.forEach(async (element) => {
//     await novu.subscribers.identify(element.user_id, {
//       email: element.work_email,
//     });
//   });
//   res.json({ message: "done" });
// });

module.exports = router;
