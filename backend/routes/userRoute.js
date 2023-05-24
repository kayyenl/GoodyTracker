const express = require('express')
const router = express.Router() // a mini standalone app. like a small app placeholder.
const { registerUser } = require('../controllers/userController')

router.post("/register", registerUser)
//registeruser will be in another class, wrt to separation of concerns

module.exports = router