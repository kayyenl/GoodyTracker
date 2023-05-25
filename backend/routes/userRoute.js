const express = require('express')
const router = express.Router() // a mini standalone app. like a small app placeholder.
const { registerUser, loginUser, logout, getUser, loginStatus, updateUser, changePassword, forgotPassword } = require('../controllers/userController')
const protect = require('../middleWare/authMiddleware')

router.post("/register", registerUser)
//registeruser will be in another class, wrt to separation of concerns
router.post("/login", loginUser)
router.get("/logout", logout) 
//logout will be a get request, because we arent sending any data
//Both GET and POST method is used to transfer data from client to server in HTTP protocol but Main difference between POST and GET method is that GET carries request parameter appended in URL string while POST carries request parameter in message body which makes it more secure way of transferring data from client to server. 

router.get('/getuser', protect, getUser)
//we need to protect this endpoint, by checking if the user is logged in, 
//banning access to the endpoint of the user is not logged in.
//we do this by a middleware function, that will be in the middleware folder cus it will be used in 
//different parts of the application.
//through a req.user property, this protect middleware will provide user info if request is valid

router.get("/loggedin", loginStatus)
//this is to check if the user is currently logged in

router.patch("/updateuser", protect, updateUser)
//this does a partial change on user's fields.

router.patch("/changepassword", protect, changePassword)

router.post("/forgotpassword", forgotPassword)
//post route as the user would have to send us their email


module.exports = router