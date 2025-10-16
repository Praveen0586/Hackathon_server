const express = require("express");
const User = require("./schemas/userschemas"); // User model

const router = express.Router();

// // 1️⃣ Add new user
// router.post("/add", async (req, res) => {
//     console.log("User Creation ");
//     try {
//         const user = new User(req.body); // create new user
//         const savedUser = await user.save(); // save to DB
//         res.status(201).json({ message: "User created ✅", user: savedUser });
//     } catch (err) {
//         res.status(400).json({ message: "Error creating user ❌", error: err.message });
//     }
// });


router.post("/add", async (req, res) => {
    console.log("User Creation");
    try {
        const user = new User(req.body);
        const savedUser = await user.save();
        res.status(201).json(savedUser);  // ✅ Return user directly
    } catch (err) {
        console.error("❌ Error:", err);
        res.status(400).json({
            message: "Error creating user",
            error: err.message
        });
    }
});
router.get("/all", async (req, res) => {
    try {
        const users = await User.find({});
        res.status(200).json(users);
    } catch (err) {
        console.error("❌ Error fetching users:", err);
        res.status(500).json({ message: "Error fetching users", error: err.message });
    }
});


// 2️⃣ User Login
router.post("/login", async (req, res) => {
    console.log("User Login Attempt");
    try {
        const { email, password } = req.body;

        // Validate input
        if (!email || !password) {
            return res.status(400).json({
                message: "Email and password are required"
            });
        }

        // Find user by email
        const user = await User.findOne({ email: email.trim() });

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        // Check password (plain text comparison - NOT RECOMMENDED for production)
        if (user.password !== password) {
            return res.status(401).json({
                message: "Invalid password"
            });
        }

        // Login successful - return user data (excluding password)
        const userResponse = {
            _id: user._id,
            name: user.name,
            img: user.img,
            studentId: user.studentId,
            gender: user.gender,
            dep: user.dep,
            year: user.year,
            interests: user.interests,
            email: user.email
        };

        res.status(200).json(userResponse);
        console.log("✅ Login successful for:", email);

    } catch (err) {
        console.error("❌ Login Error:", err);
        res.status(500).json({
            message: "Server error during login",
            error: err.message
        });
    }
});
// 2️⃣ Edit user by studentId
router.put("/:id", async (req, res) => {
    try {
        const studentId = req.params.id;
        const updatedUser = await User.findOneAndUpdate(
            { studentId },
            { $set: req.body },
            { new: true } // return updated document
        );
        if (!updatedUser) {
            return res.status(404).json({ message: "User not found ❌" });
        }
        res.json({ message: "User updated ✅", user: updatedUser });
    } catch (err) {
        res.status(400).json({ message: "Error updating user ❌", error: err.message });
    }
});

// 3️⃣ (Optional) Get all users
router.get("/", async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (err) {
        res.status(500).json({ message: "Error fetching users ❌", error: err.message });
    }
});

// 4️⃣ (Optional) Get single user by studentId
router.get("/:id", async (req, res) => {
    try {
        const user = await User.findOne({ studentId: req.params.id });
        if (!user) {
            return res.status(404).json({ message: "User not found ❌" });
        }
        res.json(user);
    } catch (err) {
        res.status(500).json({ message: "Error fetching user ❌", error: err.message });
    }
});

module.exports = router;
