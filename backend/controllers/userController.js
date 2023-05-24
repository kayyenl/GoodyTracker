const asyncHandler = require('express-async-handler')
//after adding asyncHandler, we dont need to put a try catch block inside our code.
const User = require('../models/userModel')

//functions interacting with databases should be async.
const registerUser = asyncHandler(async (req, res) => {
    const { name, email, password } = req.body

    //validation of user particulars in backend
    if (!name || !email || !password) {
        res.status(400)
        throw new Error("Please fill in all the required fields.")
    }

    if (password.length < 6) {
        res.status(400)
        throw new Error("Password must be at least 6 characters.")
    }

    //check if user's email already exists
    //anytime we wish to talk to database, we use model
    const userEmailExists = await User.findOne({email})

    if (userEmailExists) {
        res.status(400)
        throw new Error("This email has already been registered")
    }

    //Create new user
    const user = await User.create({
        name,
        email,
        password
    })

    if (user) { //here we are getting the details of user back from db.
        //we are getting data back from mongoDB in json format
        //status code 201 means new user created
        const { _id, name, email, photo, phone, bio } = user
        res.status(201).json({
            _id, name, email, photo, phone, bio
        }) 
    } else {
        res.status(400)
        throw new Error("Invalid user data")
    }
})

module.exports = {
    registerUser,
}