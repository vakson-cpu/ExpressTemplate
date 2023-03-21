const express = require("express");
const mongoose = require("mongoose");
const SeedingRoles = require("../Data/SeedRoles")


const ConnectToDatabase=async(app,PORT)=>{
return await mongoose
  .connect(
    `mongodb+srv://vakson12:omikron12345@hci.fmslwy1.mongodb.net/HCI?retryWrites=true&w=majority`
  )
  .then(() => {
    app.listen(PORT);
    console.log("Listening to Port:  ",PORT);
    // ()=>SeedingRoles;

  })
  .catch((err) => {
    console.log(err);
  });

}

module.exports =  ConnectToDatabase;


