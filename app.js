require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");

const placesRouter = require("./routes/places-routes");
const usersRouter = require("./routes/users-routes");
const HttpError = require("./models/http-error");

const app = express();

const port = 5000;

app.use(bodyParser.json());

app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    // res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    res.setHeader("Access-Control-Allow-Headers", "*")
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE");
    next();
});

app.use("/upload/images", express.static(path.join("upload", "images")));
app.use("/api/places", placesRouter);
app.use("/api/users", usersRouter);

// handle unused routes
app.use((req, res, next) => {
    next(new HttpError("Could not find route", 404));
});

// handle errors
app.use((error, req, res, next) => {

    if(req.file) {
        fs.unlink(req.file.path, (error) => {
            console.log(error);
        });
    }

    if(res.headersSent) {
        return next(error);
    }

    res.status(error.code || 500);
    res.json({message: error.message || "unknown error occurred!"} )
});


/*
    connect to db 
        - if success -> listen to incoming request
        - else -> shuld down the server
*/
(async() => {
    await mongoose.connect(process.env.MONGODB_URI)
        .then(() => {
            app.listen(port, () => {
                console.log("server started on port : " + port);
            });
        })
        .catch((error) => {
            console.log("DB Connection Failed : " + error);
            console.log("Server shutdown");
            process.exit(1);
        });
})();