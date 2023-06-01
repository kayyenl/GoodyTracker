const dotenv = require("dotenv").config()
const express = require("express")
const mongoose = require("mongoose")
const bodyParser = require("body-parser")
const cors = require("cors")
const userRoute = require('./routes/userRoute')
const productRoute = require('./routes/productRoute')
const errorHandler = require('./middleWare/errorMiddleware')
const cookieParser = require('cookie-parser')
const path = require("path")

const app = express()

//Middlewares
app.use(express.json()) //help us handle json data in our application
app.use(cookieParser())
app.use(express.urlencoded({ extended: false })) //help us handle data that comes via url
app.use(bodyParser.json())
app.use(cors())
app.use("/uploads", express.static(path.join(__dirname, "uploads")))

//Middleware Routes
app.use("/api/users", userRoute)
app.use("/api/products", productRoute)

//Routes
app.get('/', (req, res) => {
    res.send("Home Page")
})

//Error Middleware
app.use(errorHandler)

// Connect to DB and THEN FIRE UP THE server (we just do it here in the server, some people do it in a separate file)
// SO, the few lines below allow us to connect to mongodb and also create the server in one swipe.
// The app.listen() method binds itself with the specified host and port to bind and listen for any connections.
const PORT = process.env.PORT || 5000
mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
        app.listen(PORT, () => {
            console.log(`Server Running on port ${PORT}`)
        })
    })
    .catch((err) => console.log(err))
