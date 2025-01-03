const bcrypt = require('bcrypt');
const pool = require('../config/db');
const jwt = require('jsonwebtoken');
const { generateAccessToken, generateRefreshToken } = require('../utils/jwt');

const isSecureCookie = process.env.NODE_ENV === 'production';
const sameSiteCookie = process.env.NODE_ENV === 'production' ? 'Strict' : 'none';

// Логика аутентификации
exports.login = async (req, res) => {
    const { iin, password } = req.body;

    try {
        const query = 'SELECT * FROM users WHERE iin = $1';
        const result = await pool.query(query, [iin]);

        if (result.rows.length === 0) {
            return res.status(401).json({ message: "Invalid credentials" });
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
    const { iin, fullName, birthDate, city, password } = req.body;

    try {
        // Хэширование пароля
        const hashedPassword = await bcrypt.hash(password, 10);

        const query = `
            INSERT INTO users (iin, full_name, birth_date, city, password_hash)
            VALUES ($1, $2, $3, $4, $5)
        `;
        await pool.query(query, [iin, fullName, birthDate, city, hashedPassword]);

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
    console.log(req.cookies);

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