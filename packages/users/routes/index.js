const router = require("express").Router()
const user = require("./user");


router.use("/api/users", user)


module.exports = router