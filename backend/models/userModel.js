const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

//mongoose also has a functionality to modify one of the fields before u save it
//this is good for password encryption

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please add your name"],
    },
    email: {
        type: String,
        required: [true, "Please add an email"],
        unique: true,
        trim: true,
        match: [
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
            "Please enter a valid email"
        ]
    },
    password: {
        type: String,
        required: [true, "Please add your password"],
        minLength: [6, "Password must be up to 6 characters."],
        // maxLength: [23, "Password must not be more than 23 characters."] we settle this
        // on the frontend, since the hashedpassword usually will contain more than 23 words
    },
    photo: {
        type: String,
        required: [true, "Please add a photo."],
        default: "https://i.ibb.co/4pDNDk1/avatar.png"
    }, 
    phone: {
        type: String,
        default: "+65"
    },
    bio: {
        type: String,
        maxLength: [250, "Bio must not be more than 250 characters."],
        default: "bio"
    }
}, {
    timestamps: true
})

//Encrypt the password before saving to db
//In cryptography, a salt is random data that is used as an additional input to a one-way function that hashes data, a password or passphrase. Salts are used to safeguard passwords in storage.
// //also, we may need to manipulate this password when pw changes, is set when forgotten, and when registered.
//Encrypt password befroe saving to DB
//we actually pass in an async lambda function
//we must also pass in next apparently, for the code beyond this lambda function
//to be executed. the method pre is for pre Schema method operations. 
userSchema.pre("save", async function(next) {
    if (!this.isModified("password")) {
        return next() //the next piece of middleware, get out of this one
    }

    //Hash password
    const salt = await bcrypt.genSalt(10) //argument of how long u want the salt to be
    const hashedPassword = await bcrypt.hash(this.password, salt) //since password is not init-ed yet, we do "this"
    this.password = hashedPassword
    next()
    //so, this will fire when registering, changing password within app, resetting password.
})

const User = mongoose.model("User", userSchema)
module.exports = User