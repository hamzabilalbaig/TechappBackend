const { sequelizeServer, baseUrl } = require("../configs/sequelize.config");
const { Op } = require("sequelize");

async function getAllCertCategories() {
    return await sequelizeServer.models.cert_category.findAll();
}

async function deleteCertCategory(id) {
    return await sequelizeServer.models.cert_category.update(
        { is_valid: false },
        {
            where: { cert_category_id: id },
        }
    );
}

async function addCertCategory(cert_category) {
    return await sequelizeServer.models.cert_category.create(cert_category);
}

async function modifyCertCategory(id, cert_category) {
    return await sequelizeServer.models.cert_category.update(cert_category, {
        where: { cert_category_id: id },
    });
}

module.exports = {
    getAllCertCategories,
    deleteCertCategory,
    addCertCategory,
    modifyCertCategory,
}