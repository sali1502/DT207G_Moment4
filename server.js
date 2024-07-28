/* Moment 4, DT207G Backend-baserad webbutveckling, Åsa Lindskog sali1502@student.miun.se */

/* Applikation för registrering och inloggning */

const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const authRoutes = require("./routes/authRoutes");
const jwt = require("jsonwebtoken");

require("dotenv").config();

// Initiera Express
const app = express();
const port = process.env.PORT || 3000;
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

// Routes
app.use("/api", authRoutes);

// Skyddad route
app.get("/api/mypage", authenticateToken, (req, res) => {
    res.json({ message: "Skyddad route" });
});

// Validera Token
function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token == null) res.status(401).json({ message: "Token saknas" });

    jwt.verify(token, process.env.JWT_SECRET_KEY, (err, username) => {
        if (err) return res.status(403).json({ message: "Ej korrekt JWT" });

        req.username = username;
        next();
    });
}

// Starta applikationen
app.listen(port, () => {
    console.log(`Servern är startad på http://localhost:${port}`);
})