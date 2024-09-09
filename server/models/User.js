const db = require('../db');
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
        await db.query(
            `INSERT INTO users(username, email, password, bio)
            VALUES($1,$2,$3,$4)`, [this.username, this.email, this.password, this.bio]
        );
        return this;
    } catch (error) {
        throw error;
    }

};
module.exports = User;