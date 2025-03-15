const express = require('express');
const router = express.Router();
const authController = require('./authcontroller');
const authMiddleware = require('./authmidllewere');

// Public routes
router.post('/register', authController.register);
router.post('/login', authController.login);

// Protected route (only for Admin)
router.get('/admin', [authMiddleware.verifyToken, authMiddleware.isAdmin], (req, res) => {
    res.status(200).send('Welcome Admin');
});

// Protected route (only for Editor or Admin)
router.get('/editor', [authMiddleware.verifyToken, authMiddleware.isEditor], (req, res) => {
    res.status(200).send('Welcome Editor');
});

module.exports = router;
