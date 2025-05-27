const { sequelizeServer, baseUrl } = require("../configs/sequelize.config");
const { Op } = require("sequelize");
const _ = require("lodash");
const { fromDir, expiryDays } = require("../utils/utils");
const fs = require("fs");
const schedule = require("node-schedule");
const { Novu } = require("@novu/node");
const { getTradeTypes } = require("./trades.services");
const novu = new Novu(process.env.NOVU_API_KEY);
async function getAllCertificationMasters() {
  return await sequelizeServer.models.certification_master.findAll({
    include: [
      "cert_type",
      "cert_provider",
      {
        model: sequelizeServer.models.users,
        attributes: [
          "user_id",
          "first_name",
          "last_name",
          "email",
          "work_email",
          "company",
          "position",
          "cell_phone",
          "vendor_status",
          "state",
          "full_name",
          "is_active",
        ],
        as: "user",
      },
    ],
  });
}

async function removeCertificateFile(folder, file) {
  const fullFileName = fromDir(
    require("path").resolve(
      `${__dirname}../../../public/files/${folder}/certifications`
    ),
    file
  );
  if (fullFileName === undefined) {
    return undefined;
  } else {
    const file = require("path").resolve(
      `${__dirname}../../../public/files/${folder}/certifications/${fullFileName}`
    );

    fs.unlink(file, function (err) {
      if (err) throw err;
      // if no error, file has been deleted successfully
      console.log("File deleted!");
      return "deleted";
    });
  }
}
async function deleteCertificationMaster(id) {
  const certMaster = await getCertificationMasterByID(id);
  const folder = `user-${certMaster?.user_id}`;
  const file = certMaster?.cert_master_image;
  const fileDeleted = await removeCertificateFile(folder, file)
    .then((result) => {
      return true;
    })
    .catch((error) => {
      return false;
    });

  if (fileDeleted) {
    return await sequelizeServer.models.certification_master.destroy({
      where: { cert_type_id: id },
    });
  }
  //return certMaster;
  // return await sequelizeServer.models.certification_master.update(
  //   { is_valid: false },
  //   {
  //     where: { certification_id: id },
  //   }
  // );
}

async function getAllCertificationMastersByPaging(filters) {
  const certifications =
    await sequelizeServer.models.certification_master.findAndCountAll({
      include: [
        "cert_type",
        "cert_provider",
        {
          model: sequelizeServer.models.users,
          attributes: [
            "user_id",
            "first_name",
            "last_name",
            "email",
            "work_email",
            "company",
            "position",
            "cell_phone",
            "vendor_status",
            "state",
            "full_name",
          ],
          as: "user",
        },
      ],
      where: { is_valid: true, user_id: filters.user_id },
      offset: filters.offset,
      limit: filters.limit,
      distinct: "certification_master.certmaster_id",
    });
  return certifications;
}

async function getFilteredCertificationMaster(filters) {
  const certifications =
    await sequelizeServer.models.certification_master.findAndCountAll({
      include: [
        "cert_type",
        "cert_provider",
        {
          model: sequelizeServer.models.users,
          attributes: [
            "user_id",
            "first_name",
            "last_name",
            "email",
            "work_email",
            "company",
            "position",
            "cell_phone",
            "vendor_status",
            "state",
            "full_name",
          ],
          as: "user",
          where: {
            full_name: {
              [Op.iLike]: `%${filters?.input}%`,
            },
          },
        },
      ],
      where: { is_valid: true, user_id: filters.user_id },
      offset: filters.offset,
      limit: filters.limit,
    });
  return certifications;
}

async function addCertificationMaster(data) {
  const certification = JSON.parse(data);
  const isExpired =
    expiryDays(certification?.cert_expire_date) < 0
      ? "EXPIRED"
      : certification?.cert_status;
  return await sequelizeServer.models.certification_master.create({
    ...certification,
    cert_status: isExpired,
  });
}

async function modifyCertificationMaster(id, data) {
  const certification = JSON.parse(data);
  const isExpired =
    expiryDays(certification?.cert_expire_date) < 0
      ? "EXPIRED"
      : certification?.cert_status;
  return await sequelizeServer.models.certification_master.update(
    {
      ...certification,
      cert_status: isExpired,
    },
    {
      where: { certmaster_id: id },
    }
  );
}

async function getCertificationMasterByID(id) {
  return await sequelizeServer.models.certification_master.findOne({
    where: { cert_type_id: id },
  });
}

async function getUserCertificationMasters(id) {
  return await sequelizeServer.models.certification_master.findAll({
    where: { user_id: id },
  });
}

