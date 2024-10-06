const express = require('express'); 
const userRoutes= express.Router();
const userController = require('../Controller/userController');
const auth = require('../middleware/authMiddleware');

userRoutes.post('/register', userController.registerUser);
userRoutes.post('/login', userController.loginUser);
userRoutes.get('/profile', auth, userController.profileDetails);

module.exports = userRoutes;