const { sequelizeServer, baseUrl } = require("../configs/sequelize.config");
const { Op } = require("sequelize");
var _loadash = require("lodash");
const { getFileExtension } = require("../utils/utils");
const { transporter } = require("../configs/mail.config");
const schedule = require("node-schedule");

const { promisify } = require("util");
const fs = require("fs");
var handlebars = require("handlebars");
const { encryptPass, decryptPass } = require("../utils/encryptionHandler");
const { USER_ATTRIBUES } = require("../utils/attributes");
const { Novu } = require("@novu/node");
const novu = new Novu(process.env.NOVU_API_KEY);
const readFile = promisify(fs.readFile);
let stream = require("getstream");
let client = stream.connect(
  process.env.GETSTREAM_API_KEY,
  process.env.GETSTREAM_APP_SECRET
);
async function GetAllRoles() {
  try {
    const roles = sequelizeServer.models.roles.findAll();
    return roles;
  } catch (error) {
    return error;
  }
}

async function GetAllUsers(user) {
  try {
    if (user?.user_type?.toLowerCase() == "admin") {
      const users = sequelizeServer.models.users.findAll({
        include: ["role", "vendor", "certifications"],
        where: { is_active: true },
      });
      return users;
    } else {
      const users = sequelizeServer.models.users.findAll({
        include: ["role", "vendor", "certifications"],
        where: { user_id: user.user_id, is_active: true },
      });
      return users;
    }
  } catch (err) {
    console.log(err);
  }
}

async function GetAllFieldEngineer() {
  try {
    const users = sequelizeServer.models.users.findAll({
      where: { is_active: true, user_role_id: 15 },
    });
    return users;
  } catch (err) {
    console.log(err);
  }
}

async function getAllUserByPaging(filters, user) {
  try {
    let users = [];
    if (user?.user_type?.toLowerCase() == "admin") {
      users = sequelizeServer.models.users.findAndCountAll({
        include: ["role", "vendor", "certifications"],
        limit: filters.limit,
        offset: filters.offset,
      });
      return users;
    }
    return users;
  } catch (error) {
    console.log(error);
  }
}

async function filterUsers(filters, user) {
  try {
    let users = [];
    //if (user?.user_type?.toLowerCase() == "admin") {
    users = await sequelizeServer.models.users.findAndCountAll({
     
      where: {
        full_name: {
          [Op.iLike]: `%${filters?.input}%`,
        },
      },
      include: ["role", "vendor"],
      limit: filters.limit,
      offset: filters.offset,
    });
    return users;
    //}
    //return users;
  } catch (error) {
    console.log(error);
  }
}

async function GetAllUsersWithoutAuth(user) {
  try {
    const users = sequelizeServer.models.users.findAll({
      include: ["role"],
      where: { is_active: true },
    });
    return users;
  } catch (err) {
    console.log(err);
  }
}

async function ProfilePicUpload(fileName, id) {
  const user = await sequelizeServer.models.users.findOne({
    where: { user_id: id },
  });
  const result = await sequelizeServer.models.users.update(
    { user_image: `userPic-${id}.${getFileExtension(fileName)}` },
    { where: { user_id: id } }
  );
  const setGetStreamAvatar = await client.user(user?.username).update({
    name: user?.full_name ?? user?.first_name + " " + user?.last_name,
    profileImage: `${baseUrl}/images/profile/${`userPic-${id}.${getFileExtension(
      fileName
    )}`}`,
    techAppUserId: id,
  });

  return result;
}

async function tourWatched(id) {
  const result = await sequelizeServer.models.users.update(
    { tour: true },
    { where: { user_id: id } }
  );
  return result;
}

async function tourWatchedfe(id) {
  const result = await sequelizeServer.models.users.update(
    { fe_tour: true },
    { where: { user_id: id } }
  );
  return result;
}

async function tourWatchedpm(id) {
  const result = await sequelizeServer.models.users.update(
    { pm_tour: true },
    { where: { user_id: id } }
  );
  return result;
}

