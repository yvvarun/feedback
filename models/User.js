const mongoose = require("mongoose");
const { Schema } = mongoose; //this is equivalent to const Schema = mongoose.Schema

const userSchema = new Schema({
  googleId: String
});

//creating a new collection called "users"
//this collection is created only if "users" doesn't exist already
//in the database
mongoose.model("users", userSchema);
