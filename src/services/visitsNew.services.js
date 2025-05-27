const { sequelizeServer } = require("../configs/sequelize.config");

const fs = require("fs");
const { getFileExtension } = require("../utils/utils");
const visits = require("../models/visits");

async function AllVisits(user) {
  try {
    const visits = await sequelizeServer.models.tower_visits.findAll({
      include: [
        "tower_visits_pictures",
        {
          model: sequelizeServer.models.users,
          attributes: [
            "user_id",
            "first_name",
            "last_name",
            "email",
            "rate_type",
          ],
          as: "field_engineer",
        },
        {
          model: sequelizeServer.models.tickets,
          include: [
            {
              model: sequelizeServer.models.projects,
              as: "project",
              include: ["project_managers", "users","sites"],
            },
          ],
          as: "ticket",
        },
      ],
    });
    
    return visits;
  } catch (err) {
    console.log(err);
  }
}

async function getVisitsByID(id) {
  const result = await sequelizeServer.models.tower_visits.findOne({
    include: [
      "tower_visits_pictures",
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
          "rate_type",
          "hourly_rate",
          "salary_rate",
          "day_rate",
          "monthly_rate",
        ],
        as: "field_engineer",
      },
      {
        model: sequelizeServer.models.tickets,
        include: [
          {
            model: sequelizeServer.models.projects,
            as: "project",
            include: ["project_managers", "users","sites"],
          },
        ],
        as: "ticket",
      },
    ],
    where: {
      id: id,
    },
  });
  return result;
}
//talonView_screenshot,png
async function AddVisit(visit) {
  try {
    let r_id = 0;

    const lastVisitR_ID = await sequelizeServer.models.tower_visits.findOne({
      order: [["id", "DESC"]],
    });
    if (lastVisitR_ID?.r_id != null) {
      let lastRid = parseInt(lastVisitR_ID?.r_id.slice(1));
      lastRid = lastRid + 1;
      r_id = lastRid;

      const visits = sequelizeServer.models.tower_visits.create({
        visit_id: `${visit?.s_id}_V${r_id}`,
        market: visit?.market,
        lat_long: visit?.lat_long,
        employee_email: visit?.employee_email,
        scheduled_date: visit?.scheduled_date,
        cm: visit?.cm,
        pm_status: visit?.pm_status,
        driver_code: visit?.driver_code,
        billable: visit?.billable,
        gc: visit?.gc,
        btse: visit?.btse,
        cr_number: visit?.cr_number,
        scope_activity: visit?.scope_activity,
        scope_completed: visit?.scope_completed,
        issue_encountered: visit?.issue_encountered,
        materials_used: visit?.materials_used,
        time_in: visit?.time_in,
        time_out: visit?.time_out,
        on_site_time: visit?.on_site_time,
        revisit_required: visit?.revisit_required,
        active_alarms_checkout: visit?.active_alarms_checkout,
        talonView_screenshot: visit?.talonView_screenshot,
        mla_checkin: visit?.mla_checkin,
        mla_checkout: visit?.mla_checkout,
        outage_type: visit?.outage_type,
        nest_status: visit?.nest_status,
        nestIn_screenshot: visit?.nestIn_screenshot,
        nest_duration: visit?.nest_duration,
        nestOut_screenshot: visit?.nestOut_screenshot,
        jsa: visit?.jsa,
        timeIn_location: visit?.timeIn_location,
        timeOut_location: visit?.timeOut_location,
        complete_site_picture: visit?.complete_site_picture,
        mla_sign_picture: visit?.mla_sign_picture,
        compound_shelter: visit?.compound_shelter,
        pre_photos: visit?.pre_photos,
        pre_cabinet: visit?.pre_cabinet,
        pre_covp_bottom: visit?.pre_covp_bottom,
        pre_covp_top: visit?.pre_covp_top,
        pre_battery_cabinet: visit?.pre_battery_cabinet,
        pre_alpha_RRU: visit?.pre_alpha_RRU,
        pre_beta_RRU: visit?.pre_beta_RRU,
        pre_gamma_RRU: visit?.pre_gamma_RRU,
        rating: visit?.rating,
        eod_send: visit?.eod_send,
        site_id: visit?.site_id,
        r_id: `V${r_id}`,
        post_photos: visit?.post_photos,
        post_cabinet: visit?.post_cabinet,
        post_covp_bottom: visit?.post_covp_bottom,
        post_covp_top: visit?.post_covp_top,
        post_battery_cabinet: visit?.post_battery_cabinet,
        post_alpha_RRU: visit?.post_alpha_RRU,
        post_beta_RRU: visit?.post_beta_RRU,
        post_gamma_RRU: visit?.post_gamma_RRU,
        field_engineer_id: visit?.field_engineer_id,
        eod: visit?.eod,
        units_of_work: visit?.units_of_work,
        ticket_id: visit?.ticket_id,
      });
      return visits;
    } else {
      throw "R ID cannot be 0";
    }
  } catch (err) {
    console.log(err);
  }
}

async function AddVisitImages(visit_images) {
  try {
    const visits = await sequelizeServer.models.tower_visits_pictures.create({
      visit_id: parseInt(visit_images?.body.visit_id),
      image: visit_images?.file.filename,
      title: visit_images?.body?.title,
      description: visit_images?.body?.description,
    });
    return visits;
  } catch (err) {
    console.log(err);
  }
}
async function UpdateVisitImages(visit, id) {
  try {
    const visits = sequelizeServer.models.tower_visits_pictures.update(
      {
        visit_id: parseInt(visit?.body.visit_id),
        image: visit?.file.filename,
        title: visit?.body?.title,
        description: visit?.body?.description,
      },
      {
        where: { id: parseInt(visit?.body.visit_Pic_id) },
      }
    );
    return visits;
  } catch (err) {
    console.log(err);
  }
}
async function UpdateVisit(visit, id) {
  try {
    const visits = sequelizeServer.models.tower_visits.update(visit, {
      where: { id: id },
    });
    return visits;
  } catch (err) {
    console.log(err);
  }
}

async function DeleteVisit(id) {
  try {
    const visits = sequelizeServer.models.tower_visits.destroy({
      where: { id: id },
    });
    return visits;
  } catch (err) {
    console.log(err);
  }
}

async function addNewVisit(visit) {
  try {
    const lastVisitR_ID = sequelizeServer.models.tower_visits.findOne({
      order: [["id", "DESC"]],
    });
    console.log(lastVisitR_ID);
    // const visits = sequelizeServer.models.tower_visits.create(visit);
    return visit;
  } catch (err) {
    console.log(err);
  }
}

// async function recordVisit(visit){
//   const 
// }

module.exports = {
  AllVisits,
  AddVisit,
  UpdateVisit,
  DeleteVisit,
  addNewVisit,
  AddVisitImages,
  UpdateVisitImages,
  getVisitsByID,
};
