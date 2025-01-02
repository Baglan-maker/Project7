const pool = require('../config/db');

exports.getAllUsers = async (req, res) => {
    try {
        const query = 'SELECT iin, full_name, city FROM users';
        const result = await pool.query(query);
        res.status(200).json(result.rows);
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ message: "Server error" });
    }
};
