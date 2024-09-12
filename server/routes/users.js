const express = require('express');
const router = express.Router();

const usersController = require('../controllers/users')

//Route for user signup
router.post('/signup', usersController.postSignup);

//route for login
router.post('/login', usersController.postLogin);

//route for viewing user profile
router.get('/profile', usersController.getUserProfile);

//route for editing user profile
router.put('/profile', usersController.putEditProfile);

module.exports = router;