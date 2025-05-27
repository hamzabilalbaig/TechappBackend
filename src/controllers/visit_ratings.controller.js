const {
  changeRating,
  getRatings,
  getvisitRatingOfAFEById,
} = require("../services/visit_rating.services");

exports.createUpdateRating = async (req, res) => {
  try {
    const rating = await changeRating(req.body.visit_id, req);
    res.status(200).json({
      rating,
      message: "Thank you for rating the Visit",
      success: true,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

exports.getRating = async (req, res) => {
  try {
    const rating = await getRatings(req.params.id);
    res.status(200).json({
      rating,

      success: true,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};
exports.getRatingofFE = async (req, res) => {
  try {
    const rating = await getvisitRatingOfAFEById(req.params.id);
    res.status(200).json({
      rating,

      success: true,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};
