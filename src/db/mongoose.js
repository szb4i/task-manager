const mongoose = require("mongoose");

const connectionURL = process.env.MONGODB_URL;

mongoose.set("strictQuery", true);
mongoose.connect(connectionURL);
