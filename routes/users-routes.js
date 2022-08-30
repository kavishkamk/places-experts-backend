const express = require("express");
const { check } = require('express-validator');

const usersControllers = require("../controllers/users-controllers");

const router = express.Router();

router.get("/", usersControllers.getUsers);

router.post("/signup", 
    [
        check("username")
            .not()
            .isEmpty(),
        check("email")
            .isEmail(),
        check("password")
            .isLength({min: 6})
    ],usersControllers.signUp);

router.post("/login", 
    [
        check("email")
            .normalizeEmail() // Test@gmail.com => test@gmail.com
            .isEmail(),
        check("password")
            .isLength({min: 6})
    ],usersControllers.login);

module.exports = router;