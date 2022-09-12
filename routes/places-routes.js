const express = require("express");
const { check } = require('express-validator');

const placeControllers = require("../controllers/places-controllers");
const fileUpload = require("../middleware/file-upload");

const router = express.Router();

router.get("/users/:userId", placeControllers.getPlacesByUserId);

router.get("/:placeId", placeControllers.getPlaceById);

router.post("/", 
        fileUpload.single("image"),
        [
            check("title")
                .not()
                .isEmpty(),
            check("description")
                .isLength({ min: 5 }),
            check("address")
                .not()
                .isEmpty(),
            check("creator")
                .not()
                .isEmpty()
        ], placeControllers.createPlace);

router.patch("/:placeId", 
        [
            check("description")
                .isLength({ min: 5 })
        ],placeControllers.updatePlaceById);

router.delete("/:placeId", placeControllers.deletePlaceById);

module.exports = router;