async function changedPass(id, pass) {
  const result = await sequelizeServer.models.users.update(
    { changed_password: true, password: encryptPass(pass) },
    { where: { user_id: id } }
  );
  return result;
}

async function LicenceUpload(fileName, id) {
  const result = await sequelizeServer.models.users.update(
    {
      driver_license_attach: `userLicense-${id}.${getFileExtension(fileName)}`,
    },
    { where: { user_id: id } }
  );
  return result;
}

async function AddUser(user) {
  try {
    const userDb = await sequelizeServer.models.users.findOne({
      where: { work_email: user.work_email },
    });
    if (userDb != null) {
      throw "email";
    }
    let encryptedPass = encryptPass(user?.password);
    const d = Object.assign(user, { password: encryptedPass });
    let data = {
      USERNAME: user.work_email,
      PASSWORD: decryptPass(user.password),
      NAME: user.first_name + " " + user.last_name,
      baseURL: baseUrl,
      baseURLClient: process.env.CLIENT_APP_BASE_URL,
      subject: "TechApp Welcome Email",
    };

    var result = await sequelizeServer.models.users.create(d);

    if (user?.is_active) {
      await sequelizeServer.models.users_trades.create({
        user_id: result?.user_id,
        trade_id: 51,
        is_valid: true,
      });
    }
    if (user?.users_trades?.length > 0) {
      await sequelizeServer.models.users_trades.bulkCreate(
        user?.users_trades?.map((d) => {
          if (d?.value != 51) {
            return {
              user_id: id,
              trade_id: d?.value,
              is_valid: true,
            };
          }
        })
      );
    }
    const username = `${user?.first_name?.replace(
      /\s+/g,
      ""
    )}${user?.last_name?.replace(/\s+/g, "")}_${result?.user_id}`;

    const updatedUser = await sequelizeServer.models.users.update(
      { username: username },
      { where: { user_id: result?.user_id } }
    );
    if (updatedUser == 1) {
      client
        .user(username)
        .getOrCreate({
          name: user?.full_name ?? user?.first_name + " " + user?.last_name,
          profileImage: `${baseUrl}/images/profile/${user?.user_image}`,
          techAppUserId: result?.user_id,
        })
        .then((response) => {
          const resp = response;
          console.log(resp);
        })
        .catch((err) => {
          console.log(err);
        });
    }
    //send email
    // let html = await readFile(
    //   "public/UseEmailTemplates/imported-from-beefreeio.html",
    //   "utf8"
    // );
    // let template = handlebars.compile(html);

    // let htmlToSend = template(data);
    novu.trigger("welcome", {
      to: {
        subscriberId: `${result?.user_id}`,
        email: `${result?.work_email}`,
      },
      payload: data,
    });
    const admins = await sequelizeServer.models.users.findAll({
      where: { user_role_id: 1 },
    });
    let work_emailAdmins = [];
    if (admins.length > 0) {
      const adminWEmails = admins.map((admin) => {
        novu.trigger("welcome", {
          to: {
            subscriberId: admin?.user_id,
            email: admin?.work_email,
          },
          payload: data,
        });
        return admin?.work_email;
      });
      console.log(adminWEmails);
      work_emailAdmins = adminWEmails;
    }

    //send email
    // var mailOptions = {
    //   from: "TechApp Support support@techapp.co",
    //   to: [user?.work_email].concat(work_emailAdmins),
    //   subject: "Techapp Welcome Email",
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

    return result;
  } catch (error) {
    if (error == "email") {
      throw ". Email already exists. Please try a different email";
    }
    return error;
  }
}

