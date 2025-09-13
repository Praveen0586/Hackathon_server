const mongoose = require("mongoose");

// replace <db_password> with your actual password
const DB_PASSWORD = "praveen1605";
const DB_NAME = "campusconnect"; // optional, depends on your cluster

const mongoURL = `mongodb+srv://praveen:${DB_PASSWORD}@cluster0.1yls0.mongodb.net/${DB_NAME}?retryWrites=true&w=majority&appName=Cluster0`;

mongoose.connect(mongoURL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => console.log("✅ MongoDB connected"))
    .catch(err => console.error("❌ MongoDB connection error:", err));

module.exports = mongoose;



