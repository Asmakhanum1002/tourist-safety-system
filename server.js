const express = require("express");
const session = require("express-session");
const crypto = require("crypto");

const app = express();

app.use(express.json());
app.use(express.static("public"));

app.use(session({
    secret: "secret",
    resave: false,
    saveUninitialized: true
}));

let alerts = [];

// Digital ID
function generateID(username) {
    return crypto.createHash("sha256").update(username).digest("hex");
}

// Login
app.post("/login", (req, res) => {
    const { username, password } = req.body;

    if (password === "1234") {
        req.session.user = {
            username,
            id: generateID(username)
        };
        res.json({ success: true });
    } else {
        res.json({ success: false });
    }
});

// Auth
function auth(req, res, next) {
    if (req.session.user) next();
    else res.status(401).send("Unauthorized");
}

// Alert
app.post("/alert", auth, (req, res) => {
    const { lat, lon } = req.body;

    const alert = {
        user: req.session.user.username,
        lat,
        lon,
        time: new Date().toLocaleString()
    };

    alerts.push(alert);
    console.log("🚨", alert);

    res.json({ message: "Alert Sent!" });
});

// Get alerts
app.get("/alerts", auth, (req, res) => {
    res.json(alerts);
});

// Logout
app.get("/logout", (req, res) => {
    req.session.destroy();
    res.redirect("/login.html");
});

// ✅ Use different port (no conflict)
app.listen(5500, () => {
    console.log("http://localhost:5500/login.html");
});