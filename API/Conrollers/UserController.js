const Users = require("../../Data/Models/User");
const Roles = require("../../Data/Models/Roles");
const CustomResponse = require("../utils/CustomResponse");
const HttpError = require("../utils/HttpError");
const bycrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");

const RoleEnums = require("../../Data/Constants/RoleEnums");

const getUsers = async (req, res, next) => {
  try {
    let users = await Users.find();
    let response = new CustomResponse(users, "Succeeded", true);
    return response.SendToClient(res, 200);
  } catch (err) {
    console.log(err);
    next(new HttpError("Error While Fetching from database", 404, false));
  }
};

const getUserbyId = async (req, res, next) => {
  const { id } = req.params;
  try {
    let user;
    user = await Users.findById(id);
    if (user == null) next(new HttpError("User doesnt exist", 422, false));
    let response = new CustomResponse(user, "Succeeded", true);
    return response.SendToClient(res, 200);
  } catch (err) {
    next(new HttpError("Error While Fetching from database", 501, false));
  }
};

const Register = async (req, res, next) => {
  const { name, email, age, password } = req.body;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    var error = new HttpError("Validation Failed ", 422, false);
    return next(error);
  }
  let existingUser;
  try {
    existingUser = await Users.findOne({ email: email });
  } catch (err) {
    next(new HttpError("Error While Fetching from database", 501, false));
  }
  if (existingUser) {
    next(new HttpError("User Exists", 422, false));
  }
  let hashedPassword;
  try {
    hashedPassword = await bycrypt.hash(password, 12);
  } catch (err) {
    const error = new HttpError("Could not hash password", 500, false);
    return next(error);
  }
  const newUser = new Users({
    name,
    age,
    email,
    password: hashedPassword,
  });
  try {
    let role = await Roles.findOne({ name: RoleEnums.USER });
    newUser.role=role;
  } catch (err) {
    const error = new HttpError("Error while Fetching role", 500, false);
    return next(error);
  }
  try {
    await newUser.save();
  } catch (err) {
    const error = new HttpError(
      "Unknown Error occured while creating user",
      500,
      false
    );
    return next(error);
  }

  let token;
  try {
    token = jwt.sign(
      { userId: newUser.id, email: newUser.email },
      "tajni_string",
      { expiresIn: "1h" }
    );
  } catch (err) {
    const error = new HttpError("Error while creating token", 500, false);
    return next(error);
  }

  res.status(201);
  let response = new CustomResponse(
    { user: newUser, token: token },
    "User Created Successfully",
    true
  );
  return response.SendToClient(res, 201);
};

const LogIn = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    var error = new HttpError("Validation Failed ", 422, false);
    return next(error);
  }
  const { email, password } = req.body;
  let existingUser;
  try {
    existingUser = await Users.findOne({ email: email });
  } catch (err) {
    const error = new HttpError("Could not find the user", 500, false);
    return next(error);
  }

  if (!existingUser) {
    const error = new HttpError(
      "Could not find the user for the provided id",
      401,
      false
    );
    next(error);
  }
  let isValidPassword = false;
  try {
    isValidPassword = await bycrypt.compare(password, existingUser.password);
  } catch (err) {
    const error = new HttpError("Hashing failed", 500, false);
    next(error);
  }

  if (isValidPassword == false) {
    const error = new HttpError("Invalid Credentials", 401, false);
    next(error);
  }
  let token;
  try {
    token = jwt.sign(
      { userId: existingUser.id, email: existingUser.email,role:existingUser.role },
      "tajni_string",
      { expiresIn: "1h" }
    );
  } catch (err) {
    const error = new HttpError("Greska u jwt", 500, false);
    next(error);
  }
  let response = new CustomResponse(
    {
      userId: existingUser.id,
      email: existingUser.email,
      token: token,
      role:existingUser.role
    },
    "Successfully Logged In ",
    true
  );

  return response.SendToClient(res, 200);
};

module.exports.getUsers = getUsers;
module.exports.Register = Register;
module.exports.LogIn = LogIn;
