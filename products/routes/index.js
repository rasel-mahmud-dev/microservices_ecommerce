const category = require("./category");
const attribute = require("./attribute");
const product = require("./product");
const router = require("express").Router()


router.use("/api/category", category)
router.use("/api/attributes", attribute)
router.use("/api/products", product)


module.exports = router