const express = require('express')
const router = express.Router() // a mini standalone app. like a small app placeholder.
const protect = require('../middleWare/authMiddleware')
const { createProduct } = require('../controllers/productController')
const { upload } = require('../utils/fileUpload')

router.post("/", protect, upload.single("image"), createProduct) //we have access to "user" since we passed in protect here

module.exports = router