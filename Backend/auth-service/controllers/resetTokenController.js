const crypto =  require('crypto');
const nodemailer = require('nodemailer')
const pool = require('../database/db')
const { RespondJSONSuccess, RespondJSONError } = require('../utils/response')

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

        const resetLink = 'http//localhost:5173/reset-password/${token}';
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
        await pool.query('UPDATE users SET password = $1 WHERE id = $2')
        await pool.query('DELETE FROM password_reset_tokens WHERE token = $1', [token])

        return RespondJSONSuccess(res, 200, "Password reset successful");
    } catch(err){
        console.error(err);
        return RespondJSONError(res, 500, 'Internal server error')
    }
}