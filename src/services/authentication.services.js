const bcryptjs = require("bcryptjs");
var express = require("express");
const jsonwebtoken = require("jsonwebtoken");
const {
  sequelizeServer,
  baseUrl,
} = require("./../../src/configs/sequelize.config");
const { responseFormat } = require("../utils/utils");
const { transporter } = require("../configs/mail.config");
const jwtConfig = require("../configs/jwt.config");
const { promisify } = require("util");
const fs = require("fs");
var handlebars = require("handlebars");
let stream = require("getstream");
let client = stream.connect(
  process.env.GETSTREAM_API_KEY,
  process.env.GETSTREAM_APP_SECRET
);

const readFile = promisify(fs.readFile);

const crypto = require("crypto");
const { encryptPass, decryptPass } = require("../utils/encryptionHandler");
const { Op } = require("sequelize");
const algorithm = "aes-256-cbc"; //Using AES encryption
const key = "vOVi6sd4pNWjRRIwCc7rdxs01lxHzfr5";
const mainiv = "336b39ca07586f23f868237cf7c12e20";
const { Novu, PushProviderIdEnum } = require("@novu/node");
const novu = new Novu(process.env.NOVU_API_KEY);

async function generateRefreshToken(user) {
  try {
    const existingRefreshToken =
      await sequelizeServer.models.refresh_tokens.findOne({
        where: { user_id: user.user_id },
      });
    const newRefreshToken = jsonwebtoken.sign(
      {
        user_id: user.user_id,
        email: user.work_email,
        user_type: user.role?.role_name,
        first_name: user.first_name,
        last_name: user.last_name,
        revoked: false,
      },
      jwtConfig.refreshSecret,
      {
        expiresIn: jwtConfig.refreshExpires,
      }
    );
    if (existingRefreshToken) {
      await sequelizeServer.models.refresh_tokens.update(
        {
          refresh_token: newRefreshToken,
        },
        {
          where: { user_id: user.user_id, revoked: false },
        }
      );
      return newRefreshToken;
    } else {
      await sequelizeServer.models.refresh_tokens.create({
        user_id: user.user_id,
        refresh_token: newRefreshToken,
        created_date: new Date(),
        revoked: false,
      });
      return newRefreshToken;
    }
  } catch (error) {
    return error;
  }
}

function verifyRefreshToken(refreshToken) {
  try {
    const decoded = jsonwebtoken.verify(refreshToken, jwtConfig.refreshSecret);
    return decoded;
  } catch (err) {
    throw new Error("Invalid refresh token");
  }
}

async function loginByRefreshToken(token) {
  try {
    const refreshToken = token;
    if (!refreshToken) {
      throw "Invalid Token";
    }

    const user = verifyRefreshToken(refreshToken);
    const accessToken = jsonwebtoken.sign(
      {
        user_id: user.user_id,
        email: user.email,
        user_type: user.user_type,
        first_name: user.first_name,
        last_name: user.last_name,
      },
      jwtConfig.secret,
      {
        expiresIn: jwtConfig.expires,
      }
    );
    return {
      status: true,
      token: accessToken,
      message: "Login Successful",
    };
  } catch (error) {
    return error;
  }
}
async function ResetPasswordService(req) {
  try {
    const email = req.body.email;
    const user = await sequelizeServer.models.users.findOne({
      where: {
        work_email: {
          [Op.iLike]: `${email}`,
        },
      },
    });
    if (user) {
      //send email
      // let html = await readFile(
      //   "public/UseEmailTemplates/reset-password.html",
      //   "utf8"
      // );
      // let template = handlebars.compile(html);
      var d = new Date();
      d.setMinutes(
        d.getMinutes() + ((process.env.RESETPASSWORDEXPIRY ?? 10) | 0)
      );

      const userObj = { user_id: user.user_id, expire_time: d.toISOString() };
      const encrypted = encrypt(JSON.stringify(userObj)).encryptedData;
      console.log(encrypted);
      let data = {
        email: user?.work_email,
        subject: "Techapp Reset Password",
        LINK: encrypted,
        baseURL: baseUrl,
        baseURLClient: process.env.CLIENT_APP_BASE_URL,
        username: user?.first_name,
      };
      // let htmlToSend = template(data);
      novu.trigger("resetpassword", {
        to: {
          subscriberId: `${user?.user_id}`,
          email: `${user.work_email}`,
        },
        payload: data,
      });
      //send email
      // var mailOptions = {
      //   from: "TechApp Support support@techapp.co",
      //   to: user?.work_email,
      //   //to: "hamzabilalbaig@gmail.com",
      //   subject: "Techapp Reset Password",
      //   html: htmlToSend,
      // };
      // await transporter.sendMail(mailOptions, function (error, info) {
      //   if (error) {
      //     console.log(error);
      //     return error;
      //   } else {
      //     console.log("Email sent: " + info.response);
      //     return "Email Sent Successfully";
      //   }
      // });
      return responseFormat(true, null, "Email sent", 200);
    } else {
      return responseFormat(false, null, "Submitted email does not exist", 400);
    }
  } catch (error) {
    console.log(error);
    return responseFormat(false, null, "Unexpected Error Occurred", 500);
  }
}

