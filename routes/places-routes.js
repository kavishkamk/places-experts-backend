const express = require("express");
const { check } = require('express-validator');

const placeControllers = require("../controllers/places-controllers");

const router = express.Router();

router.get("/users/:userId", placeControllers.getPlacesByUserId);

router.get("/:placeId", placeControllers.getPlaceById);

router.post("/", 
        [
            check("title")
                .not()
                .isEmpty(),
            check("description")
                .isLength({ min: 5 }),
            check("address")
                .not()
                .isEmpty()
        ], placeControllers.createPlace);

router.patch("/:placeId", 
        [
            check("description")
                .isLength({ min: 5 }),
            check("address")
                .not()
                .isEmpty()
        ],placeControllers.updatePlaceById);

router.delete("/:placeId", placeControllers.deletePlaceById);

module.exports = router;