async function UpdateUser(user, id) {
  try {
    const userDb = await sequelizeServer.models.users.findOne({
      where: {
        work_email: user.work_email,
        user_id: {
          [Op.not]: id,
        },
      },
    });
    if (userDb != null) {
      throw "email";
    }

    var result = sequelizeServer.models.users.update(user, {
      where: { user_id: id },
    });
    await sequelizeServer.models.users_trades.destroy({
      where: { user_id: id },
    });
    if (user?.is_active) {
      await sequelizeServer.models.users_trades.create({
        user_id: id,
        trade_id: 51,
        is_valid: true,
      });
    }
    if (user?.users_trades?.length > 0) {
      await sequelizeServer.models.users_trades.bulkCreate(
        user?.users_trades?.map((d) => {
          if (d?.value != 51) {
            return {
              user_id: id,
              trade_id: d?.value,
              is_valid: true,
            };
          }
        })
      );
    }

    client
      .user(user?.username)
      .update({
        name: user?.full_name ?? user?.first_name + " " + user?.last_name,
        profileImage: `${baseUrl}/images/profile/${user?.user_image}`,
        techAppUserId: id,
      })
      .then((d) => {
        console.log(d);
      });
    return result;
  } catch (error) {
    console.log(error);
    if (error == "email") {
      throw ". Email already exists. Please try a different email";
    }
    return error;
  }
}
async function updateUserOnlineStatus(user_id, status) {
  var result = await sequelizeServer.models.users.update(
    { online: status },
    {
      where: { user_id: user_id },
    }
  );
  return result;
}

async function updateUserLastSeen(user_id, status) {
  var result = await sequelizeServer.models.users.update(
    { last_seen: status },
    {
      where: { user_id: user_id },
    }
  );
  return result;
}

async function getUserLastSeen(user_id) {
  var result = await sequelizeServer.models.users.findOne({
    where: { user_id: user_id },
    attributes: ["last_seen"],
  });
  return result;
}

async function getUserOnlineStatus(user_id) {
  var result = await sequelizeServer.models.users.findOne({
    where: { user_id: user_id },
    attributes: ["online"],
  });
  return result;
}
async function DeleteUser(id) {
  try {
    var result = sequelizeServer.models.users.update(
      {
        is_active: false,
      },
      {
        where: { user_id: id },
      }
    );

    return result;
  } catch (error) {
    return error;
  }
}
async function sendNotification(user_id) {
  try {
    const result =
      await sequelizeServer.models.fe_user_driver_codes_mappings.findAll({
        where: { user_id: user_id, is_valid: true },
        include: ["user", "driver_code"],
      });

    const data = {
      pushContent: `${result?.length} Driver codes are added to your profile`,
      pushTitle: "Driver Code",
      first_name: result[0]?.user?.first_name,
      message: `${result?.length} driver codes are added to your profile.`,
      email: result[0]?.user?.work_email,
      driver_code: result?.map((x) => {
        return x?.driver_code;
      }),
      baseURL: baseUrl,
    };

    console.log(data);
    // let html = await readFile(
    //   "public/UseEmailTemplates/DriverCodeAddedToUserProfile.html",
    //   "utf8"
    // );
    // let template = handlebars.compile(html);

    // let htmlToSend = template(data, { allowProtoPropertiesByDefault: true });
    // // expected output: 1
    // var mailOptions = {
    //   from: "TechApp Support support@techapp.co",
    //   to: [data?.email],
    //   //to: "hamzabilalbaig@gmail.com",
    //   subject: `${result?.length} Driver codes are added to your profile`,
    //   html: htmlToSend,
    // };
    // const res = await transporter.sendMail(mailOptions);
    // console.log("sent", res);
    novu.trigger("drivercodetouserprofile", {
      to: {
        subscriberId: `${user_id}`,
        email: `${data?.email}`,
      },
      payload: {
        subject: `${result?.length} Driver codes are added to your profile`,
        first_name: data?.first_name,
        message: data?.message,
        driver_code: data?.driver_code,
        pushContent: `${result?.length} Driver codes are added to your profile`,
        pushTitle: "Driver Code",
      },
    });
    await sequelizeServer.models.notifications.create({
      user_id: `${user_id}`,
      title: data?.pushTitle,
      content: data?.pushContent,
      created_on: new Date(),
      read: false,
    });
  } catch (error) {
    console.log(error);
  }
}
async function AssignDriverCode(data) {
  try {
    const re =
      await sequelizeServer.models.fe_user_driver_codes_mappings.findAll({
        where: { user_id: data?.driverCodes?.user_id },
      });

    //let check = data?.driverCodes?.driverCodes.filter(b => re.findIndex(a => a.driver_codes_id === b.driver_codes_id) === -1);
    let removedCode = _loadash.differenceBy(
      re,
      data?.driverCodes?.driverCodes,
      "driver_codes_id"
    );

    let reAdded = _loadash.intersectionBy(
      re,
      data?.driverCodes?.driverCodes,
      "driver_codes_id"
    );

    let newlyAdded = _loadash.differenceBy(
      data?.driverCodes?.driverCodes,
      re,
      "driver_codes_id"
    );
    var transactionResult = await sequelizeServer.transaction(async (t) => {
      // await sequelizeServer.models.fe_user_driver_codes_mappings.destroy({
      //   where: { user_id: data?.driverCodes?.user_id },
      // });
      if (reAdded?.length > 0) {
        reAdded?.forEach(async (d) => {
          await sequelizeServer.models.fe_user_driver_codes_mappings.update(
            { is_valid: true },
            {
              where: {
                driver_codes_id: d?.driver_codes_id,
                user_id: data?.driverCodes?.user_id,
              },
            }
          );
        });
      }
      if (removedCode?.length > 0) {
        removedCode?.forEach(async (d) => {
          await sequelizeServer.models.fe_user_driver_codes_mappings.update(
            { is_valid: false },
            {
              where: {
                driver_codes_id: d?.driver_codes_id,
                user_id: data?.driverCodes?.user_id,
              },
            }
          );
        });
      }
      if (newlyAdded?.length > 0) {
        await sequelizeServer.models.fe_user_driver_codes_mappings.bulkCreate(
          newlyAdded
        );
        sendNotification(data?.driverCodes?.user_id);
      }
      // var result =

      // return result;
    });
    return transactionResult;
  } catch (error) {
    return error;
  }
}

