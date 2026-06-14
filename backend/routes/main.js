const express = require('express')
const rateLimit = require('express-rate-limit')
const router = express.Router()
const authController = require('../controllers/auth')

// Throttle auth endpoints -> blunts password brute-force + signup spam.
// 20 attempts / 15 min per IP. Tune as needed.
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { errors: [{ msg: 'Too many attempts. Please try again later.' }] },
})

router.get('/me', authController.getMe)
router.post('/login', authLimiter, authController.postLogin)
router.post('/logout', authController.logout)
router.post('/signup', authLimiter, authController.postSignup)

module.exports = router
