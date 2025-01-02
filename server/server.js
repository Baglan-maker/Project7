require("./instrument.js");
const Sentry = require("@sentry/node");

const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const cookieParser = require('cookie-parser');
const dotenv = require("dotenv");

if (process.env.NODE_ENV === 'production') {
    dotenv.config({ path: '.env.production' });
} else {
    dotenv.config({ path: '.env.development' });
}

const authRoutes = require("./routes/auth");

const app = express();

app.use(
    cors({
        origin: "http://localhost:3000",
        credentials: true,
    })
);
app.use(cookieParser());

app.use(bodyParser.json());

app.use("/api", authRoutes);

app.use((err, req, res) => {
    Sentry.captureException(err);
    console.error(err);
    res.status(500).send({ error: "Internal Server Error" });
});

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));