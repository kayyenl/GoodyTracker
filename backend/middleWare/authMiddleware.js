const asyncHandler = require('express-async-handler')
const User = require('../models/userModel')
const jwt = require('jsonwebtoken')

const protect = asyncHandler(async (req, res, next) => {
    try {        
        const token = req.cookies.token
        if (!token) {
            res.status(401)  //this status code is for unauthorized response
            throw new Error("Not authorized, please sign in again.")
        }

        //Verify Token
        //we can use the jwt package to verify the authenticity of the token.
        //resume: used jwt to verify tokens to protect unauthorized access efficiently
        const verified = jwt.verify(token, process.env.JWT_SECRET)
        //we can actually get the user id from token, cus we initialized a token using the users permanent id.
        const user = await User.findById(verified.id).select("-password") //this syntax is useful to remove fields udw  to see. Eg. since we do not wish to return the user's password, we use the syntax to prevent sending it.

        if (!user) {
            res.status(401)
            throw new Error("User not found.")
        }

        req.user = user
        next()
    } catch(error) {
        res.status(401)  //this status code is for unauthorized response
        throw new Error("Not authorized, please sign in again.")
    }
})

module.exports = protect