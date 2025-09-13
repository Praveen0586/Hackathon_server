const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// base route
app.get("/", (req, res) => {
    res.send("Server is running 🚀");
});

// repeat task: ping localhost:5000 every 10 seconds


const isLive = true;
const url = isLive ? "" : "http://localhost:5000/";

setInterval(async () => {
    try {
        const res = await axios.get(isLive);
        console.log("✅ Ping Success:", res.data);
    } catch (err) {
        console.error("❌ Ping Failed:", err.message);
    }
}, 10000); // every 10s

// start server
app.listen(PORT, () => {
    console.log(`✅ Server running on http://localhost:${PORT}`);
});


