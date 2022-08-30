const { v4: uuidv4 } = require('uuid');
const { validationResult } = require('express-validator');

const HttpError = require("../models/http-error");

const DUMMY_USERS = items = [
    {
        id: "u1", 
        name: "kavishka", 
        email: "kavishka@gmail.com",
        password: "123",
        places:6, 
        image:"https://images.unsplash.com/photo-1503023345310-bd7c1de61c7d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MXx8aHVtYW58ZW58MHx8MHx8&w=1000&q=80"
    }
];

const getUsers = (req, res, next) => {
    res.json({users: DUMMY_USERS});
};

const signUp = (req, res, next) => {

    const error = validationResult(req);

    if (!error.isEmpty()) {
        return next(new HttpError("Invalid input, please check again", 422));
    }

    const {username, password, email} = req.body;
    const createdUser = {
        id: uuidv4(),
        name: username,
        email,
        password
    }
    DUMMY_USERS.push(createdUser);
    res.status(201).json({user: createdUser});
};

const login = (req, res, next) => {

    const error = validationResult(req);

    if (!error.isEmpty()) {
        return next(new HttpError("Invalid input, please check again", 422));
    }

    const {email, password} = req.body;
    const identifiedUsers = DUMMY_USERS.find(u => u.email === email);
    if (!identifiedUsers) {
        return next(new HttpError("Could not find user, credentials seems to be wrong", 401))
    }
    res.json({message: "Login Success"});
};

exports.getUsers = getUsers;
exports.signUp = signUp;
exports.login = login;