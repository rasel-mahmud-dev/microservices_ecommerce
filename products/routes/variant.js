const connectDatabase = require("../database");
const router = require("express").Router()
const Joi = require("joi")


// get all variants
router.get("/", async function (req, res, next) {
    try {
        let client = await connectDatabase()
        let {rows} = await client.query("select * from variants")
        res.send(rows)

    } catch (ex) {
        next(ex)
    }
})


// create variant
router.post("/", async function (req, res, next) {
    const schema = Joi.object({
        sku: Joi.string()
            .required().label("SKU"),
        product_id: Joi.number()
            .required().label("Product Id"),
    }).unknown(true);

    try {
        let {error} = await schema.validate(req.body, {abortEarly: true})
        if(error?.message) return next(Error(error.message))

        const {  sku, product_id} = req.body

        let client = await connectDatabase()

        // check group match by sku + productId if a variant is existed or not.
        // let result = await client.query("select name from variants where sku = $1", [name])
        // if(result.rowCount > 0) return next(name + " attribute already exists")

        let {
            rowCount,
            rows
        } = await client.query(`insert into variants(sku, product_id) VALUES($1, $2) RETURNING *`, [sku, product_id])

        if (rowCount) {
            res.status(201).send(rows[0])
        } else {
            next("variant adding fail")
        }

    } catch (ex) {
        next(ex)
    }
})


module.exports = router