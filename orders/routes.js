const connectDatabase = require("./database");
const auth = require("./middleware/auth");
const router = require("express").Router()


/**
 Retrieve all orders for a specific user.
 @route GET /api/orders
 @returns []
 */

router.get("/api/orders", auth, async function (req, res, next) {
    let client = null
    try {
        client = await connectDatabase()
        let {rows} = await client.query(`
          select * from orders where user_id = $1`
            [req.user.user_id]
        )
        res.send(rows)

    } catch (ex) {
        next(ex)
    }
})



module.exports = router