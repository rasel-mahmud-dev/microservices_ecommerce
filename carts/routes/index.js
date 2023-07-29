const router = require("express").Router()
const cart = require("./cart");
const auth = require("../middleware/auth");


router.use("/api/carts", auth, cart)


module.exports = router