async function getUserCertCategories(id) {
  const userCerts = await sequelizeServer.query(
    `SELECT cert_category.cert_category_id,cert_category.cert_category_name,cert_category.cert_category_description,cert_category.cert_category_policy,cert_category.is_valid,cert_category.enabled_badge,cert_category.disabled_badge FROM users LEFT JOIN users_trades ON users.user_id = users_trades.user_id LEFT JOIN trades_types ON users_trades.trade_id = trades_types.trade_id LEFT JOIN cert_type ON trades_types.cert_type_id = cert_type.cert_type_id LEFT JOIN cert_category ON cert_type.cert_category_id = cert_category.cert_category_id WHERE users.user_id =  ${id} ;`
    //`SELECT * FROM users LEFT JOIN certification_master ON users.user_id = certification_master.user_id LEFT JOIN cert_type ON certification_master.cert_type_id = cert_type.cert_type_id LEFT JOIN cert_category ON cert_type.cert_category_id = cert_category.cert_category_id WHERE users.user_id = ${id} AND certification_master.is_valid = true;`
  );

  // Extract cert_categories from userCerts
  const certCategories = await userCerts[0]?.map((cert) => {
    return cert;
  });
  const distinctCats = _.uniqBy(certCategories, "cert_category_id");
  distinctCats.sort(
    (a, b) => parseInt(a?.cert_category_id) - parseInt(b?.cert_category_id)
  );
  return distinctCats;
}

async function getUserCertByTypeID(id, userId) {
  const userCerts = await sequelizeServer.models.certification_master.findOne({
    include: [
      "cert_provider",
      {
        model: sequelizeServer.models.cert_type,
        as: "cert_type",
      },
    ],
    where: { user_id: userId, is_valid: true, cert_type_id: id },
  });
  return userCerts;
}

async function getUserCertByTypeIDs(data, userId) {
  const userCerts = await sequelizeServer.models.certification_master.findAll({
    include: [
      "cert_provider",
      {
        model: sequelizeServer.models.cert_type,
        as: "cert_type",
      },
    ],
    where: {
      user_id: userId,
      is_valid: true,
      cert_type_id: { [Op.in]: data?.ids },
    },
  });
  return userCerts;
}

async function evaluateCertificationPercentage(body) {
  const tradeTypes = await getTradeTypes(body?.userID, body?.categoryID);

  const certs = [];
  const unavailableCerts = [];
  for (const tradeType of tradeTypes) {
    if (tradeType?.equivalent_type_id) {
      const eqTs = await getUserCertByTypeID(
        tradeType?.equivalent_type_id,
        body?.userID
      );
      if (eqTs) {
        certs.push(eqTs);
      } else {
        const ts = await getUserCertByTypeID(
          tradeType?.cert_type_id,
          body?.userID
        );
        if (ts) {
          certs.push(ts);
        } else {
          unavailableCerts.push(tradeType);
        }
      }
    } else {
      const ts = await getUserCertByTypeID(
        tradeType?.cert_type_id,
        body?.userID
      );
      if (ts) {
        certs.push(ts);
      } else {
        unavailableCerts.push(tradeType);
      }
    }
  }
  let validCerts = [];
  let expiredCerts = [];
  certs?.map((d) => {
    if (d?.cert_status === "EXPIRED") {
      expiredCerts.push(d);
    } else if (d?.cert_status === "VALID") {
      if (expiryDays(d?.cert_expire_date) <= 30) {
        expiredCerts.push(d);
      } else {
        validCerts.push(d);
      }
    } else {
      validCerts.push(d);
    }
  });
  const percentage = validCerts?.length / tradeTypes?.length;
  const result = {
    percentage: percentage,
    validCerts: validCerts,
    expiredCerts: expiredCerts,
    certsTypes: unavailableCerts,
  };
  return result;
}

