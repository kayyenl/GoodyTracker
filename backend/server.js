const dotenv = require("dotenv").config()
const express = require("express")
const mongoose = require("mongoose")
const bodyParser = require("body-parser")
const cors = require("cors")

const app = express()

const PORT = process.env.PORT || 5000

// Connect to DB and THEN FIRE UP THE server (we just do it here in the server, some people do it in a separate file)
// SO, the few lines below allow us to connect to mongodb and also create the server in one swipe.
// The app.listen() method binds itself with the specified host and port to bind and listen for any connections.
mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
        app.listen(PORT, () => {
            console.log(`Server Running on port ${PORT}`)
        })
    })
    .catch((err) => console.log(err))
