const { v4: uuidv4 } = require('uuid');

const HttpError = require("../models/http-error");

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

const getPlaceByUserId = (req, res, next) => {
    const userId = req.params.userId;
    const place = DUMMY_PLACES.find(p => p.creator === userId);

    if (!place) {
        return next(new HttpError("Could not find any place for given user id", 404));
    }

    res.json({place});
};

const getPlaceById = (req, res, next) => {
    const placeId = req.params.placeId;
    const place = DUMMY_PLACES.find(p => p.id === placeId);

    if (!place) {
        return next(new HttpError("Could not find any place for given place id", 404));
    }

    res.json({place});
};

const createPlace = (req, res, next) => {
    const { title, description, imageUrl, address, location, creator} = req.body;

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

    DUMMY_PLACES = DUMMY_PLACES.filter(p => p.id === placeId);
    res.status(200).json({message: "deleted successfully"});
};

exports.getPlaceById = getPlaceById;
exports.getPlaceByUserId = getPlaceByUserId;
exports.createPlace = createPlace;
exports.updatePlaceById = updatePlaceById;
exports.deletePlaceById = deletePlaceById;