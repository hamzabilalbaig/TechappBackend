const {
  Login,
  GetPermissions,
  ResetPasswordService,
  ResetPasswordValidateService,
  ResetPasswordConfirmService,
  loginByRefreshToken,
  ConfirmPassword,
  changePassword,
} = require("../services/authentication.services");
const { responseFormat } = require("../utils/utils");

async function loginUser(req, res, next) {
  const { email, password, isRemember, deviceToken } = req.body;
  try {
    const result = await Login(email, password, isRemember, deviceToken);
    res.json(
      responseFormat(
        result.status,
        {
          token: result.token,
          refreshToken: result.refreshToken,
          getStreamToken: result.getStreamToken,
        },
        result.message
      )
    );
  } catch (err) {
    console.error(responseFormat(false, null, "Error while logging in"));
    next(err);
  }
}

async function loginUserByToken(req, res, next) {
  const { token } = req.body;
  try {
    const result = await loginByRefreshToken(token);
    res.json(
      responseFormat(result.status, { token: result.token }, result.message)
    );
  } catch (err) {
    console.error(
      responseFormat(false, null, "Unexpected error occurred. Please try again")
    );
    next(err);
  }
}
async function ResetPassword(req, res, next) {
  try {
    const result = await ResetPasswordService(req);
    res.status(result.code).json(result);
  } catch (error) {
    res
      .status(500)
      .json(
        responseFormat(
          false,
          error,
          "Unexpected error occurred. Please try again"
        )
      );
    next(error);
  }
}

async function ResetPasswordValidate(req, res, next) {
  try {
    const result = await ResetPasswordValidateService(req);
    res.status(result.code).json(result);
  } catch (error) {
    res
      .status(500)
      .json(
        responseFormat(
          false,
          error,
          "Unexpected error occurred. Please try again"
        )
      );
    next(error);
  }
}

async function ResetPasswordConfirm(req, res, next) {
  try {
    const result = await ResetPasswordConfirmService(req);
    res.status(result.code).json(result);
  } catch (error) {
    res
      .status(500)
      .json(
        responseFormat(
          false,
          error,
          "Unexpected error occurred. Please try again"
        )
      );
    next(error);
  }
}

async function PasswordConfirm(req, res, next) {
  try {
    const result = await ConfirmPassword(req.body.password, req.body.user_id);
    res.status(200).json(result);
  } catch (error) {
    res
      .status(500)
      .json(
        responseFormat(
          false,
          error,
          "Unexpected error occurred. Please try again"
        )
      );
    next(error);
  }
}

async function ChangePassword(req, res, next) {
  try {
    const result = await changePassword(req.body.password, req.body.user_id);
    res.status(200).json(result);
  } catch (error) {
    res
      .status(500)
      .json(
        responseFormat(
          false,
          error,
          "Unexpected error occurred. Please try again"
        )
      );
    next(error);
  }
}

module.exports = {
  loginUser,
  loginUserByToken,
  ResetPassword,
  ResetPasswordValidate,
  ResetPasswordConfirm,
  PasswordConfirm,
  ChangePassword,
};
