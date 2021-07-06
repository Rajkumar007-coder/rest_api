const mongoose = require("mongoose");
require("dotenv").config();
const config = require("config");
const db = config.get("db")

mongoose.connect(`${db}` , {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() =>
{
    console.log("connection successful");
}).catch((e) =>
{
    console.log("No connection");
})