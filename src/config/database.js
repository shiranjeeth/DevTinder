const mongoose = require("mongoose");

const connectionDB = async ()=>{
    await mongoose.connect("mongodb+srv://demo:admin@cluster1.cryjf.mongodb.net/?retryWrites=true&w=majority&appName=Cluster1/FirstBD");
}

module.exports = connectionDB;