async function ResetPasswordValidateService(req) {
  try {
    const link = req.body.link;
    const object = JSON.parse(decrypt(link));
    if (object.expire_time) {
      let date = new Date(object.expire_time);
      if (new Date() > date) {
        return responseFormat(
          false,
          null,
          "The link has expired. Please try generating the link again",
          400
        );
      } else {
        return responseFormat(true, null, "Link validated", 200);
      }
    } else {
      return responseFormat(false, null, "Error in validating the link", 400);
    }
  } catch (error) {
    console.log(error);
    return responseFormat(false, null, "Error in validating the link", 500);
  }
}

async function ResetPasswordConfirmService(req) {
  try {
    const link = req.body.link;
    const password = req.body.password;
    const object = JSON.parse(decrypt(link));
    let user;
    if (object.expire_time) {
      let date = new Date(object.expire_time);
      if (new Date() > date) {
        return responseFormat(
          false,
          null,
          "The link has expired. Please try generating the link again",
          400
        );
      } else {
        user = await sequelizeServer.models.users.findOne({
          where: { user_id: object.user_id },
        });
        user.update({ password: encryptPass(password) });

        //send email

        // let html = await readFile(
        //   "public/UseEmailTemplates/reset-password-confirm-user.html",
        //   "utf8"
        // );
        // let template = handlebars.compile(html);
        let data = {
          subject: "TechApp Reset Password Successful",
          PASSWORD: password,
          baseURL: baseUrl,
          baseURLClient: process.env.CLIENT_APP_BASE_URL,
          USERNAME: user?.first_name,
        };
        novu.trigger("resetpasswordsuccess", {
          to: {
            subscriberId: `${object.user_id}`,
            email: user.work_email,
          },
          payload: data,
        });
        // let htmlToSend = template(data);
        // var mailOptions = {
        //   from: "TechApp Support support@techapp.co",
        //   to: user.work_email,
        //   subject: "TechApp Reset Password Successful",
        //   html: htmlToSend,
        // };
        // await transporter.sendMail(mailOptions, function (error, info) {
        //   if (error) {
        //     console.log(error);
        //     return error;
        //   } else {
        //     console.log("Email sent: " + info.response);
        //     return "Email Sent Successfully";
        //   }
        // });

        //send email admin

        // let html2 = await readFile(
        //   "public/UseEmailTemplates/reset-password-confirm-admin.html",
        //   "utf8"
        // );
        // let template2 = handlebars.compile(html2);
        // let data2 = {
        //   USERNAME: user.email,
        // };
        // let htmlToSend2 = template2(data2);
        // var mailOptions2 = {
        //   from: "TechApp Support support@techapp.co",
        //   to: "mohammadaashir9@gmail.com",
        //   subject: "Techapp Reset Password Success",
        //   html: htmlToSend2,
        // };
        // await transporter.sendMail(mailOptions2, function (error, info) {
        //   if (error) {
        //     console.log(error);
        //     return error;
        //   } else {
        //     console.log("Email sent: " + info.response);
        //     return "Email Sent Successfully";
        //   }
        // });

        return responseFormat(true, null, "Password reset successfully", 200);
      }
    } else {
      return responseFormat(false, null, "Error in validating the link", 400);
    }
  } catch (error) {
    console.log(error);
    return responseFormat(false, null, "Error in validating the link", 500);
  }
}

