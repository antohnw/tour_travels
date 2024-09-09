const express = require('express');
const router = express.Router();

const usersController = require('../controllers/users')

router.post('/signup', usersController.postSignup);

module.exports = router;