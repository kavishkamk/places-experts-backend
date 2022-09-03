const { v4: uuidv4 } = require('uuid');
const { validationResult } = require('express-validator');

const HttpError = require("../models/http-error");
const User = require("../models/user-model");

const getUsers = async (req, res, next) => {

    let users;

    try {
        users = await User.find({}, '-password');
    } catch (error) {
        return next(new HttpError("Somthing wrong", 500));
    }


    res.json({users: users.map(p => p.toObject({getters: true}))});
};

const signUp = async (req, res, next) => {

    const error = validationResult(req);

    if (!error.isEmpty()) {
        return next(new HttpError("Invalid input, please check again", 422));
    }

    const {username, password, email, image} = req.body;
    let exsistingUser;

    try {
        exsistingUser = await User.findOne({email});
    } catch (error) {
        return next(new HttpError("Signup fail, please try again later", 500))
    }

    if (exsistingUser) {
        return next(new HttpError("User alray exsisting, try Insted", 422));
    }

    const createdUser = new User({
        name: username,
        email,
        password,
        image,
        places: []
    });

    try {
        await createdUser.save();
    } catch ( error ) {
        return next(new HttpError("Something went wrong, could not create user", 500))
    }

    res.status(201).json({user: createdUser.toObject({getters: true})});
};

const login = async (req, res, next) => {

    const error = validationResult(req);

    if (!error.isEmpty()) {
        return next(new HttpError("Invalid input, please check again", 422));
    }

    const {email, password} = req.body;

    let identifiedUsers;

    try {
        identifiedUsers = await User.findOne({email});
    } catch (error) {
        return next (new HttpError("Something went wrong, please try again later", 500));
    }

    if (!identifiedUsers) {
        return next(new HttpError("Could not find user, credentials seems to be wrong", 401))
    }
    res.json({message: "Login Success"});
};

exports.getUsers = getUsers;
exports.signUp = signUp;
exports.login = login;