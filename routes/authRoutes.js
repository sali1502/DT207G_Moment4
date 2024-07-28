/* Moment 4, DT207G Backend-baserad webbutveckling, Åsa Lindskog sali1502@student.miun.se */

/* Routes för autentisering  */

const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
require("dotenv").config();

// Anslut till MongoDB
mongoose.set("strictQuery", false);
mongoose.connect(process.env.DATABASE).then(() => {
    console.log("Ansluten till MongoDB");
}).catch((error) => {
    console.error("Ett fel uppstod vid anslutning till databas");
});

// Modell för användare
const User = require("../models/User");

// Registrera ny användare
router.post("/index", async (req, res) => {
    try {
        const { username, password } = req.body;

        // Validera input
        if (!username || !password) {
            return res.status(400).json({ error: "Vänligen ange användarnamn och lösenord" });
        }

        // Korrekt - spara användare
        const user = new User({ username, password });
        await user.save();

        res.status(201).json({ message: "Användare skapad" });
    } catch (error) {
        res.status(500).json({ error: "Användaren finns redan, försök igen!" });
    }
});

// Logga in användare
router.post("/login", async (req, res) => {
    try {
        const { username, password } = req.body;

        // Validera input
        if (!username || !password) {
            return res.status(400).json({ error: "Ange användarnamn och lösenord" });
        }

        // Finns användaren?
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(401).json({ error: "Felaktigt användarnamn och/eller lösenord" });
        }

        // Kolla lösenord
        const isPasswordMatch = await user.comparePassword(password);
        if (!isPasswordMatch) {
            return res.status(401).json({ error: "Felaktigt användarnamn och/eller lösenord" });
        } else {
            // Skapa JWT
            const payload = { username: username };
            const token = jwt.sign(payload, process.env.JWT_SECRET_KEY, { expiresIn: '8h' });
            res.status(200).json({
                message: "Användare inloggad",
                response: {
                    token: token
                }
            });
        }
    } catch (error) {
        res.status(500).json({ error: "Server error" });
    }
});

module.exports = router; 