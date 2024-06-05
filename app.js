const express = require("express");
const app = express();
const env = require("dotenv");
const cors = require("cors");
env.config();

app.use(express.json());
app.use(cors({
    origin: "*",
    credentials: true
}));

// mongo connection
const { connection } = require("./services/connection")
connection();

// router
const { mainRouter } = require("./router/mainRouter");
app.use('/', mainRouter);

const { reminderNotification } = require('./services/cronService');
reminderNotification()

// listen server
app.listen(process.env.PORT, () => {
    console.log("user service is running on ", process.env.PORT);
});
