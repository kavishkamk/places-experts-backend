require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");

const placeRouter = require("./routes/place-routes");
const usersRouter = require("./routes/users-route");
const HttpError = require("./models/http-error");
require("./util/location");

const app = express();

const port = 5000;

app.use(bodyParser.json());

app.use("/api/places", placeRouter);

app.use("/api/users", usersRouter);

app.use((req, res, next) => {
    const error = new HttpError("Could not find this route", 404);
    next(error);
});

app.use((error, req, res, next) => {
    if (res.headersSent) {
        return next(error);
    }
    res.status(error.code || 500);
    res.json({message: error.message || "An unknown error occured..!"});
});

app.listen(port, () => {
    console.log("Server Started on Port : " + port);
});