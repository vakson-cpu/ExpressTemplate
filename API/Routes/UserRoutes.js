const express=  require('express');
const UserController = require("../Conrollers/UserController")
const {check} = require('express-validator');
const router = express.Router();

router.get("/GetAll",UserController.getUsers);
router.post("/Register",[
check('password').matches("^(?=[A-Z])(?=.*\d).{7,}$"),
check('name').not().isEmpty().isLength({min:5}),
check('address').isEmail()
],
UserController.Register);
router.post("/Login",UserController.LogIn);

module.exports=router;