const db = require('../db');
const bcrypt = require('bcrypt');

//User Constructor
function User({
    username,
    email,
    password,
    bio = `Hi, I am ${username}`
}) {
    this.username = username;
    this.email = email;
    this.password = password;
    this.bio = bio;
};
//createUser method
User.prototype.createUser = async function () {
    try {
        const hashedPassword = await bcrypt.hash(this.password, 10);

        await db.query(
            `INSERT INTO users(username, email, password, bio)
            VALUES($1,$2,$3,$4)`, [this.username, this.email, hashedPassword, this.bio]
        );
        return this;
    } catch (error) {
        throw error;
    }

};
module.exports = User;