const connectDatabase = require("../database");
const {func} = require("joi");
const router = require("express").Router()


// get all cart products
router.get("/", async function (req, res, next) {
    let client = null
    try {
        client = await connectDatabase()


    } catch (ex) {
        next(ex)
    }
})


// add cart
router.post("/", async function (req, res, next) {
    try {
        const {

        } = req.body

        let client = await connectDatabase()

        let cartId = ""

        res.status(201).json({
            message: "Cart successfully added"
        })

    } catch (ex) {
        next(ex)
    }
})


// delete cart
router.delete("/:cartId", async function (req, res, next) {
    try {
        let client = await connectDatabase()
        let {rowCount} = await client.query("DELETE FROM carts WHERE cart_id = $1", [req.params.cartId])
        if (rowCount) {
            res.send("Cart has been deleted")
        } else {
            next("Cart already deleted or not exists")
        }

    } catch (ex) {
        next(ex)
    }
})


module.exports = router