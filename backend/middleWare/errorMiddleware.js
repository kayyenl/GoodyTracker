const asyncHandler = require('express-async-handler')
//after adding asyncHandler, we dont need to put a try catch block inside our code.
const User = require('../models/userModel')

const errorHandler = (err, req, res, next) => {
    const statusCode = res.statusCode ? res.statusCode : 500
    res.status(statusCode)

    res.json({
        message: err.message,
        stack: process.env.NODE_ENV === "development" ? 
            err.stack : null,
    })
}

module.exports = errorHandler