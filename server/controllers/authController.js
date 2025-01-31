const bcrypt = require('bcrypt');
const pool = require('../config/db');
const jwt = require('jsonwebtoken');
const axios = require("axios");
const { generateAccessToken, generateRefreshToken } = require('../utils/jwt');
const crypto = require('crypto');
const { sendEmail } = require('../config/mailer');
const { passwordResetTemplate } = require('../utils/emailTemplate');

const isSecureCookie = process.env.NODE_ENV === 'production';
const sameSiteCookie = process.env.NODE_ENV === 'production' ? 'none' : 'strict';
const RECAPTCHA_SECRET_KEY = process.env.RECAPTCHA_SECRET_KEY;

// Запрос сброса пароля
exports.forgotPassword = async (req, res) => {
    const { iin } = req.body;

    try {
        const query = 'SELECT * FROM users WHERE iin = $1';
        const result = await pool.query(query, [iin]);

        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Пользователь с таким ИИН не найден." });
        }

        const user = result.rows[0];
        const resetToken = crypto.randomBytes(32).toString('hex');
        const tokenExpiration = new Date(Date.now() + 15 * 60 * 1000); // 15 минут

        // Сохранение токена и срока действия в базе данных
        await pool.query(
            'UPDATE users SET password_reset_token = $1, token_expiration = $2 WHERE iin = $3',
            [resetToken, tokenExpiration, iin]
        );

        const resetLink = `${process.env.PROD_CLIENT_URL}/auth/reset-password?token=${resetToken}`;
        const html = passwordResetTemplate(resetLink, 15);

        await sendEmail(user.email, 'Сброс пароля', html);

        return res.status(200).json({ message: "Инструкции по сбросу пароля отправлены на вашу почту." });
    } catch (error) {
        console.error('Ошибка при запросе сброса пароля:', error);
        return res.status(500).json({ message: "Ошибка сервера." });
    }
};

// Сброс пароля
exports.resetPassword = async (req, res) => {
    const { token, newPassword } = req.body;

    try {
        const query = `
            SELECT * FROM users
            WHERE password_reset_token = $1 AND token_expiration > NOW()
        `;
        const result = await pool.query(query, [token]);

        if (result.rows.length === 0) {
            return res.status(400).json({ message: "Токен недействителен или истек." });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        await pool.query(
            `
                UPDATE users
                SET password_hash = $1, password_reset_token = NULL, token_expiration = NULL
                WHERE password_reset_token = $2
            `,
            [hashedPassword, token]
        );

        return res.status(200).json({ message: "Пароль успешно сброшен." });
    } catch (error) {
        console.error('Ошибка при сбросе пароля:', error);
        return res.status(500).json({ message: "Ошибка сервера." });
    }
};


// Логика аутентификации
exports.login = async (req, res) => {
    const { iin, password } = req.body;

    try {
        const query = 'SELECT * FROM users WHERE iin = $1';
        const result = await pool.query(query, [iin]);

        if (result.rows.length === 0) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        const user = result.rows[0];
        const isPasswordValid = await bcrypt.compare(password, user.password_hash);

        if (isPasswordValid) {
            const payload = { iin: user.iin, fullName: user.full_name };
            const accessToken = generateAccessToken(payload);
            const refreshToken = generateRefreshToken(payload);

            res.cookie('accessToken', accessToken, {
                httpOnly: true,
                secure: isSecureCookie,
                sameSite: sameSiteCookie,
                maxAge: 15 * 60 * 1000, // 15  минут
            });

            res.cookie('refreshToken', refreshToken, {
                httpOnly: true,
                secure: isSecureCookie,
                sameSite: sameSiteCookie,
                maxAge: 7 * 24 * 60 * 60 * 1000, // 7 дней
            });

            return res.json({ accessToken });
        } else {
            return res.status(401).json({ message: "Invalid credentials" });
        }
    } catch (error) {
        console.warn('Error during login:', error);
        return res.status(500).json({ message: "Server error" });
    }
};

// Логика регистрации
exports.register = async (req, res) => {
    const { iin, email, fullName, birthDate, city, password, recaptchaToken } = req.body;

    try {
        // Проверка токена reCAPTCHA
        const recaptchaResponse = await axios.post(
            "https://www.google.com/recaptcha/api/siteverify",
            null,
            {
                params: {
                    secret: RECAPTCHA_SECRET_KEY,
                    response: recaptchaToken,
                },
            }
        );

        const { success, score } = recaptchaResponse.data;

        if (!success || score < 0.5) {
            return res.status(400).json({ message: "CAPTCHA verification failed" });
        }

        const checkEmailQuery = "SELECT * FROM users WHERE email = $1";
        const emailResult = await pool.query(checkEmailQuery, [email]);

        if (emailResult.rowCount > 0) {
            return res.status(400).json({ message: "Email already exists" });
        }

        // Хэширование пароля
        const hashedPassword = await bcrypt.hash(password, 10);

        const query = `
            INSERT INTO users (iin, email, full_name, birth_date, city, password_hash)
            VALUES ($1, $2, $3, $4, $5, $6)
        `;
        await pool.query(query, [iin, email, fullName, birthDate, city, hashedPassword]);

        return res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
        console.error('Error during registration:', error);

        if (error.code === '23505') {
            return res.status(400).json({ message: "IIN already taken" });
        }

        return res.status(500).json({ message: "Server error1" });
    }
};

exports.refreshToken = (req, res) => {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
        return res.status(400).json({ message: "Refresh token is required" });
    }

    try {
        const payload = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
        const newAccessToken = generateAccessToken({ iin: payload.iin, fullName: payload.fullName });

        res.cookie('accessToken', newAccessToken, {
            httpOnly: true,
            secure: isSecureCookie,
            sameSite: sameSiteCookie,
            maxAge: 15 * 60 * 1000, // 15 минут
        });

        return res.status(200).json({ message: "Access token refreshed" });
    } catch (error) {
        console.error('Error during token refresh:', error);
        return res.status(401).json({ message: "Invalid or expired refresh token" });
    }
};

exports.checkAuth = (req, res) => {
    const accessToken = req.cookies.accessToken;

    if (!accessToken) {
        return res.status(401).json({ message: "Неавторизован" });
    }

    try {
        const payload = jwt.verify(accessToken, process.env.JWT_SECRET);
        return res.status(200).json({ message: "Авторизация успешна", user: payload });
    } catch (error) {
        console.error('Ошибка авторизации:', error);
        return res.status(401).json({ message: "Неверный или истекший токен" });
    }
};


exports.logout = async (req, res) => {
    res.clearCookie('accessToken', { httpOnly: true, secure: isSecureCookie, sameSite: sameSiteCookie });
    res.clearCookie('refreshToken', { httpOnly: true, secure: isSecureCookie, sameSite: sameSiteCookie });
    return res.status(200).json({ message: 'Logged out' });
};