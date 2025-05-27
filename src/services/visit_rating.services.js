const { sequelizeServer } = require("../configs/sequelize.config");

async function changeRating(visit_id, req) {
  try {
    const check = await sequelizeServer.models.visit_ratings.findAll({
      where: { visit_id },
    });

    if (check.length !== 0) {
      const vr = await sequelizeServer.models.visit_ratings.update(
        {
          communication: req.body.communication,
          troubleshooting: req.body.troubleshooting,
          workmanship: req.body.workmanship,
          punctuality: req.body.punctuality,
          total_rating:
            req.body.communication +
            req.body.troubleshooting +
            req.body.workmanship +
            req.body.punctuality,
        },
        { where: { visit_id } }
      );
      return vr;
    } else {
      const vr = await sequelizeServer.models.visit_ratings.create({
        visit_id: visit_id,
        communication: req.body.communication,
        troubleshooting: req.body.troubleshooting,
        workmanship: req.body.workmanship,
        punctuality: req.body.punctuality,
        total_rating:
          req.body.communication +
          req.body.troubleshooting +
          req.body.workmanship +
          req.body.punctuality,
      });
      return vr;
    }
  } catch (error) {
    return error;
  }
}

async function getRatings(visit_id) {
  try {
    const rating = await sequelizeServer.models.visit_ratings.findAll({
      where: { visit_id },
    });
    return rating;
  } catch (error) {
    return error;
  }
}

async function getvisitRatingOfAFEById(field_engineer_id) {
  const Rating = await sequelizeServer.models.visits.findAll({
    include: "visit_ratings",

    where: {
      field_engineer_id: field_engineer_id,

      is_valid: true,
    },
    attributes: [],
  });

  let communication = 0;
  let communicationLength = 0;
  let troubleshooting = 0;
  let troubleshootingLength = 0;
  let workmanship = 0;
  let workmanshipLength = 0;
  let punctuality = 0;
  let punctualityLength = 0;
  let total_rating = 0;
  let total_ratingLength = 0;

  Rating.map((item) => {
    if (item?.visit_ratings?.communication) {
      communication += item?.visit_ratings?.communication;
      communicationLength += 1;
    }
    if (item?.visit_ratings?.troubleshooting) {
      troubleshooting += item?.visit_ratings?.troubleshooting;
      troubleshootingLength += 1;
    }
    if (item?.visit_ratings?.workmanship) {
      workmanship += item?.visit_ratings?.workmanship;
      workmanshipLength += 1;
    }
    if (item?.visit_ratings?.punctuality) {
      punctuality += item?.visit_ratings?.punctuality;
      punctualityLength += 1;
    }
    if (item?.visit_ratings?.total_rating) {
      total_rating += item?.visit_ratings?.total_rating;
      total_ratingLength += 1;
    }
  });
  const comm = communication / communicationLength;
  const troubleshoot = troubleshooting / troubleshootingLength;
  const work = workmanship / workmanshipLength;
  const punct = punctuality / punctualityLength;
  const total = total_rating / total_ratingLength;
  const rating = {
    communication: comm,
    troubleshooting: troubleshoot,
    workmanship: work,
    punctuality: punct,
    total_rating: total,
  };
  console.log(rating);
  return rating;
}
module.exports = {
  changeRating,
  getRatings,
  getvisitRatingOfAFEById,
};
