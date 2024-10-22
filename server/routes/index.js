import express from 'express';
import authenticateJWT from '../middleware/authenticateJWT.js';
import { addCustomer, getAllCustomers, getCustomerById } from '../controllers/customers.js';
import { postSignup, postLogin, getUserProfile, putEditProfile } from '../controllers/users.js';
import { addDestination, getAllDestinations } from '../controllers/destinations.js';

const router = express.Router();

//Routes for users
router.post('/signup', postSignup);
router.post('/login', postLogin);
router.get('/profile', authenticateJWT, getUserProfile);
router.put('/profile', authenticateJWT, putEditProfile);

//Routes for customers
router.post('/customer', authenticateJWT, addCustomer);
router.get('/customers', authenticateJWT, getAllCustomers);
router.get('/customers:id', authenticateJWT, getCustomerById);

//Destination Routes
router.post('/destinations', authenticateJWT, addDestination);
router.get('/destinations', getAllDestinations);


export default router; 
