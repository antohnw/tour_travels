const User = require('../models/User');

exports.postSignup = async (req, res, next) => {
    //get user data from request body
    const { username, password, email, bio } = req.body;
    try {
        const user = new User({ username, password, email, bio });
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
};