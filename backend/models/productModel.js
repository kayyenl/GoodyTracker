const mongoose = require('mongoose')

const productSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "uSEr" //i think "users" or "user" does not matter?
    }, 
    name: {
        type: String,
        required: [true, "Please add a name"],
        trim: true,
    }, 
    SKU: { //this will be unique
        type: String,
        required: true, //we generate this from frontend
        default: "SKU",
    }, 
    category: {
        type: String,
        required: [true, "Please add a category"],
        trim: true,
    }, 
    quantity: {
        type: String,
        required: [true, "Please add a quantity"],
        trim: true,
    }, 
    price: {
        type: String,
        required: [true, "Please add a price"],
        trim: true,
    }, 
    description: {
        type: String,
        required: [true, "Please add a description"],
        trim: true,
    }, 
    image: {
        type: Object,
        default: {} //img will be an obj that contains several properties
    }, 
}, {
    timestamps: true,
})

const Product = mongoose.model("product", productSchema)
module.exports = Product