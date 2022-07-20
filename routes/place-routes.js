const express = require("express");
const { check } = require("express-validator");

const plaseControllers = require("../controllers/places-controllers");

const router = express.Router();

router.get('/:pid', plaseControllers.getPlaceById);

router.get('/users/:uid', plaseControllers.getPlacesByUserId);

router.post('/', 
    [
        check('title').not().isEmpty(), 
        check('description').isLength({min: 5}),
        check('address').not().isEmpty()
    ], 
    plaseControllers.createPlace);

router.patch('/:pid', 
    [
        check('title').not().isEmpty(),
        check('description').not().isEmpty()
    ],
    plaseControllers.updatePlaceById);

router.delete('/:pid', plaseControllers.deletePlaceById);

module.exports = router;