async function GetAssignedDriverCodes(user_id) {
  try {
    var result =
      await sequelizeServer.models.fe_user_driver_codes_mappings.findAll({
        where: { user_id: user_id, is_valid: true },
        include: ["user", "driver_code"],
      });

    return result;
  } catch (error) {
    return error;
  }
}

async function GetPermissions(userId) {
  try {
    const user = await sequelizeServer.models.users.findOne({
      where: { user_id: userId },
    });
    const permissions = await sequelizeServer.models.permissions_roles.findAll({
      where: { role_id: user.toJSON().user_role_id },
    });
    return permissions;
  } catch (err) {
    console.log(err);
  }
}

async function GetUserByUserID(userID) {
  const user = await sequelizeServer.models.users.findOne({
    where: { user_id: userID },
    include: [
      "role",
      "vendor",
      {
        model: sequelizeServer.models.certifications,
        as: "certifications",
        include: [
          "certificates",
          {
            model: sequelizeServer.models.users,
            attributes: [
              "user_id",
              "first_name",
              "last_name",
              "email",
              "company",
              "position",
              "cell_phone",
              "state",
              "changed_password",
              "tour",
            ],
            as: "user",
          },
        ],
      },
    ],
  });
  return {
    firstName: user.first_name,
    lastName: user.last_name,
    email: user.email,
    work_email: user?.work_email,
    streetAddress: user.street_address,
    city: user.city,
    certifications: user?.certifications,
    state: user.state,
    country: user.country,
    county: user.county,
    userImage: user.user_image,
    user_type: user.role?.role_name,
    role_id: user.role?.role_id,
    user_id: userID,
    tour: user.tour,
    fe_tour: user.fe_tour,
    pm_tour: user.pm_tour,
    changed_password: user.changed_password,
  };
}

