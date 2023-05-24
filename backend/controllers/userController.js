const asyncHandler = require('express-async-handler')
//after adding asyncHandler, we dont need to put a try catch block inside our code.
const User = require('../models/userModel')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')

const generateToken = (id) => {
    //parameters of jwt.sign: 
    //1. an object aka. what attirbutes do u wanna create the token with? id here
    //2. slow in our jwt secret, stored in our env
    //3. how long do u want this token to last?
    return jwt.sign({ id }, process.env.JWT_SECRET, {expiresIn: "1d"})
}

//functions interacting with databases should be async.
//Register User
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
    const user = await User.create({ //so User.create returns a mongodb object with new attributes.
        name,
        email,
        password,
    })


    //Generate token 
    const token = generateToken(user._id)

    //Send HTTP-only cookie 
    //A cookie is a piece of data from a website that is stored within a web browser that the website can retrieve at a later time.
    res.cookie("token", token, {
        path: "/",
        httpOnly: true,
        expires: new Date(Date.now() + 1000 * 86400), //1 day
        sameSite: 'none', //altho we use vercel for frontend and render for backend, i still want this to work.
        secure: true, //in a local environment, it is only executed when deployed.
    }) //argument is what u want the cookie to be saved as in the frontend

    if (user) { //here we are getting the details of user back from db.
        //we are getting data back from mongoDB in json format
        //status code 201 means new user created
        const { _id, name, email, photo, phone, bio } = user
        res.status(201).json({
            _id, name, email, photo, phone, bio, token
        }) 
    } else {
        res.status(400)
        throw new Error("Invalid user data")
    }
})

//Login User
const loginUser = asyncHandler(async (req, res) => {

    const { email, password } = req.body

    //We want to validate the request
    if (!email || !password) {
        res.status(400)
        throw new Error("Please add your email and password")
    }

    //Check if user exists
    const user = await User.findOne({ email })
    if (!user) {
        res.status(400)
        throw new Error("User not found! Please sign up if you have no account.")
    }

    //If user exists, check if the password is the same'
    //we stored the password after getting hashed by bcrypt
    //using bcrypt, we can also check if the raw password is same as hashed
    const passwordIsCorrect = await bcrypt.compare(password, user.password)

    const token = generateToken(user._id)
    //THIS TOKEN CHANGES EVERY GENERATE!!! MUST KNOW

    res.cookie("token", token, {
        path: "/",
        httpOnly: true,
        expires: new Date(Date.now() + 1000 * 86400), //1 day
        sameSite: 'none', //altho we use vercel for frontend and render for backend, i still want this to work.
        secure: true, //in a local environment, it is only executed when deployed.
    })

    if (user && passwordIsCorrect) {
        const { _id, name, email, photo, phone, bio } = user
        res.status(200).json({   //status code 200 denotes a successful response.
            _id, name, email, photo, phone, bio, token
        }) 
    } else {
        res.status(400)
        throw new Error("Invalid email or password entered.")
    }

    //now, we have to generate the token and send the cookie to frontend
})

const logout = asyncHandler(async (req, res) => {
    //to logout, we can either DELETE, or EXPIRE the cookie.

    res.cookie("token", "", { //second argument is empty string as we are not saving anything this time.
        path: "/",
        httpOnly: true,
        expires: new Date(0), //immediately expires the cookie.
        sameSite: 'none', //altho we use vercel for frontend and render for backend, i still want this to work.
        secure: true, //in a local environment, it is only executed when deployed.
    })

    res.status(200).json({ message: "Successfully logged out."})
})

//Get users data / profile
const getUser = asyncHandler(async (req, res) => {
    res.send("get user data")
})

module.exports = {
    registerUser,
    loginUser,
    logout,
    getUser,
}