const { v4: uuidv4 } = require('uuid');
const { validationResult } = require('express-validator');

const HttpError = require("../models/http-error");
const getCoordsForAddress = require("../util/location");

let DUMMY_PLACES = [{
    id: "p1",
    title: "Empire State Building",
    description: "One of the most famous sky scrapers in the world.!",
    imageUrl: "https://i.pinimg.com/474x/f5/08/16/f50816017bbead00daef61e007fe886e.jpg",
    address: "20 W 34th St., New York, NY 10001, United States",
    location: {lat: 40.7484405, lng: -73.9856644},
    creator: "u1"
}, {
    id: "p2",
    title: "Emp2 State Building",
    description: "One of the most famous sky scrapers in the world.!",
    imageUrl: "https://i.pinimg.com/474x/f5/08/16/f50816017bbead00daef61e007fe886e.jpg",
    address: "20 W 34th St., New York, NY 10001, United States",
    location: {lat: 40.7484405, lng: -73.9856644},
    creator: "u2"
},
];

const getPlacesByUserId = (req, res, next) => {
    const userId = req.params.userId;
    const places = DUMMY_PLACES.filter(p => p.creator === userId);

    if (!place) {
        return next(new HttpError("Could not find any place for given user id", 404));
    }

    res.json({places});
};

const getPlaceById = (req, res, next) => {
    const placeId = req.params.placeId;
    const place = DUMMY_PLACES.find(p => p.id === placeId);

    if (!place) {
        return next(new HttpError("Could not find any place for given place id", 404));
    }

    res.json({place});
};

const createPlace = async (req, res, next) => {
    const error = validationResult(req);

    if (!error.isEmpty()) {
        return next(new HttpError("Invalid input data", 422));
    }

    const { title, description, imageUrl, address, creator} = req.body;

    let location;

    try {
        location = await getCoordsForAddress(address);
    } catch (error) {
        return next(error);
    }
    
    const createdPlace = {
        id: uuidv4(),
        title,
        description,
        imageUrl,
        address,
        location,
        creator
    };

    DUMMY_PLACES.push(createdPlace);

    res.status(201).json({place: createdPlace});
};

const updatePlaceById = (req, res, next) => {

    const error = validationResult(req);

    if (!error.isEmpty()) {
        return next(new HttpError("Invalid input, please check again", 422));
    }

    const { title, description } = req.body;
    const placeId = req.params.placeId;

    const updatedPlace = { ...DUMMY_PLACES.find(p => p.id === placeId)};
    const index = DUMMY_PLACES.findIndex(p => p.id === placeId);

    updatedPlace.title = title;
    updatedPlace.description = description;

    DUMMY_PLACES[index] = updatedPlace;

    res.status(200).json({place: updatedPlace});
};

const deletePlaceById = (req, res, next) => {
    const placeId = req.params.placeId;
    
    if (!DUMMY_PLACES.find(p => p.id === placeId)) {
        return next(new HttpError("Could not find place", 404));
    }

    DUMMY_PLACES = DUMMY_PLACES.filter(p => p.id === placeId);

    res.status(200).json({message: "deleted successfully"});
};

exports.getPlaceById = getPlaceById;
exports.getPlacesByUserId = getPlacesByUserId;
exports.createPlace = createPlace;
exports.updatePlaceById = updatePlaceById;
exports.deletePlaceById = deletePlaceById;