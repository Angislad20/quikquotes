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
        const user = await pool.query('SELECT * FROM users WHERE email = $1', [emailTrimmed]);
        console.log('User query result:', user.rows); // Debug log
        if (user.rows.length === 0) {
            return RespondJSONError(res, 401, 'Invalid credentials');
        }

        // Compare password
        const emailTrimmed = email.trim();
        const isMatch = await bcrypt.compare(password, user.rows[0].password.trim());

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


exports.resetPassword = async (req, res) => {
    const { otp, newPassword } = req.body;

    try {
        // Vérifie si le code OTP est valide et non expiré
        const result = await pool.query('SELECT * FROM password_reset_codes WHERE otp = $1 AND expires_at > NOW()', [otp]);
        if (result.rows.length === 0) {
            return res.status(400).json({ message: 'Code OTP invalide ou expiré' });
        }

        const resetCode = result.rows[0];
        const userId = resetCode.user_id;

        // Hacher le nouveau mot de passe
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // Mettre à jour le mot de passe dans la base de données
        await pool.query('UPDATE users SET password = $1 WHERE id = $2', [hashedPassword, userId]);

        // Supprimer l'OTP de la base de données après l'utilisation
        await pool.query('DELETE FROM password_reset_codes WHERE otp = $1', [otp]);

        return res.status(200).json({ message: 'Mot de passe réinitialisé avec succès' });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Erreur interne du serveur' });
    }
};

exports.forgotPassword = async (req, res) => {
    const { email } = req.body;

    try {
        // Vérifie si l'utilisateur existe
        const userResult = await pool.query('SELECT * FROM users WHERE email = $1', [email.trim()]);
        if (userResult.rows.length === 0) {
            return res.status(400).json({ message: 'Aucun compte trouvé avec cet e-mail' });
        }

        const user = userResult.rows[0];

        // Générer un code OTP
        const otp = crypto.randomInt(100000, 999999).toString(); // Génère un OTP à 6 chiffres
        const expiresAt = new Date(Date.now() + 1000 * 60 * 10); // 10 minutes de validité

        // Insérer l'OTP dans la base de données
        await pool.query(
            'INSERT INTO password_reset_codes (user_id, otp, expires_at) VALUES ($1, $2, $3)',
            [user.id, otp, expiresAt]
        );

        // Configurer le transporteur pour l'e-mail (par exemple, utiliser Ethereal pour du test)
        const transporter = nodemailer.createTransport({
            host: 'smtp.ethereal.email',
            port: 587,
            auth: {
                user: 'sigurd33@ethereal.email',
                pass: 'b7qTxj2anGPtG1jV6P'
            }
        });

        const resetLink = `http://localhost:5173/reset-password?otp=${otp}`;

        // Envoyer l'OTP par e-mail
        await transporter.sendMail({
            to: email,
            subject: 'Réinitialisation de votre mot de passe',
            html: `
                <p>Bonjour ${user.username.trim()},</p>
                <p>Voici votre code de réinitialisation de mot de passe :</p>
                <h3>${otp}</h3>
                <p>Ce code expirera dans 10 minutes. Cliquez sur le lien suivant pour réinitialiser votre mot de passe :</p>
                <a href="${resetLink}">${resetLink}</a>
            `,
        });

        return res.status(200).json({ message: 'Code OTP envoyé par email.' });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Erreur interne du serveur' });
    }
};