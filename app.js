const express = require("express");
const ConnectToDatabase = require("./Configurations/Connection");
const ErrorHandling = require("./Middlewares/ErrorHandling");
const UserRoutes = require("./API/Routes/UserRoutes");
const PORT =5000;
const app = express();

app.use("/api/Users",UserRoutes);
app.use("/",(req,res,next)=>res.json("Failed route"))
app.use(ErrorHandling);
ConnectToDatabase(app,PORT);
