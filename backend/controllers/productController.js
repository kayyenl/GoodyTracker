const asyncHandler = require("express-async-handler")
const Product = require("../models/productModel")
const { fileSizeFormatter } = require("../utils/fileUpload")

const createProduct = asyncHandler(async(req, res) => {
    const {name, sku, category, quantity, price, description} = req.body

    //we do validation to check if all fields are entered by user
    if (!name || !category || !quantity || !price || !description) {
        res.status(400)
        throw new Error("Please fill in all fields.")
    }

    //handle the image upload of product (optional for the user)
    //we are formatting the "image" attribute for storing in the mongoDB
    let fileData = {}
    if (req.file) {
        fileData = {
            fileName: req.file.originalname,
            filePath: req.file.path,
            fileType: req.file.mimetype,
            fileSize: fileSizeFormatter(req.file.size, 2),
        }
    }
    
    
    //create product
    const product = await Product.create({
        user: req.user,
        name,
        sku,
        category,
        quantity,
        price,
        description, 
        image: fileData
    })

    res.status(200).json(product)

})

module.exports = {
    createProduct,
}