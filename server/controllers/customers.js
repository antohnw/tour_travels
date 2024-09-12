const { body, validationResult } = require('express-validator');

const Customer = require('../models/customers');

exports.addCustomer = [

    body('customer_name').notEmpty().withMessage('Customer name is required'),
    body('email').isEmail().withMessage('Please enter a valid email'),
    body('phone').notEmpty().withMessage('Phone number is required').isMobilePhone('en-GB')
        .withMessage('Please enter a valid phone number.'),

    async (req, res, next) => {
        //validate input
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const { customer_id, customer_name, phone, email, signup_date, preferred_contact_method } = req.body;
        const userId = req.user.id;

        try {
            const newCustomer = new Customer({
                customer_name,
                email,
                phone,
                preferred_contact_method,
                created_by: userId,
            });
            const result = await newCustomer.createCustomer();
            res.status(201).send(newCustomer);
        } catch (error) {
            const errorToThrow = new Error();
            switch (error?.code) {
                case '23505':
                    errorToThrow.message = 'Customer Already Exists';
                    errorToThrow.statusCode = 403;
                    break;
                default:
                    errorToThrow.message = 'Internal Server Error'
                    errorToThrow.statusCode = 500;
            }
            //pass error to next()
            next(errorToThrow);
        }
    }

];

// Get All Customers
exports.getAllCustomers = async (req, res, next) => {
    try {
        const customers = await Customer.findAllCustomers();
        res.json(customers);
    } catch (error) {
        console.log('Error Fetching customers:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
// Get a specific customer by ID
exports.getCustomerById = async (req, res, next) => {
    const { id } = req.params; // Get ID from request parameters

    try {
        const result = await db.query(`SELECT * FROM customers WHERE customer_id = $1`, [id]); // Query for a specific customer
        const customer = result.rows[0];

        if (!customer) {
            return res.status(404).json({ error: 'Customer not found' });
        }

        res.json(customer); // Return the customer details
    } catch (error) {
        console.log('Error fetching customer:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};