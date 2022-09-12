const { v4: uuidv4 } = require('uuid');
const { validationResult } = require('express-validator');
const mongoose = require('mongoose');
const fs = require("fs");

const HttpError = require("../models/http-error");
const getCoordsForAddress = require("../util/location");
const Place = require("../models/place-model");
const User = require("../models/user-model");

const getPlacesByUserId = async (req, res, next) => {
    const userId = req.params.userId;
    let userWithPlaces;

    try{
        userWithPlaces = await User.findById(userId).populate("places");
    } catch (error) {
        return next(new HttpError("Something went wrong, could not find place : " + error, 500));
    }

    if (!userWithPlaces || userWithPlaces.places.length === 0) {
        return next(new HttpError("Could not find any place for given user id", 404));
    }

    res.json({places: userWithPlaces.places.map(p => p.toObject({getters: true}))});
};

const getPlaceById = async (req, res, next) => {
    const placeId = req.params.placeId;
    let place;

    try{
        place = await Place.findById(placeId);
    } catch (error) {
        return next(new HttpError("Something went wrong, could not find object : " + error, 500))
    }

    if (!place) {
        return next(new HttpError("Could not find any place for given place id", 404));
    }

    res.json({place: place.toObject({getters: true})});
};

// create place
const createPlace = async (req, res, next) => {
    const error = validationResult(req);

    if (!error.isEmpty()) {
        return next(new HttpError("Invalid input data", 422));
    }

    const { title, description, address, creator} = req.body;

    let user;

    // find user for given user id
    try {
        user = await User.findById(creator);
    } catch (error) {
        return next(new HttpError("creating place failed, please try again " + error, 500));
    }

    if (!user) {
        return next(new HttpError("Could not find user for given id ", 404));
    }

    // get the coordinates of place using given address
    let location;

    try {
        location = await getCoordsForAddress(address);
    } catch (error) {
        return next(error);
    }


    const createdPlace = new Place({
        title,
        description,
        imageUrl: req.file.path,
        address,
        location,
        creator
    });
    
    try {
        const sess = await mongoose.startSession();
        sess.startTransaction();
        await createdPlace.save({session: sess});
        user.places.push(createdPlace);
        await user.save({session: sess});
        await sess.commitTransaction();
    } catch (error) {
        return next(new HttpError("Error with creating place " + error, 500));
    }

    res.status(201).json({place: createdPlace});
};

const updatePlaceById = async (req, res, next) => {

    const error = validationResult(req);

    if (!error.isEmpty()) {
        return next(new HttpError("Invalid input, please check again", 422));
    }

    const { title, description } = req.body;
    const placeId = req.params.placeId;

    let updatedPlace;

    try {
        updatedPlace = await Place.findOneAndUpdate({_id: placeId}, {title, description});
        updatedPlace.title = title;
        updatedPlace.description = description;
    } catch (error) {
        return next(new HttpError("Somting went wrong, could not update place" + error, 500));
    }

    res.status(200).json({place: updatedPlace.toObject({getters: true})});
};

const deletePlaceById = async (req, res, next) => {
    const placeId = req.params.placeId;

    let place;

    try {
        place = await Place.findById(placeId).populate("creator");
    } catch (error) {
        return next(new HttpError("Something went wrong, could not delete place : " + error, 500));
    }

    if ( !place ) {
        return next(new HttpError("Could not find place for given id", 404));
    }

    const imageLink = place.imageUrl;
    
    try {
        const sess = await mongoose.startSession();
        sess.startTransaction();
        await place.remove({session: sess});
        place.creator.places.pull(place);
        await place.creator.save({session: sess});
        sess.commitTransaction();
    } catch (error) {
        return next(new HttpError("Somethign went wrong, could not delete place", 500));
    }

    
    fs.unlink(imageLink, error => {
        console.log(error);
    });

    res.status(200).json({message: "deleted successfully"});
};

exports.getPlaceById = getPlaceById;
exports.getPlacesByUserId = getPlacesByUserId;
exports.createPlace = createPlace;
exports.updatePlaceById = updatePlaceById;
exports.deletePlaceById = deletePlaceById;