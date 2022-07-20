const { v4: uuidv4 } = require('uuid');

const HttpError = require("../models/http-error");

const items = [{id: "u1", name: "kavishka", places:6, image:"https://images.unsplash.com/photo-1503023345310-bd7c1de61c7d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MXx8aHVtYW58ZW58MHx8MHx8&w=1000&q=80"}];

const getUsers = (req, res, next) => {

    if (!items  || items.length === 0) {
        return next(new HttpError("Could not found user for given user id", 404));
    }
    res.status(200).json({users : items});
};

const signup = (req, res, next) => {
    const {username, email, password} = req.body;

    const createdUser = {
        uid: uuidv4(),
        username,
        email,
        password
    }

    items.push(createdUser);
    res.status(201).json({user: createdUser});

};

const login = (req, res, next) => {

};

exports.getUsers = getUsers;
exports.signup = signup;
exports.login = login;