async function GetUserAllDetails(userID, userr) {
  let filter = { user_id: userID };
  if (
    userr?.user_type?.toLowerCase() == "field engineer" ||
    userr?.user_type?.toLowerCase() == "project manager"
  ) {
    filter = { user_id: userID, is_active: true };
  }
  const user = await sequelizeServer.models.users.findOne({
    where: filter,
    include: [
      "vendor",
      "role",
      "driver_codes",
      {
        model: sequelizeServer.models.certifications,
        as: "certifications",
        include: [
          "certificates",
          {
            model: sequelizeServer.models.users,
            attributes: USER_ATTRIBUES,
            as: "user",
          },
        ],
      },
      {
        model: sequelizeServer.models.users_trades,
        as: "users_trades",
        include: [
          {
            model: sequelizeServer.models.trades,
            where: { is_valid: true },
            as: "trade",
          },
        ],
        where: { is_valid: true },
        required: false,
      },
    ],
  });
  if (!user) {
    return null;
  }
  client
    .user(user?.username)
    .getOrCreate({
      name: user?.full_name ?? user?.first_name + " " + user?.last_name,
      profileImage: `${baseUrl}/images/profile/${user?.user_image}`,
      techAppUserId: user?.user_id,
    })
    .then((response) => {
      const resp = response;
      console.log(resp);
    })
    .catch((err) => {
      console.log(err);
    });
  return {
    user_id: user.user_id,
    first_name: user.first_name,
    last_name: user.last_name,
    email: user.email,
    username: user?.username,
    street_address: user.street_address,
    city: user.city,
    state: user.state,
    country: user.country,
    county: user.county,
    user_image: user.user_image,
    //password: user.password,
    user_role_id: user.user_role_id,
    certifications: user?.certifications,
    //confirm_password: user.confirm_password,
    xs_issue_date: user.xs_issue_date,
    xs_expiration_date: user.xs_expiration_date,
    salary_rate: user.salary_rate,
    hourly_rate: user.hourly_rate,
    wc_issue_date: user.wc_issue_date,
    wc_expiration_date: user.wc_expiration_date,
    day_rate: user.day_rate,
    termination_date: user.termination_date,
    pl_issue_date: user.pl_issue_date,
    pl_expiration_date: user.pl_expiration_date,
    gl_issue_date: user.gl_issue_date,
    gl_expiration_date: user.gl_expiration_date,
    transport_fee: user.transport_fee,
    vendor_record_id: user.vendor_record_id,
    auto_issue_date: user.auto_issue_date,
    auto_expiration_date: user.auto_expiration_date,
    onboarding_date: user.onboarding_date,
    emergency_name: user.emergency_name,
    emergency_contact_number: user.emergency_contact_number,
    driver_license_number: user.driver_license_number,
    dl_state: user.dl_state,
    dl_exp: user.dl_exp,
    commercial_dl: user.commercial_dl,
    id_badge_exp: user.id_badge_exp,
    reports_to: user.reports_to,
    re_mob: user.re_mob,
    work_order_exp: user.work_order_exp,
    tax_type: user.tax_type,
    duns: user.duns,
    cage_code: user.cage_code,
    diversity_classification: user.diversity_classification,
    commercial_ins: user.commercial_ins,
    gl_limit: user.gl_limit,
    automobile_ins: user.automobile_ins,
    auto_limit: user.auto_limit,
    umbrella_ins: user.umbrella_ins,
    xs_limit: user.xs_limit,
    wc_ins: user.wc_ins,
    wc_limit: user.wc_limit,
    professional_liab_ins: user.professional_liab_ins,
    pl_limit: user.pl_limit,
    coi_notes: user.coi_notes,
    msa_and_coi: user.msa_and_coi,
    company_classification: user.company_classification,
    bank: user.bank,
    payment_address: user.payment_address,
    routing_number: user.routing_number,
    account_number: user.account_number,
    zoho_access: user.zoho_access,
    comments: user.comments,
    reason_for_inactive: user.reason_for_inactive,
    notes: user.notes,
    address: user.address,
    full_name: user.full_name,
    expiring_soon: user.expiring_soon,
    expiring_soon_gc: user.expiring_soon_gc,
    driver_license_attach: user.driver_license_attach,
    work_order: user.work_order,
    vendor_sp_link: user.vendor_sp_link,
    customer_company: user.customer_company,
    related_project: user.related_project,
    operators: user.operators,
    qbk_id: user.qbk_id,
    safety_cert_record: user.safety_cert_record,
    records: user.records,
    trades: user.trades,
    website: user.website,
    gc_licenses: user.gc_licenses,
    vendor_status: user.vendor_status,
    vendor_category: user.vendor_category,
    company: user.company,
    position: user.position,
    work_email: user.work_email,
    id_card: user.id_card,
    cell_phone: user.cell_phone,
    alt_phone: user.alt_phone,
    region: user.region,
    project_name: user.project_name,
    active_states: user.active_states,
    ein_social: user.ein_social,
    monthly_rate: user.monthly_rate,
    expected_rate: user.expected_rate,
    user_type: user.user_type,
    booker_name: user.booker_name,
    booker_address: user.booker_address,
    booker_phone: user.booker_phone,
    booker_email: user.booker_email,
    name_of_carrier: user.name_of_carrier,
    name_of_carrier_automobile: user.name_of_carrier_automobile,
    name_of_carrier_umbrella: user.name_of_carrier_umbrella,
    name_of_carrier_wc: user.name_of_carrier_wc,
    name_of_carrier_professional: user.name_of_carrier_professional,
    postal_code: user.postal_code,
    rate_type: user.rate_type,
    vendor_id: user.vendor_id,
    vendor: user.vendor,
    driver_codes: user.driver_codes,
    role: user?.role,
    is_active: user?.is_active,
    street_address_two: user?.street_address_two,
    users_trades: user?.users_trades?.map((d) => {
      return { label: d?.trade?.trade_name, value: d?.trade_id };
    }),
    tagline: user?.tagline,
    bio: user?.bio,
    shared_location: user?.shared_location,
    altitude: user?.altitude,
    speed: user?.speed,
    facebook: user?.facebook,
    instagram: user?.instagram,
    linkedIn: user?.linkedIn,
    google: user?.google,
    other_link: user?.other_link,
    work_email_verified: user?.work_email_verified,
  };
}

