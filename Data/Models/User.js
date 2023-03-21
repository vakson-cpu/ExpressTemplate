const mongoose = require("mongoose");
// const uniqueValidator = require("mongoose-unique-validator");
const Schema = mongoose.Schema;

const userShema = new Schema({
  name: { type: String, required: true },
  age: { type: Number, required: true },
  email:{type: String,required:true},
  password:{type:String,required:true},
  role: { type: mongoose.Schema.Types.ObjectId, ref: 'Role' }
});
module.exports = mongoose.model("User", userShema);