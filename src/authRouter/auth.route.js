const express = require('express')
const authController = require('../authController/auth.controller')
const router = express.Router()

router.get('/auth/callback' , authController.authCallback )
router.post('/generateToken' , authController.generateRefreshToken)
router.post('/angel/placeOrder' , authController.placeOrder)



module.exports = router