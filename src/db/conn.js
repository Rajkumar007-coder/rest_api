const mongoose = require("mongoose");

mongoose.connect(process.env.MONGO_URL, {
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