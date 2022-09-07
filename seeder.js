const fs = require("fs");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const colors = require("colors");

//load env vars
dotenv.config({ path: "./config/config.env" });

//connect mongoose
mongoose.connect(process.env.MONGO_URI);

//load bootcamp model
const Bootcamp = require("./models/Bootcamp");

//read json files
const bootcamps = JSON.parse(
  fs.readFileSync(`${__dirname}/_data/bootcamps.json`, "utf-8")
);

//import into DB
const importData = async () => {
  try {
    await Bootcamp.create(bootcamps);
    console.log("Data Imported!".green.inverse);
    process.exit();
  } catch (err) {
    console.log(err);
  }
};

//delete from DB
const deleteData = async () => {
  try {
    await Bootcamp.deleteMany();
    console.log("Data Deleted!".red.inverse);
    process.exit();
  } catch (err) {
    console.log(err);
  }
};

if (process.argv[2] === "-i") {
  importData();
} else if (process.argv[2] === "-d") {
  deleteData();
}