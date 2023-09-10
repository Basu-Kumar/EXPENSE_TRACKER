const express = require("express");
const register = require("./controllers/register");
const login = require("./controllers/login");
const userDashboard = require("./controllers/userDashboard");
const auth = require("../../middleware/auth");
const forgotPassword = require("./controllers/forgotPassword");
const resetPassword = require("./controllers/resetPassword");

// to makes user routes separately and not declaraing in app.js
const userRoutes = express.Router();

// for post route....it will be handled by controllers register
userRoutes.post("/register", register);

userRoutes.post("/login", login);
userRoutes.post("/forgotpw", forgotPassword);
userRoutes.post("/resetpw", resetPassword);

//middleware (after auth is executed then only calls get executed)
userRoutes.use(auth);

// protected route
userRoutes.get("/userDashboard", userDashboard);

module.exports = userRoutes;
