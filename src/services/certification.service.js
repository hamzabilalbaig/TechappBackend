const { sequelizeServer, baseUrl } = require("../configs/sequelize.config");
const { USER_ATTRIBUES } = require("../utils/attributes");
const { Op } = require("sequelize");
const fs = require("fs");
const schedule = require("node-schedule");
const { expiryDays } = require("../utils/utils");
const { transporter } = require("../configs/mail.config");
const { Novu } = require("@novu/node");
const novu = new Novu(process.env.NOVU_API_KEY);
async function getNextCertificationID() {
  const id = await sequelizeServer.query(
    "SELECT nextval('certifications_id_seq')"
  );
  return id[0][0];
}

async function addNewCertification(certification) {
  const result = await sequelizeServer.models.certifications.create(
    certification
  );
  return result;
}

async function modifyCertification(id, certification) {
  const result = await sequelizeServer.models.certifications.update(
    certification,
    {
      where: { id: id },
    }
  );
  return result;
}

async function removeCertification(id) {
  const result = await sequelizeServer.models.certifications.destroy({
    where: { id: id },
  });

  return result;
}

async function addCertificate(certificate) {
  let jsonData = JSON.parse(certificate?.value);

  if (certificate?.createOrUpdate === "Create") {
    const result = await sequelizeServer.models.certificates.create({
      certification_id: certificate?.certification_id,
      certification_type: certificate?.certification_type,
      name: certificate?.name,
      value: jsonData,
    });
    return result;
  } else {
    const result = await sequelizeServer.models.certificates.update(
      {
        certification_id: certificate?.certification_id,
        certification_type: certificate?.certification_type,
        name: certificate?.name,
        value: jsonData,
      },
      {
        where: { id: certificate?.createOrUpdate },
      }
    );
    return result;
  }
  return null;
}

async function getCertificate(certification_id, name) {
  const result = await sequelizeServer.models.certificates.findOne({
    where: {
      certification_id: certification_id,
      name: name,
    },
  });
  return result;
}

async function getCertificationByID(id) {
  const result = await sequelizeServer.models.certifications.findOne({
    include: [
      "certificates",
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
        ],
        as: "user",
      },
    ],
    where: {
      id: id,
    },
  });
  return result;
}

async function getCertificationByUserID(id) {
  try {
    const result = await sequelizeServer.models.users.findOne({
      where: {
        user_id: id,
      },
    });
    return result;
  } catch (error) {
    return error;
  }
}

async function removeCertificate(cert_id) {
  const result = await sequelizeServer.models.certificates.destroy({
    where: {
      id: cert_id,
    },
  });
  return result;
}

async function allCertification() {
  const certifications = await sequelizeServer.models.certifications.findAll({
    include: [
      "certifications_files",
      "certificates",
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
          "is_active",
        ],
        as: "user",
      },
    ],
    where: { is_valid: true },
  });
  return certifications;
}

async function allCertificationByPaging(filters) {
  const certifications =
    await sequelizeServer.models.certifications.findAndCountAll({
      include: [
        "certifications_files",
        "certificates",
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
          ],
          as: "user",
        },
      ],
      where: { is_valid: true },
      offset: filters.offset,
      limit: filters.limit,
      distinct: "certifications.id",
    });
  return certifications;
}

async function filterCertification(filters) {
  const certifications =
    await sequelizeServer.models.certifications.findAndCountAll({
      include: [
        "certifications_files",
        "certificates",
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
          ],
          as: "user",
          where: {
            full_name: {
              [Op.iLike]: `%${filters?.input}%`,
            },
          },
        },
      ],
      where: { is_valid: true },
      offset: filters.offset,
      limit: filters.limit,
    });
  return certifications;
}

const { promisify } = require("util");

const readFile = promisify(fs.readFile);

var handlebars = require("handlebars");

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

async function checkingapi() {
  let certData = [];
  const dataArr = await allCertification();
  dataArr.forEach((data) => {
    if (data?.certificates.length > 0) {
      data?.certificates?.map((d, i) => {
        if (data?.user?.is_active) {
          if (expiryDays(d?.value[`${d?.name}_Expires`]) < 30) {
            certData.push({
              subject: `Cert Expiration Update : ${data?.user?.first_name} ${
                data?.user?.last_name
              } - ${d?.name} - ${d?.value[`${d?.name}_Expires`]}`,
              user_id: data?.user?.user_id,
              certId: data?.id,
              downloads: d?.value["download"],
              baseURL: baseUrl,
              certName: d?.name,
              userName: `${data?.user?.first_name} ${data?.user?.last_name}`,
              email: data?.user?.work_email,
              expirey: `${d?.value[`${d?.name}_Expires`]}`,
            });
          }
        }
      });
    }
  });
  console.log(certData);
  sendNotification(certData);
  return null;
}

// '00 00 12 * * 0-6' runs after a day
// */2 * * * * runs after every 2 minutes
// schedule.scheduleJob(
//   { hour: 9, minute: 0, dayOfWeek: 1, tz: "America/New_York" },
//   async function () {
//     console.log("The answer to life, the universe, and everything!");
//     let certData = [];
//     const dataArr = await allCertification();
//     dataArr.forEach((data) => {
//       if (data?.certificates.length > 0) {
//         data?.certificates?.map((d, i) => {
//           if (data?.user?.is_active) {
//             if (expiryDays(d?.value[`${d?.name}_Expires`]) < 30) {
//               certData.push({
//                 subject: `Cert Expiration Update : ${data?.user?.first_name} ${
//                   data?.user?.last_name
//                 } - ${d?.name} - ${d?.value[`${d?.name}_Expires`]}`,
//                 user_id: data?.user?.user_id,
//                 certId: data?.id,
//                 downloads: d?.value["download"],
//                 baseURL: baseUrl,
//                 certName: d?.name,
//                 userName: `${data?.user?.first_name} ${data?.user?.last_name}`,
//                 email: data?.user?.work_email,
//                 expirey: `${d?.value[`${d?.name}_Expires`]}`,
//               });
//             }
//           }
//         });
//       }
//     });
//     console.log(certData);
//     sendNotification(certData);
//   }
// );
module.exports = {
  checkingapi,
  getNextCertificationID,
  addNewCertification,
  modifyCertification,
  removeCertification,
  addCertificate,
  removeCertificate,
  allCertification,
  getCertificate,
  getCertificationByID,
  getCertificationByUserID,
  allCertificationByPaging,
  filterCertification,
};
