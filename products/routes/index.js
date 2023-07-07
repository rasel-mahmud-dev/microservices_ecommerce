const router = require("express").Router()
const category = require("./category");
const attribute = require("./attribute");
const product = require("./product");
const variant = require("./variant");
const variantAttribute = require("./variantAttribute");


router.use("/api/category", category)
router.use("/api/attributes", attribute)
router.use("/api/variants", variant)
router.use("/api/variant-attribute", variantAttribute)
router.use("/api/products", product)


module.exports = router