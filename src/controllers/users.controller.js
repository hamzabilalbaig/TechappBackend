const {
  sendExpiringNotification,
} = require("../services/certification_master.services");
const { CreateFolder } = require("../services/file_manager.services");
const {
  GetAllUsers,
  AddUser,
  UpdateUser,
  DeleteUser,
  GetPermissions,
  ProfilePicUpload,
  GetAllRoles,
  GetUserByUserID,
  GetUserAllDetails,
  LicenceUpload,
  GetAllUsersWithoutAuth,
  getAllUserByPaging,
  filterUsers,
  AssignDriverCode,
  GetAssignedDriverCodes,
  GetAllFieldEngineer,
  sendNotification,
  checkingapi,
  changedPass,
  tourWatched,
  tourWatchedfe,
  tourWatchedpm,
  getUserOnlineStatus,
  updateUserOnlineStatus,
  updateUserLastSeen,
  getUserLastSeen,
  verifyEmail,
  checkEmailVerification,
  sendEmailVerificationEmail,
  reverifyEmail,
} = require("../services/users.services");
const { responseFormat } = require("../utils/utils");
const { createFolder } = require("./file_manager.controller");

async function AllUsers(req, res, next) {
  try {
    let result = await GetAllUsers(req.user);

    res.json({
      success: true,
      message: "list of all users",
      data: result,
    });
  } catch (error) {
    res.json({
      success: false,
      message: "Unexpected error while getting the list",
      data: [],
    });
    next(error);
  }
}
async function AllUserFE(req, res, next) {
  try {
    let result = await GetAllFieldEngineer(req.user);

    res.json({
      success: true,
      message: "list of all FE",
      data: result,
    });
  } catch (error) {
    res.json({
      success: false,
      message: "Unexpected error while getting the list",
      data: [],
    });
    next(error);
  }
}

async function getAllUserByPagination(req, res, next) {
  try {
    let result = await getAllUserByPaging(req.body.params, req.user);

    res.json({
      success: true,
      message: "list of users",
      data: result,
    });
  } catch (error) {
    res.json({
      success: false,
      message: "Unexpected error while getting the list",
      data: [],
    });
    next(error);
  }
}

async function FilterUsers(req, res, next) {
  try {
    const result = await filterUsers(req.body.params, req.user);
    res.json(responseFormat(true, result, "list of all users"));
  } catch (error) {
    res
      .status(500)
      .json(
        responseFormat(false, error, "Unexpected error while getting the list")
      );
    next(error);
  }
}

async function setAssignDriverCodes(req, res, next) {
  try {
    const result = await AssignDriverCode(req.body);
    res.json(responseFormat(true, result, "Assigned Successfully"));
  } catch (error) {
    res
      .status(500)
      .json(responseFormat(false, error, "Unexpected error while Assigning"));
    next(error);
  }
}

async function getAssignedDriverCodes(req, res, next) {
  try {
    const result = await GetAssignedDriverCodes(req.params.id);
    res.json(responseFormat(true, result, "Assigned driver codes"));
  } catch (error) {
    res
      .status(500)
      .json(
        responseFormat(
          false,
          error,
          "Unexpected error while getting Assigned driver codes"
        )
      );
    next(error);
  }
}

async function AllUsersWithoutAuth(req, res, next) {
  try {
    let result = await GetAllUsersWithoutAuth(req.user);

    res.json({
      success: true,
      message: "list of all users",
      data: result,
    });
  } catch (error) {
    res.json({
      success: false,
      message: "Unexpected error while getting the list",
      data: [],
    });
    next(error);
  }
}

async function addNewUser(req, res, next) {
  try {
    const result = await AddUser(req.body);
    const file1 = await CreateFolder(
      {
        name: "My Files",
        date_created: Date.now(),
      },
      result.user_id,
      0
    );
    const file2 = await CreateFolder(
      {
        name: "My Certifications",
        date_created: Date.now(),
      },
      result.user_id,
      0
    );
    const file3 = await CreateFolder(
      {
        name: "My Contracts",
        date_created: Date.now(),
      },
      result.user_id,
      0
    );
    const file4 = await CreateFolder(
      {
        name: "My Insurances",
        date_created: Date.now(),
      },
      result.user_id,
      0
    );
    // const file5 = await CreateFolder(
    //   {
    //     name: "Recycle Bin",
    //     date_created: Date.now(),
    //   },
    //   result.user_id,
    //   0
    // );
    res.json(responseFormat(true, result, "User Added Successfully"));
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json(
        responseFormat(
          false,
          error,
          "Unexpected error while adding the user" + error
        )
      );
    next(error);
  }
}

