const category = require("./category");
const attribute = require("./attribute");
const router = require("express").Router()


router.use("/category", category)
router.use("/attribute", attribute)


module.exports = router