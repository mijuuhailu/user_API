const express = require('express')
const authMiddleware = require('../middleware/authmiddleware')
const {userProfile} = require('../controllers/userController')

const router = express.Router()

router.get("/profile", authMiddleware, userProfile )

module.exports = router