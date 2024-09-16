const express = require('express');
const router = express.Router();

const authenticateJWT = require('../middleware/authenticateJWT');
const usersController = require('../controllers/users');
const customersController = require('../controllers/customers');
const destinationController = require('../controllers/destinations');

//Routes for users
router.post('/signup', usersController.postSignup);
router.post('/login', usersController.postLogin);
router.get('/profile', authenticateJWT, usersController.getUserProfile);
router.put('/profile', authenticateJWT, usersController.putEditProfile);

//Routes for customers
router.post('/customer', authenticateJWT, customersController.addCustomer);
router.get('/customers', authenticateJWT, customersController.getAllCustomers);
router.get('/customers:id', authenticateJWT, customersController.getCustomerById);

//Destination Routes
router.post('/destinations', authenticateJWT, destinationController.addDestination);
router.get('/destinations', destinationController.getAllDestinations);


module.exports = router;