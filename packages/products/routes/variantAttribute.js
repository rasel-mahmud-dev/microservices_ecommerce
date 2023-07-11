
const connectDatabase = require("../database");
const Joi = require("joi");
const router = require("express").Router()



// get variant attributes
router.get("/", async function (req, res, next) {
    try {
        let client = await connectDatabase()
        let {rows} = await client.query("select * from variant_attributes")
        res.send(rows)

    } catch (ex) {
        next(ex)
    }
})


// add variant_attributes
router.post("/", async function (req, res, next) {

    const schema = Joi.object({
        variant_id: Joi.number().required(),
        attribute_id: Joi.number().required(),
        value: Joi.any().required(),
    })

    try {

        const { variant_id, attribute_id, value } = req.body


        const {error} = await schema.validate({
            variant_id, attribute_id, value
        })
        if(error?.message) return next(Error(error.message))

        let client = await connectDatabase()

        const sql = `
             SELECT variant_attribute_id FROM variant_attributes
                WHERE variant_id = $1 OR attribute_id = $2 OR value = $3`

        let result = await client.query(sql, [variant_id, attribute_id, value])
        if(result.rowCount > 0) return next("variant_attributes already exists")

        let {
            rowCount,
            rows
        } = await client.query(`
            insert into variant_attributes (variant_id, attribute_id, value) VALUES($1, $2, $3) RETURNING *`,
            [variant_id, attribute_id, value])

        if (rowCount) {
            res.status(201).send(rows[0])
        } else {
            next("variant_attribute_id adding fail")
        }

    } catch (ex) {
        next(ex)
    }
})


// delete variant_attributes
router.delete("/:variantAttributeId", async function (req, res, next) {
    try {
        let client = await connectDatabase()
        let {rowCount} = await client.query("DELETE FROM variant_attributes WHERE variant_attribute_id = $1", [req.params.variantAttributeId])
        if(rowCount){
            res.send("variant_attributes has been deleted")
        } else {
            next("variant_attributes already deleted or not exists")
        }

    } catch (ex) {
        next(ex)
    }
})



module.exports = router