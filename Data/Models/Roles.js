const mongoose = require("mongoose");
// const uniqueValidator = require("mongoose-unique-validator");
const Schema = mongoose.Schema;

const roleSchema = new mongoose.Schema({
    name: { type: String, required: true },
    users: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
  });
  
module.exports = mongoose.model("Role", roleSchema);