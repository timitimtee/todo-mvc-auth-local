const express = require('express')
const router = express.Router()
const authController = require('../controllers/auth')

router.get('/me', authController.getMe)
router.post('/login', authController.postLogin)
router.post('/logout', authController.logout)
router.post('/signup', authController.postSignup)

module.exports = router