async function evaluateBasic4CertificationPercentage(body) {
  const tradeTypes = await getTradeTypes(body?.userID, body?.categoryID);

  const certs = [];
  const unavailableCerts = [];
  for (const tradeType of tradeTypes) {
    if (tradeType?.equivalent_type_id) {
      const eqTs = await getUserCertByTypeID(
        tradeType?.equivalent_type_id,
        body?.userID
      );
      if (eqTs) {
        certs.push(eqTs);
      } else {
        const ts = await getUserCertByTypeID(
          tradeType?.cert_type_id,
          body?.userID
        );
        if (ts) {
          certs.push(ts);
        } else {
          unavailableCerts.push(tradeType);
        }
      }
    } else {
      const ts = await getUserCertByTypeID(
        tradeType?.cert_type_id,
        body?.userID
      );
      if (ts) {
        certs.push(ts);
      } else {
        unavailableCerts.push(tradeType);
      }
    }
  }
  let validCerts = [];
  let expiredCerts = [];
  certs?.map((d) => {
    if (d?.cert_status === "EXPIRED") {
      expiredCerts.push(d);
    } else if (d?.cert_status === "VALID") {
      if (expiryDays(d?.cert_expire_date) <= 30) {
        expiredCerts.push(d);
      } else {
        validCerts.push(d);
      }
    } else {
      validCerts.push(d);
    }
  });
  const updatedCerts = validCerts.filter(
    (cert) => cert.cert_type.cert_type_name !== "Blood Borne Pathogens"
  );
  const percentage = updatedCerts?.length / (tradeTypes?.length - 1);

  const result = {
    percentage: percentage,
    validCerts: validCerts,
    expiredCerts: expiredCerts,
    certsTypes: unavailableCerts,
  };
  return result;
}
async function sendNotification(data) {
  try {
    for await (const d of data) {
      if (d?.email) {
        console.log(d);
        // let html = await readFile(
        //   "public/UseEmailTemplates/automatedEmail.html",
        //   "utf8"
        // );
        // let template = handlebars.compile(html);
        // let htmlToSend = template(d);
        // // expected output: 1
        // var mailOptions = {
        //   from: "TechApp Support support@techapp.co",
        //   to: [d?.email],
        //   subject: `Cert Expiration Update : ${d?.userName} - ${d?.certName} - ${d?.expirey}`,
        //   html: htmlToSend,
        // };
        // const result = await transporter.sendMail(mailOptions);
        novu
          .trigger("certificationexpire", {
            to: {
              subscriberId: `${d?.user_id}`,
              email: `${d?.email}`,
            },
            payload: d,
          })
          .then((e) => {
            console.log(e);
          })
          .catch((err) => {
            console.log(err);
          });
        await sequelizeServer.models.notifications.create({
          user_id: `${d?.user_id}`,
          title: "Cert Expiration Update",
          content: `Cert Expiration Update : ${d?.userName} - ${d?.certName} - ${d?.expirey}`,
          created_on: new Date(),
          read: false,
        });
        // console.log("sent", result);
      } // closes iterator, triggers return
    }
  } catch (error) {
    console.log(error);
  }
}

async function sendExpiringNotification() {
  let certData = [];
  const dataArr = await getAllCertificationMasters();
  dataArr.forEach((data) => {
    if (data?.user?.is_active) {
      if (expiryDays(data?.cert_expire_date) < 30) {
        certData.push({
          subject: `Cert Expiration Update : ${data?.user?.first_name} ${data?.user?.last_name} - ${data?.cert_type?.cert_type_name} - ${data?.cert_expire_date}`,
          user_id: data?.user?.user_id,
          certId: data?.certmaster_id,
          downloads: `user-${data?.user?.user_id}/${data?.cert_master_image}`,
          baseURL: baseUrl,
          certName: data?.cert_type?.cert_type_name,
          userName: `${data?.user?.first_name} ${data?.user?.last_name}`,
          expirey: data?.cert_expire_date,
          email: data?.user?.work_email,
        });
      }
    }
  });
  console.log(certData);
  sendNotification(certData);
  return null;
}

async function setExpired() {
  const dataArr = await getAllCertificationMasters();
  dataArr.forEach(async (data) => {
    if (data?.user?.is_active) {
      if (expiryDays(data?.cert_expire_date) < 0) {
        await sequelizeServer.models.certification_master.update(
          {
            cert_status: "EXPIRED",
            verified_by: null,
            verification_date: null,
          },
          {
            where: { certmaster_id: data?.certmaster_id },
          }
        );
      }
    }
  });
  return null;
}

schedule.scheduleJob(
  { hour: 9, minute: 0, dayOfWeek: 1, tz: "America/New_York" },
  async function () {
    await sendExpiringNotification();
  }
);

async function checkExpiry() {
  const currentDate = new Date();
  currentDate.setHours(0, 0, 0, 0);
  const certData = await sequelizeServer.models.certification_master.findAll({
    where: {
      cert_expire_date: {
        [Op.lte]: currentDate,
      },
    },
  });

  return certData;
}
// const cronPattern = "0 8 * * *"; // 8:00 AM in UTC
// const easternTimeZoneOffset = -4; // Eastern Time is UTC-4 (consider daylight saving time if applicable)
// const adjustedCronPattern = `${cronPattern} ${easternTimeZoneOffset}`;
const checkExpiryJob = schedule.scheduleJob("0 0 * * *", async function () {
  await setExpired();
});

module.exports = {
  sendExpiringNotification,
  getAllCertificationMasters,
  deleteCertificationMaster,
  addCertificationMaster,
  modifyCertificationMaster,
  getCertificationMasterByID,
  getUserCertificationMasters,
  getAllCertificationMastersByPaging,
  getFilteredCertificationMaster,
  getUserCertCategories,
  getUserCertByTypeID,
  getUserCertByTypeIDs,
  evaluateCertificationPercentage,
  evaluateBasic4CertificationPercentage,
};
