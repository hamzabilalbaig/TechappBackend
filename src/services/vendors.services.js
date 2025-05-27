const { sequelizeServer } = require("../configs/sequelize.config");

async function InsertVendor(vendor) {
  const result = sequelizeServer.models.vendors.create(vendor);
  return result;
}

async function EditVendor(vendor, id) {
  var result = sequelizeServer.models.vendors.update(vendor, {
    where: { vendor_id: id },
  });
  return result;
}

async function GetVendors(user) {
  if (user?.user_type?.toLowerCase() == "field engineer") {
    var result = await sequelizeServer.models.vendors.findAll({
      include: ["primary_user", "vendor_users"],
    });
    return result?.filter(
      (vendor) => vendor.vendor_primary_user == user.user_id
    );
  } else {
    var result = await sequelizeServer.models.vendors.findAll({
      include: ["primary_user", "vendor_users"],
    });
    return result;
  }
}

async function RemoveVendor(id) {
  var result = sequelizeServer.models.vendors.destroy({
    where: { vendor_id: id },
  });
  return result;
}
module.exports = {
  InsertVendor,
  EditVendor,
  GetVendors,
  RemoveVendor,
};
