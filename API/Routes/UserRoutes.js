const express=  require('express');
const UserController = require("../Conrollers/UserController")
const router = express.Router();

router.get("/GetAll",UserController.getUsers)


module.exports=router;