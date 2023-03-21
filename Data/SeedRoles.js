const Roles = require("./Models/Roles");
const RoleEnums = require("../Data/Constants/RoleEnums")
const RolesToSeed = [{ name:RoleEnums.USER }, { name: RoleEnums.ADMINISTRATOR }];
const HttpError =  require("../API/utils/HttpError");


const seedRolesTable = async () => {
  try {
    for (let role of RolesToSeed) {
      let existingRole = await Roles.findOne({ name: role.name });
      if (existingRole == null || existingRole == undefined) {
        let newRole = new Roles(role);
        await newRole.save();
      }
    }
  } catch (err) {
    let error = new HttpError(err,500,false);
    console.log(err);
    return error;
  }
};

module.exports = seedRolesTable;
