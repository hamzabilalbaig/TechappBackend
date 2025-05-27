const { sequelizeServer, baseUrl } = require("../configs/sequelize.config");
const { Op } = require("sequelize");

async function findNearestLocations(body) {
  const result = await sequelizeServer.query(
    `SELECT * FROM find_nearby_coordinates(:input_lat, :input_lon, :input_distance);`,
    {
      replacements: {
        input_lat: body?.input_lat,
        input_lon: body?.input_lon,
        input_distance: body?.input_distance
      },
      type: sequelizeServer.QueryTypes.SELECT,
    }
  );
  return result;
} 


module.exports = {
  findNearestLocations,
}
