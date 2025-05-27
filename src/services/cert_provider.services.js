const { sequelizeServer, baseUrl } = require("../configs/sequelize.config");
const { Op } = require("sequelize");

async function getAllCertProviders() {
    return await sequelizeServer.models.cert_provider.findAll();
}

async function deleteCertProvider(id) {
    return await sequelizeServer.models.cert_provider.update(
        { is_valid: false },
        {
            where: { cert_provider_id: id },
        }
    );
}

async function addCertProvider(cert_provider) {
    return await sequelizeServer.models.cert_provider.create(cert_provider);
}

async function modifyCertProvider(id, cert_provider) {
    return await sequelizeServer.models.cert_provider.update(cert_provider, {
        where: { cert_provider_id: id },
    });
}

async function getCertProvidersByCertTypeId(id) {
    return await sequelizeServer.models.cert_provider.findAll({
        where: { cert_type_id: id, is_valid: true },
    });
}

module.exports = {
    getAllCertProviders,
    deleteCertProvider,
    addCertProvider,
    modifyCertProvider,
    getCertProvidersByCertTypeId
}