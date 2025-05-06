const pool = require('../database/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { RespondJSONSuccess, RespondJSONError } = require('../utils/response');

// Register a new user
exports.register = async (req, res) => {
    const { username, email, password } = req.body;

    try {
        // Check if user already exists
        const existingUser = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        if (existingUser.rows.length > 0) {
            return RespondJSONError(res, 409, 'User already exists');
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert new user into the database
        const newUser = await pool.query(
            'INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING *',           
            [username, email, hashedPassword]
        );

        // Generate JWT token
        const token = jwt.sign({ id: newUser.rows[0].id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        return RespondJSONSuccess(res, 201, 'User registered successfully', { token });
    } catch (error) {
        console.error(error);
        return RespondJSONError(res, 500, 'Internal server error');
    }
};

// Login user
 exports.login = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Check if user exists
        const user = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        if (user.rows.length === 0) {
            return RespondJSONError(res, 401, 'Invalid credentials');
        }

        // Compare password
        const isMatch = await bcrypt.compare(password, user.rows[0].password);
        if (!isMatch) {
            return RespondJSONError(res, 401, 'Invalid credentials');
        }

        // Generate JWT token
        const token = jwt.sign({ id: user.rows[0].id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        return RespondJSONSuccess(res, 200, 'Login successful', { token });
    } catch (error) {
        console.error(error);
        return RespondJSONError(res, 500, 'Internal server error');
    }
};

// Middleware to check if user is authenticated
exports.userConnect = async (req, res) => {
    try {
        const user = await pool.query('SELECT * FROM users WHERE id = $1', [req.userId]);

        if (user.rows.length === 0) {
            return RespondJSONError(res, 404, 'User not found');
        }

        return RespondJSONSuccess(res, 200, 'User found successfully', { user: user.rows[0] });
    } catch (error) {
        console.error(error);
        return RespondJSONError(res, 500, 'Internal server error');
    }
}