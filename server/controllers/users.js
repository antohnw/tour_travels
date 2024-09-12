const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');

const User = require('../models/User');

exports.postSignup = [
    //validation Rules
    body('email').isEmail().withMessage('Please Enter a Valid Email Address.'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long.'),
    body('username').notEmpty().withMessage('Username required'),
    body('bio').optional().isLength({ max: 250 }).withMessage('Bio Cannot exceed 250 characters.'),

    // Handle signup
    async (req, res, next) => {
        //validate input
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        //get user data from request body
        const { id, username, password, email, bio } = req.body;
        try {
            const user = new User({ id, username, password, email, bio });
            const result = await user.createUser();
            res.status(201).send(user);
        } catch (error) {
            const errorToThrow = new Error();
            switch (error?.code) {
                case '23505':
                    errorToThrow.message = 'User Already Exists';
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
//Login Function
exports.postLogin = [
    //validation rules
    body('identifier').notEmpty().withMessage('Email or username required.'),
    body('password').notEmpty().withMessage('Password required.'),

    //handle login
    async (req, res, next) => {
        //validate input
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() })
        }
        const { identifier, password } = req.body; //Email or username

        try {
            //find user by email or username
            const user = await User.findByEmailOrUsername(identifier);
            if (!user) {
                return res.status(400).json({ error: 'Ivalid Credentials' });

            }
            //Verify Password
            const isMatch = await user.verifyPassword(password);
            if (!isMatch) {
                return res.status(400).json({ error: 'Ivalid Credentials' });
            }
            //Generate JWT token
            const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
            res.json({ token });

        } catch (error) {
            console.error('Error during login:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }
];
exports.getUserProfile = async (req, res, next) => {
    //get the token from authorization header
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1]; //Bearer <token>
    console.log('Authorization Token:', token); // Log the token

    if (!token) {
        return res.status(401).json({ error: 'Authorization token is required' });
    }
    try {

        //verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.id; // Adjust according to your payload structure

        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ error: 'User not found' });

        }
        res.json({
            id: user.id,
            username: user.username,
            email: user.email,
            bio: user.bio
        });
    } catch (error) {
        console.log('Error Fetching user profile:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
exports.putEditProfile = [
    //Validation
    body('username').optional().notEmpty().withMessage('Username required'),
    body('email').optional().isEmail().withMessage('Please Enter a valid email address.'),
    body('bio').optional().isLength({ max: 250 }).withMessage('Bio cannot exceed 250 characters'),

    //handle profile update
    async (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const { username, email, bio } = req.body;

        //get user id from token
        const authHeader = req.headers.authorization;
        const token = authHeader && authHeader.split(' ')[1];

        if (!token) {
            return res.status(401).json({ error: 'Authorization token required' });
        }
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const userId = decoded.id;

            //find user
            const user = await User.findById(userId);

            console.log('User Object:', user); // Log the user object

            if (!user) {
                return res.status(404).json({ error: 'User not found' });
            }
            //update user details
            if (username) user.username = username;
            if (email) user.email = email;
            if (bio) user.bio = bio;


            const updatedUser = await user.updateProfile();

            res.json({
                id: updatedUser.id,
                username: updatedUser.username,
                email: updatedUser.email,
                bio: updatedUser.bio,
            });
        } catch (error) {
            console.log('ERROR updating profile:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }

];