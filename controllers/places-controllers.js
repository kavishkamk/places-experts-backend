const { v4: uuidv4 } = require('uuid');
const { validationResult } = require("express-validator");

const HttpError = require("../models/http-error");
const getCoordsForAddress = require("../util/location");

let DUMMY_PLACES = [
    {
        id: "p1",
        title: "Empire State Building",
        description: "One of the most famous sky scrapers in the world.!",
        imageUrl: "https://i.pinimg.com/474x/f5/08/16/f50816017bbead00daef61e007fe886e.jpg",
        address: "20 W 34th St., New York, NY 10001, United States",
        location: {lat: 40.7484405, lng: -73.9856644},
        creator: "u1"
    }, {
        id: "p2",
        title: "Empire State Building",
        description: "One of the most famous sky scrapers in the world.!",
        imageUrl: "https://i.pinimg.com/474x/f5/08/16/f50816017bbead00daef61e007fe886e.jpg",
        address: "20 W 34th St., New York, NY 10001, United States",
        location: {lat: 40.7484405, lng: -73.9856644},
        creator: "u2"
    },
];

const getPlaceById = (req, res, next) => {
    const plaseId = req.params.pid;
    const place = DUMMY_PLACES.find(p => {
        return p.id === plaseId;
    });

    if (!place) {
        return next(new HttpError("Couden't find a place for given place id", 404));
    }
    res.json({place}); // {place} => {place: place}
};

const getPlacesByUserId = (req, res, next) => {
    const userId = req.params.uid;
    const place = DUMMY_PLACES.filter(p => {
        return p.creator === userId;
    });

    if (!place || place.length === 0) {
        return next(new HttpError("Couden't find a place for given user id", 404));
    }
    res.json({place});
};

const createPlace = async (req, res, next) => {
    const error = validationResult(req);

    if (!error.isEmpty()) {
        return next(new HttpError("Invalid input passed", 422));
    }
    
    const {title, description, imageUrl, address, creator} = req.body;

    let coordinates;

    try{
        coordinates = await getCoordsForAddress(address);
    } catch (error) {
        return next(error);
    }
    
    
    const createdPlace = {
        id: uuidv4(),
        title,
        description,
        imageUrl,
        address,
        location: coordinates,
        creator
    };
    DUMMY_PLACES.push(createdPlace);
    res.status(201).json({place: createdPlace});
};

const updatePlaceById = (req, res, next) => {
    const error = validationResult(req);

    if(!error.isEmpty()) {
        return next(new HttpError("Invlid updated data", 422));
    }

    const id = req.params.pid;
    const { title, description } = req.body;

    const place = { ...DUMMY_PLACES.find(p => p.id === id ) };
    const placeIndex = DUMMY_PLACES.findIndex(p => p.id === id);

    place.title = title;
    place.description = description;

    DUMMY_PLACES[placeIndex] = place;
    res.status(200).json({place});

};

const deletePlaceById = (req, res, next) => {
    const id = req.params.pid;
    
    DUMMY_PLACES = DUMMY_PLACES.filter(p => p.id !== id);
    res.status(200).json({message: "Place Deleted"});

};

exports.getPlaceById = getPlaceById;
exports.getPlacesByUserId = getPlacesByUserId;
exports.createPlace = createPlace;
exports.updatePlaceById = updatePlaceById;
exports.deletePlaceById = deletePlaceById;