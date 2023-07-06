const connectDatabase = require("../database");
const router = require("express").Router()

// get all products
router.get("/", async function (req, res, next) {
    try {
        let client = await connectDatabase()
        let {rows} = await client.query("select * from products")
        res.send(rows)

    } catch (ex) {
        next(ex)
    }
})


// add product
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


// update product
router.patch("/:productId", async function (req, res, next) {
    try {
        const {title, price, description} = req.body
        let client = await connectDatabase()

        console.log(req.body)

        const sql = `
            UPDATE products
                SET title = $1,
                price = $2,
                description = $3 
            WHERE product_id = $4 RETURNING *
        `
        let {rowCount, rows} = await client.query(sql, [title, price, description, req.params.productId])

        if (rowCount) {
            res.status(201).send(rows[0])
        } else {
            next("Product update fail")
        }

    } catch (ex) {
        next(ex)
    }
})


// delete product
router.delete("/:productId", async function (req, res, next) {
    try {
        let client = await connectDatabase()
        let {rowCount} = await client.query("DELETE FROM products WHERE product_id = $1", [req.params.productId])
        if(rowCount){
            res.send("Product has been deleted")
        } else {
            next("Product already deleted or not exists")
        }

    } catch (ex) {
        next(ex)
    }
})



module.exports = router