import { query } from '../db/index.js';
import bcrypt from 'bcrypt';

// User Constructor
export default function User({ id = null, username, email, password, bio = `Hi, I am ${username}` }) {
    this.id = id;
    this.username = username;
    this.email = email;
    this.password = password;
    this.bio = bio;
}

// Create User method
User.prototype.createUser = async function () {
    try {
        const hashedPassword = await bcrypt.hash(this.password, 10);

        const result = await query(
            `INSERT INTO users(username, email, password, bio)
            VALUES($1, $2, $3, $4) RETURNING id`,
            [this.username, this.email, hashedPassword, this.bio]
        );
        this.id = result.rows[0].id; // Fixed variable name to result
        return this;
    } catch (error) {
        throw error;
    }
};

// Find User by Email or Username
User.findByEmailOrUsername = async function (identifier) {
    try {
        const query = `SELECT * FROM users WHERE email = $1 OR username = $1`;
        const result = await query(query, [identifier]);
        if (result.rows.length > 0) {
            // New user instance with data from db
            const userData = result.rows[0];
            return new User({
                id: userData.id,
                username: userData.username,
                email: userData.email,
                password: userData.password,
                bio: userData.bio
            });
        };
        return null; // No user found
    } catch (error) {
        throw error;
    }
};

// Find user by id
User.findById = async function (id) {
    try {
        const query = `SELECT * FROM users WHERE id = $1`;
        const result = await query(query, [id]);
        if (result.rows.length > 0) {
            const userData = result.rows[0];
            return new User({
                id: userData.id,
                username: userData.username, // Fixed duplicate email assignment
                email: userData.email,
                password: userData.password,
                bio: userData.bio
            });
        }
        return null;
    } catch (error) {
        throw error;
    }
};

// Edit user profile
User.prototype.updateProfile = async function () {
    try {
        const query = `UPDATE users 
            SET username = $1, email = $2, bio = $3
            WHERE id = $4 
            RETURNING *`;
        const result = await query(query, [this.username, this.email, this.bio, this.id]);
        return result.rows[0];
    } catch (error) {
        throw error;
    }
};

// Verify password method
User.prototype.verifyPassword = async function (password) {
    return await bcrypt.compare(password, this.password);
};