async function sendNotificationdl(data) {
  try {
    let user = await sequelizeServer.models.users.findOne({
      where: {
        user_id: data.user_id,
      },
    });
    let html = await readFile(
      "public/UseEmailTemplates/driver-license-email.html",
      "utf8"
    );
    // let template = handlebars.compile(html);
    let d = {
      subject: `Driver License Expiration Update : ${user?.full_name} - ${user?.dl_exp}`,
      baseURL: process.env.CLIENT_APP_BASE_URL,
      full_name: user?.full_name,
      dl_exp: user?.dl_exp,
      driver_license_number: user?.driver_license_number,
      link: `${process.env.CLIENT_APP_BASE_URL}/profile/${user?.user_id}`,
      pushContent: `Driver License Expiration Update : ${user?.full_name} - ${user?.dl_exp}`,
      pushTitle: "Driver License",
    };

    novu.trigger("dl-expire", {
      to: {
        subscriberId: `${user?.user_id}`,
        email: `${user?.work_email}`,
      },
      payload: d,
    });
    await sequelizeServer.models.notifications.create({
      user_id: `${user?.user_id}`,
      title: d?.pushTitle,
      content: d?.pushContent,
      created_on: new Date(),
      read: false,
    });
    // let htmlToSend = template(d);
    // // expected output: 1
    // var mailOptions = {
    //   from: "TechApp Support support@techapp.co",
    //   to: [d?.work_email],
    //   // to: "hamzabilalbaig@gmail.com",
    //   subject: `Driver License Expiration Update : ${d?.full_name} - ${d?.dl_exp}`,
    //   html: htmlToSend,
    // };
    // const result = await transporter.sendMail(mailOptions);
    // console.log("sent", result);
  } catch (error) {
    // closes iterator, triggers return

    console.log(error);
  }
}

