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
        console.log('User query result:', user.rows); // Debug log
        if (user.rows.length === 0) {
            return RespondJSONError(res, 401, 'Invalid credentials');
        }

        // Compare password
        const isMatch = await bcrypt.compare(password, user.rows[0].password);
        console.log('Password match:', isMatch); // Debug log
        if (!isMatch) {
            return RespondJSONError(res, 401, 'Invalid credentials');
        }

        // Generate JWT token
        const token = jwt.sign({ id: user.rows[0].id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        return RespondJSONSuccess(res, 200, 'Login successful', { token });
    } catch (error) {
        console.error('Login error:', error); // Debug log
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


exports.requestPasswordReset =  async(req, res) => {
    const { email } = req.body;
    try {
        const user = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        if (user.rows.length == 0) {
            return RespondJSONError(res, 404, "User not found")
        }

        const token = crypto.randomBytes(32).toString('hex');
        const expiresAt = new Date(Date.now() + 15 * 60 * 1000);

        await pool.query('INSERT INTO password_reset_tokens (user_id, token, expires_at) VALUES ($1, $2, $3)', [user.rows[0].id, token, expiresAt]);

        const resetLink = `http://localhost:5173/reset-password/${token}`;
        return RespondJSONSuccess(res, 200, "Reset link sent to email", {resetLink})

    } catch (err) {
        console.error(err);
        return RespondJSONError(res, '500', 'Internal server error');
    }
}

exports.resetPassword = async (req, res) => {
    const { token, newPassword } = req.body
    try {
        const result = await pool.query('SELECT * FROM password_reset_tokens WHERE token = $1 AND expires_at > NOW()', [token]);
        if (result.rows.length === 0) {
            return RespondJSONError(res, 400, "Invalid or Expired Token")
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await pool.query('UPDATE users SET password = $1 WHERE id = $2', [hashedPassword, result.rows[0].user_id])
        await pool.query('DELETE FROM password_reset_tokens WHERE token = $1', [token])

        return RespondJSONSuccess(res, 200, "Password reset successful");
    } catch(err){
        console.error(err);
        return RespondJSONError(res, 500, 'Internal server error')
    }
}