async function Login(email, password, isRemember, deviceToken) {
  try {
    if (!(email && password)) {
      return "All input is required";
    }
    const user = await sequelizeServer.models.users.findOne({
      where: {
        work_email: {
          [Op.iLike]: `${email}`,
        },
      },
      // where: { work_email: email },
      include: "role",
    });

    if (user && password === decryptPass(user.password)) {
      const token = jsonwebtoken.sign(
        {
          user_id: user.user_id,
          email: user.work_email,
          user_type: user.role?.role_name,
          first_name: user.first_name,
          last_name: user.last_name,
        },
        jwtConfig.secret,
        {
          expiresIn: jwtConfig.expires,
        }
      );
      if (deviceToken) {
        await novu.subscribers.setCredentials(
          `${user.user_id}`,
          PushProviderIdEnum.FCM,
          {
            deviceTokens: [`${deviceToken}`],
          }
        );
      }

      const refreshToken = await generateRefreshToken(user);

      let getStreamUser = await client.user(user?.username).getOrCreate({
        name: user?.full_name ?? user?.first_name + " " + user?.last_name,
        profileImage: `${baseUrl}/images/profile/${user?.user_image}`,
        techAppUserId: user?.user_id,
      });
      let userToken = await client.createUserToken(user?.username);
      if (userToken) {
        await client.user(user?.username).update({
          name: user?.full_name ?? user?.first_name + " " + user?.last_name,
          profileImage: `${baseUrl}/images/profile/${user?.user_image}`,
          techAppUserId: user?.user_id,
        });
        await client
          .feed("timeline", user?.username)
          .follow("user", user?.username);
      }

      //user.token = token;

      // user
      return {
        status: true,
        token,
        refreshToken,
        getStreamToken: userToken,
        message: "Login Successful",
      };
    }
    return {
      status: false,
      token: null,
      refreshToken: null,
      getStreamToken: null,
      message: "Invalid Credentials",
    };
  } catch (err) {
    console.log(err);
  }
}

async function ConfirmPassword(password, user_id) {
  const user = await sequelizeServer.models.users.findOne({
    where: {
      user_id: user_id,
    },
  });
  if (user && password === decryptPass(user.password)) {
    return true;
  } else {
    return false;
  }
}

async function changePassword(password, user_id) {
  const user = await sequelizeServer.models.users.update(
    { password: encryptPass(password) },
    {
      where: {
        user_id: user_id,
      },
    }
  );
  return user;
}

function encrypt(text) {
  let iv = Buffer.from(mainiv, "hex");
  let cipher = crypto.createCipheriv("aes-256-cbc", Buffer.from(key), iv);
  let encrypted = cipher.update(text);
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  return {
    iv: iv.toString("hex"),
    encryptedData: encrypted.toString("hex"),
  };
}

function decrypt(text) {
  let iv = Buffer.from(mainiv, "hex");
  let encryptedText = Buffer.from(text, "hex");
  let decipher = crypto.createDecipheriv("aes-256-cbc", Buffer.from(key), iv);
  let decrypted = decipher.update(encryptedText);
  decrypted = Buffer.concat([decrypted, decipher.final()]);
  return decrypted.toString();
}

module.exports = {
  Login,
  ResetPasswordService,
  ResetPasswordValidateService,
  ResetPasswordConfirmService,
  loginByRefreshToken,
  ConfirmPassword,
  changePassword,
};
