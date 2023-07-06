const connectDatabase = require("../database");
const router = require("express").Router()


router.get("/", async function (req, res, next) {
    try {
        let client = await connectDatabase()
        let {rows} = await client.query("select * from products")
        res.send(rows)

    } catch (ex) {
        next(ex)
    }
})


// add category
router.post("/", async function (req, res, next) {
    try {
        const {title, price, description} = req.body
        let client = await connectDatabase()

        let {
            rowCount,
            rows
        } = await client.query(`insert into products(title, price, description) VALUES($1, $2, $3) RETURNING *`, [title, price, description])

        if (rowCount) {
            res.status(201).send(rows[0])
        } else {
            next("Product adding fail")

        }

    } catch (ex) {
        next(ex)
    }
})


module.exports = router