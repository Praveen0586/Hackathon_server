const express = require("express");
const cors = require("cors");
const axios = require("axios");
const mongoose = require("./database"); // import the database connection

const userRoutes = require("./users"); // Import router
const geminjapi = require("./chatbot");



const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use("/users", userRoutes);
app.use("/chatbot", geminjapi)
// base route
app.get("/", (req, res) => {
    res.send("Server is running 🚀");
});

// repeat task: ping localhost:5000 every 10 seconds


const isLive = true;
const url = isLive ? "https://hackathon-server-18ab.onrender.com/" : "http://localhost:5000/";

setInterval(async () => {
    try {
        const res = await axios.get(url);
        console.log("✅ Ping Success:", res.data);
    } catch (err) {
        console.error("❌ Ping Failed:", err.message);
    }
}, 10000); // every 10s

// start server
app.listen(PORT, () => {
    console.log(`✅ Server running on http://localhost:${PORT}`);
});