async function editUser(req, res, next) {
  try {
    const result = await UpdateUser(req.body, req.params.id);
    if (result == 0) {
      res.json(
        responseFormat(
          false,
          result,
          "Unexpected error while Updating the User"
        )
      );
    } else {
      res.json(responseFormat(true, result, "User Updated Successfully"));
    }
  } catch (error) {
    console.log(error);

    res
      .status(500)
      .json(
        responseFormat(
          false,
          error,
          "Unexpected error while Updating the User" + error
        )
      );
    next(error);
  }
}

async function removeUser(req, res, next) {
  try {
    const result = await DeleteUser(req.params.id);
    if (result == 0) {
      res.json(
        responseFormat(
          false,
          result,
          "Unexpected error while Deleting the User"
        )
      );
    } else {
      res.json(responseFormat(true, result, "user Deleted Successfully"));
    }
  } catch (error) {
    res
      .status(500)
      .json(
        responseFormat(false, error, "Unexpected error while Deleting the User")
      );
  }
}
async function getPermissions(req, res, next) {
  try {
    const result = await GetPermissions(req.user.user_id);
    res.json(responseFormat(true, result, "list"));
    return;
  } catch (err) {
    res
      .status(500)
      .json(
        responseFormat(false, err, "Unexpected error while getting permissions")
      );
  }
}

async function UploadProfilePic(req, res, next) {
  const file = req.file;
  if (!file) {
    const error = new Error("No File Found, Please upload a file");
    error.httpStatusCode = 400;
    return next(error);
  } else {
    ProfilePicUpload(file.originalname, req.params.id)
      .then((result) => {
        res.json(
          responseFormat(true, result, "profile picture saved Successfully")
        );
      })
      .catch((err) => {
        res
          .status(500)
          .json(
            responseFormat(
              false,
              err,
              "Unexpected error while saving profile picture"
            )
          );
        next(err);
      });
  }

  // try {
  //   const result = await ProfilePicUpload(req.body.user_image, req.params.id);
  //   res.json(responseFormat(true, result, "file uploaded"));
  //   next("");
  // } catch (error) {
  //   console.log(error);
  //   res
  //     .status(500)
  //     .json(
  //       responseFormat(false, error, "error while uploading profile picture")
  //     );
  //   next(error);
  // }
}

async function UploadUserLicense(req, res, next) {
  const file = req.file;
  if (!file) {
    const error = new Error("No File Found, Please upload a file");
    error.httpStatusCode = 400;
    return next(error);
  } else {
    LicenceUpload(file.originalname, req.params.id)
      .then((result) => {
        res.json(responseFormat(true, result, "License saved Successfully"));
      })
      .catch((err) => {
        console.log(err);
        res
          .status(500)
          .json(
            responseFormat(false, err, "Unexpected error while saving License")
          );
        next(err);
      });
  }
}

async function GetRoles(req, res, next) {
  try {
    const result = await GetAllRoles();
    res.json(responseFormat(true, result, "All Roles"));
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json(
        responseFormat(false, error, "Unexpected error while getting roles")
      );
    next(error);
  }
}

async function GetUserbyID(req, res, next) {
  GetUserByUserID(req.user.user_id)
    .then((data) => {
      res.json(responseFormat(true, data, "user data"));
    })
    .catch((err) => {
      res
        .status(500)
        .json(
          responseFormat(false, err, "Unexpected error while getting user data")
        );
      next(err);
    });
}

async function GetUserbyUserID(req, res, next) {
  GetUserByUserID(req.params.id)
    .then((data) => {
      res.json(responseFormat(true, data, "user data"));
    })
    .catch((err) => {
      res
        .status(500)
        .json(
          responseFormat(false, err, "Unexpected error while getting user data")
        );
      next(err);
    });
}

async function GetUserDetailsbyID(req, res, next) {
  await GetUserAllDetails(req.params.user_id, req.user)
    .then((result) => {
      res.json(responseFormat(true, result, "user Details"));
    })
    .catch((error) => {
      console.log(error);
      res
        .status(500)
        .json(
          responseFormat(false, error, "Unexpected error while getting user")
        );
      next(error);
    });
}

async function emailcheck(req, res, next) {
  try {
    const result = await sendExpiringNotification();
    res.json(responseFormat(true, result, "user Details"));
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json(
        responseFormat(false, error, "Unexpected error while getting user")
      );
    next(error);
  }
}

async function changePasswordOnce(req, res, next) {
  try {
    const result = await changedPass(req?.user?.user_id, req.params.pass);
    res.json(responseFormat(true, result, "user Details"));
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json(
        responseFormat(false, error, "Unexpected error while changing password")
      );
    next(error);
  }
}

