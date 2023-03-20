const Users = require("../../Data/Models/User");
const CustomResponse = require("../utils/CustomResponse");
const HttpError = require("../utils/HttpError");

const getUsers = async (req, res, next) => {
  try {
    let users = await Users.find();
    let response = new CustomResponse(users, "Succeeded", true);
    return res.json(response);
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
    res.status = 200;
    let response = new CustomResponse(user, "Succeeded", true);
    return res.json(response);
  } catch (err) {
    next(new HttpError("Error While Fetching from database", 501, false));
  }
};

const Register = async (req, res, next) => {
  const { name, email, age, password } = req.body;
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
    const error = new HttpError("Could not create user,try again", 500, false);
    return next(error);
  }
  const newUser = new Users({
    name,
    age,
    email,
    password: hashedPassword,
  });
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
  return response;
};

module.exports.getUsers = getUsers;
