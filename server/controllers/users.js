import jwt from 'jsonwebtoken'
import { body, validationResult } from 'express-validator';

import User from '../models/User.js';

export const postSignup = [
    // Validation Rules
    body('email').isEmail().withMessage('Please Enter a Valid Email Address.'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long.'),
    body('username').notEmpty().withMessage('Username required'),
    body('bio').optional().isLength({ max: 250 }).withMessage('Bio Cannot exceed 250 characters.'),

    // Handle signup
    async (req, res, next) => {
        // Validate input
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            console.log('Validation errors:', errors.array()); // Log validation errors
            return res.status(400).json({ error: errors.array()[0].msg });
        }

        // Get user data from request body
        const { username, password, email, bio } = req.body;

        try {
            const user = new User({ username, password, email, bio });
            const result = await user.createUser(); // Ensure this method is correctly implemented
            res.status(201).json({ message: 'User created successfully', user });
        } catch (error) {
            console.error('Error creating user:', error); // Log error details
            const errorToThrow = new Error();
            switch (error?.code) {
                case '23505': // Duplicate entry error code
                    errorToThrow.message = 'User Already Exists';
                    errorToThrow.statusCode = 403;
                    break;
                default:
                    errorToThrow.message = 'Internal Server Error';
                    errorToThrow.statusCode = 500;
            }
            next(errorToThrow);
        }
    }
];
//Login Function
export const postLogin = [
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
export const getUserProfile = async (req, res, next) => {
    //get user ID from authenticated Request
    const userId = req.user.id;

    try {

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

export const putEditProfile = [
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

        const userId = req.user.id;


        try {
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