const express = require("express");

const placeControllers = require("../controllers/places-controllers");

const router = express.Router();

router.get("/users/:userId", placeControllers.getPlacesByUserId);

router.get("/:placeId", placeControllers.getPlaceById);

router.post("/", placeControllers.createPlace);

router.patch("/:placeId", placeControllers.updatePlaceById);

router.delete("/:placeId", placeControllers.deletePlaceById);

module.exports = router;