async function giveTour(req, res, next) {
  try {
    const result = await tourWatched(req?.user?.user_id);
    res.json(responseFormat(true, result, "user Details"));
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json(responseFormat(false, error, "Unexpected error while giving tour"));
    next(error);
  }
}
async function giveTourFE(req, res, next) {
  try {
    const result = await tourWatchedfe(req?.user?.user_id);
    res.json(responseFormat(true, result, "user Details"));
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json(responseFormat(false, error, "Unexpected error while giving tour"));
    next(error);
  }
}
async function giveTourPM(req, res, next) {
  try {
    const result = await tourWatchedpm(req?.user?.user_id);
    res.json(responseFormat(true, result, "user Details"));
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json(responseFormat(false, error, "Unexpected error while giving tour"));
    next(error);
  }
}

async function emailcheck(req, res, next) {
  try {
    const result = await checkingapi();
    res.json(responseFormat(true, result, "user Details"));
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json(
        responseFormat(false, error, "Unexpected error while getting user")
      );
    next(error);
  }
}

async function checkOnlineStatus(req, res, next) {
  await getUserOnlineStatus(req.params.id)
    .then((result) => {
      res.json(responseFormat(true, result, "user Details"));
    })
    .catch((error) => {
      console.log(error);
      res
        .status(500)
        .json(
          responseFormat(false, error, "Unexpected error while getting user")
        );
      next(error);
    });
}

async function setUserOnlineStatus(req, res, next) {
  await updateUserOnlineStatus(req.params.id, req.body.status)
    .then((result) => {
      const io = req.io;
      io.emit("onlineStatus", { status: req.body.status });
      res.json(responseFormat(true, result, "status updated"));
    })
    .catch((error) => {
      console.log(error);
      res
        .status(500)
        .json(
          responseFormat(
            false,
            error,
            "Unexpected error while setting user status"
          )
        );
      next(error);
    });
}

async function setUserLastSeen(req, res, next) {
  await updateUserLastSeen(req.params.id, req.body.status)
    .then((result) => {
      res.json(responseFormat(true, result, "last seen updated"));
    })
    .catch((error) => {
      console.log(error);
      res
        .status(500)
        .json(
          responseFormat(
            false,
            error,
            "Unexpected error while setting user last seen"
          )
        );
      next(error);
    });
}

async function checkUserLastSeen(req, res, next) {
  await getUserLastSeen(req.params.id)
    .then((result) => {
      res.json(responseFormat(true, result, "last seen updated"));
    })
    .catch((error) => {
      console.log(error);
      res
        .status(500)
        .json(
          responseFormat(
            false,
            error,
            "Unexpected error while getting user last seen"
          )
        );
      next(error);
    });
}

async function VerifyEmail(req, res, next) {
  await verifyEmail(req.params.id)
    .then((result) => {
      res.json(responseFormat(true, result, "User Verified"));
    })
    .catch((error) => {
      console.log(error);
      res
        .status(500)
        .json(
          responseFormat(
            false,
            error,
            "Unexpected error while verifying user email"
          )
        );
      next(error);
    });
}
async function ReVerifyEmail(req, res, next) {
  await reverifyEmail(req.body.id, req.body.verify)
    .then((result) => {
      res.json(responseFormat(true, result, "User Verified"));
    })
    .catch((error) => {
      console.log(error);
      res
        .status(500)
        .json(
          responseFormat(
            false,
            error,
            "Unexpected error while verifying user email"
          )
        );
      next(error);
    });
}

async function CheckVerifyEmail(req, res, next) {
  await checkEmailVerification(req.body.id, req.body.email, req.body.oldEmail)
    .then((result) => {
      res.json(responseFormat(true, result, "User Verified"));
    })
    .catch((error) => {
      console.log(error);
      res
        .status(500)
        .json(
          responseFormat(
            false,
            error,
            "Unexpected error while verifying user email"
          )
        );
      next(error);
    });
}
async function SendEmailVerificationEmail(req, res, next) {
  await sendEmailVerificationEmail(req.body.id, req.body.email)
    .then((result) => {
      res.json(responseFormat(true, result, "Email sent"));
    })
    .catch((error) => {
      console.log(error);
      res
        .status(500)
        .json(
          responseFormat(
            false,
            error,
            "Unexpected error while verifying user email"
          )
        );
      next(error);
    });
}

module.exports = {
  AllUsers,
  addNewUser,
  editUser,
  removeUser,
  getPermissions,
  UploadProfilePic,
  GetRoles,
  GetUserbyID,
  GetUserDetailsbyID,
  UploadUserLicense,
  AllUsersWithoutAuth,
  getAllUserByPagination,
  FilterUsers,
  setAssignDriverCodes,
  getAssignedDriverCodes,
  AllUserFE,
  emailcheck,
  GetUserbyUserID,
  giveTour,
  changePasswordOnce,
  giveTourFE,
  giveTourPM,
  checkOnlineStatus,
  setUserOnlineStatus,
  setUserLastSeen,
  checkUserLastSeen,
  VerifyEmail,
  CheckVerifyEmail,
  SendEmailVerificationEmail,
  ReVerifyEmail,
};
