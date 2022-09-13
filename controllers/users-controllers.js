const { validationResult } = require('express-validator');
const bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');

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

    const {username, password, email} = req.body;
    let exsistingUser;

    try {
        exsistingUser = await User.findOne({email});
    } catch (error) {
        return next(new HttpError("Signup fail, please try again later", 500))
    }

    if (exsistingUser) {
        return next(new HttpError("User alray exsisting, try Insted", 422));
    }

    let hashedPassword;

    try {
        hashedPassword = await bcrypt.hash(password, 12);
    } catch (error) {
        return next(new HttpError("Could not created users, Please try again", 500));
    }

    const createdUser = new User({
        name: username,
        email,
        password: hashedPassword,
        image: req.file.path,
        places: []
    });

    try {
        await createdUser.save();
    } catch ( error ) {
        return next(new HttpError("Something went wrong, could not create user", 500));
    }

    let token;

    try {
        token = jwt.sign(
            { userId: createdUser.id, email: createdUser.email }, 
            process.env.JWT_KEY,
            { expiresIn: "1h"}
        );
    
    } catch (error) {
        return next(new HttpError("Signin up failed, please try again later", 500));
    }

    res.status(201).json({ userId: createdUser.id, email: createdUser.email, token: token });
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
        return next(new HttpError("Could not find user, credentials seems to be wrong", 401));
    }

    let isValid = false;

    try {
        isValid = await bcrypt.compare(password, identifiedUsers.password);
    } catch (error) {
        return next(new HttpError("Could not logged in, Please check your cirdential and try again", 500));
    }

    if (!isValid) {
        return next(new HttpError("Could not find user, credentials seems to be wrong", 403));
    }

    let token;

    try {
        token = jwt.sign(
            { userId: identifiedUsers.id, email: identifiedUsers.email }, 
            process.env.JWT_KEY,
            { expiresIn: "1h"}
        );
    
    } catch (error) {
        return next(new HttpError("Signin up failed, please try again later", 500));
    }

    res.json({userId: identifiedUsers.id, email: identifiedUsers.email, token: token});
};

exports.getUsers = getUsers;
exports.signUp = signUp;
exports.login = login;