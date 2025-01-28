const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const authMiddleware = require('../middleware/authMiddleware');
const userController = require('../controllers/userController');

router.post("/login", authController.login);
router.post("/register", authController.register);
router.post("/refresh", authController.refreshToken);
router.get("/users", authMiddleware, userController.getAllUsers);
router.get('/check', authMiddleware, authController.checkAuth);
router.post("/logout", authController.logout);
router.post('/forgot-password', authController.forgotPassword);
router.post('/reset-password', authController.resetPassword);

module.exports = router;
