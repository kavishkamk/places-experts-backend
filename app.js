const express = require("express");
const bodyParser = require("body-parser");

const placesRouter = require("./routes/places-routes");
const usersRouter = require("./routes/users-routes");
const HttpError = require("./models/http-error");

const app = express();

const port = 5000;

app.use(bodyParser.json());

app.use("/api/places", placesRouter);
app.use("/api/users", usersRouter);

// handle unused routes
app.use((req, res, next) => {
    next(new HttpError("Could not find route", 404));
});

// handle errors
app.use((error, req, res, next) => {
    if(res.headersSent) {
        return next(error);
    }

    res.status(error.code || 500);
    res.json({message: error.message || "unknown error occurred!"} )
});

app.listen(port, () => {
    console.log("server started on port : " + port);
});