async function checkingapi() {
  try {
    console.log("The answer to life, the universe, and everything!");
    let certData = [];
    const dataArr = await sequelizeServer.models.users.findAll();
    dataArr.map((data) => {
      if (data?.dl_exp) {
        const date1 = new Date(data?.dl_exp);
        const date2 = new Date();
        const diffInTime = date1.getTime() - date2.getTime();
        const diffInDays = Math.ceil(diffInTime / (1000 * 3600 * 24));
        if (data?.is_active) {
          if (diffInDays < 30) {
            sendNotificationdl(data);
          }
        }
      }
    });
  } catch (error) {
    return error;
  }
}

async function reverifyEmail(id, verifyy) {
  try {
    const verify = await sequelizeServer.models.users.update(
      { work_email_verified: verifyy },
      { where: { user_id: id } }
    );
    return verify;
  } catch (error) {
    return error;
  }
}

async function verifyEmail(id) {
  try {
    const verify = await sequelizeServer.models.users.update(
      { work_email_verified: true },
      { where: { user_id: id } }
    );
    return verify;
  } catch (error) {
    return error;
  }
}

async function checkEmailVerification(id, email, oldEmail) {
  try {
    const verify = await sequelizeServer.models.users.findOne({
      where: { user_id: id, work_email_verified: true },
    });
    if (verify) {
      return true;
    }
    return false;
  } catch (error) {
    return error;
  }
}
async function sendEmailVerificationEmail(id, email) {
  try {
    const verify = await sequelizeServer.models.users.update(
      { work_email_verified: false },
      { where: { user_id: id } }
    );
    await novu.trigger("account-activation", {
      to: {
        subscriberId: `${id}`,
        email: `${email}`,
      },
      payload: {
        confirmationLink: `${process.env.CLIENT_APP_BASE_URL}/verify-email/${id}`,
      },
    });
  } catch (error) {
    console.log(error);
  }
}
// '00 00 12 * * 0-6' runs after a day
// */2 * * * * runs after every 2 minutes
schedule.scheduleJob(
  { hour: 9, minute: 0, dayOfWeek: 1, tz: "America/New_York" },
  async function () {
    console.log("The answer to life, the universe, and everything!");
    let certData = [];
    const dataArr = await sequelizeServer.models.users.findAll();
    dataArr.map((data) => {
      if (data?.dl_exp) {
        const date1 = new Date(data?.dl_exp);
        const date2 = new Date();
        const diffInTime = date1.getTime() - date2.getTime();
        const diffInDays = Math.ceil(diffInTime / (1000 * 3600 * 24));
        if (data?.is_active) {
          if (diffInDays < 30) {
            sendNotificationdl(data);
          }
        }
      }
    });
  }
);

module.exports = {
  GetAllFieldEngineer,
  GetUserAllDetails,
  GetAllUsers,
  AddUser,
  UpdateUser,
  DeleteUser,
  GetPermissions,
  ProfilePicUpload,
  GetAllRoles,
  GetUserByUserID,
  LicenceUpload,
  GetAllUsersWithoutAuth,
  getAllUserByPaging,
  filterUsers,
  AssignDriverCode,
  GetAssignedDriverCodes,
  sendNotification,
  sendNotificationdl,
  checkingapi,
  tourWatched,
  changedPass,
  tourWatchedfe,
  tourWatchedpm,
  updateUserOnlineStatus,
  getUserOnlineStatus,
  updateUserLastSeen,
  getUserLastSeen,
  verifyEmail,
  checkEmailVerification,
  sendEmailVerificationEmail,
  reverifyEmail,
};
