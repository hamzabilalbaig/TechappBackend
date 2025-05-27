const { sequelizeServer, baseUrl } = require("../configs/sequelize.config");
const { Op } = require("sequelize");

async function getAllCertTypes() {
  return await sequelizeServer.models.cert_type.findAll();
}

async function deleteCertType(id) {
    return await sequelizeServer.models.cert_type.update(
        { is_valid: false },
        {
        where: { cert_type_id: id },
        }
    );
}

async function addCertType(cert_type) {
    return await sequelizeServer.models.cert_type.create(cert_type);
}

async function modifyCertType(id, cert_type) {
    return await sequelizeServer.models.cert_type.update(cert_type, {
        where: { cert_type_id: id },
    });
}


module.exports = {
    getAllCertTypes,
    deleteCertType,
    addCertType,
    modifyCertType,
}