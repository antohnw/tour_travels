const { body, validationResult } = require('express-validator');
const Destination = require('../models/destinations');


//Add new destination
exports.addDestination = [

    body('destination_name').notEmpty().withMessage('Destination name is required'),
    body('country').notEmpty().withMessage('Country is required'),
    body('description').notEmpty().withMessage('Description required'),
    body('map_locations.latitude').isNumeric().withMessage('Latitude must be a number'),
    body('map_locations.longitude').isNumeric().withMessage('Longitude must be a number'),

    async (req, res, next) => {
        //validate input
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const { destination_name, country, description, pictures, videos, map_locations, activities } = req.body;
        try {
            const newDestination = new Destination({
                destination_name,
                country,
                description,
                pictures,
                videos,
                map_locations,
                activities
            })
            const result = await newDestination.createDestination();
            res.status(201).json({
                message: 'destination created successfully',
                destination: result
            });
        } catch (error) {
            const errorToThrow = new Error();
            switch (error?.code) {
                case '23505':
                    errorToThrow.message = 'Destination Already Exists in This Country';
                    errorToThrow.statusCode = 403;
                    break;
                default:
                    errorToThrow.message = 'Internal Server Error'
                    errorToThrow.statusCode = 500;

            }
            next(errorToThrow);
        }
    }
];

// Get All Destinations
exports.getAllDestinations = async (req, res, next) => {
    try {
        const destinations = await Destination.findAllDestinations();
        res.json(destinations);
    } catch (error) {
        console.log('Error Fetching destinations:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};