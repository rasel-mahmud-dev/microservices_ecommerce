const connectDatabase = require("../database");
const Joi = require("joi");
const router = require("express").Router()


// get all attribute-value
router.get("/", async function (req, res, next) {
    try {
        const {group_by} = req.query

        let client = await connectDatabase()
        let result
        if (group_by) {
            result = await client.query(`
                select 
                   attribute_id,
                  JSON_AGG(json_build_object('attribute_value_id', attribute_value_id, 'value', value, 'label', label)) AS values
                from attribute_values
                GROUP BY attribute_id
            `)
        } else {
            result = await client.query("select * from attribute_values")
        }

        res.send(result?.rows || [])

    } catch (ex) {
        next(ex)
    }
})


// get all specific values of attribute
router.get("/:attributeId", async function (req, res, next) {
    try {
        let client = await connectDatabase()
        let {rows} = await client.query("select * from attribute_values where attribute_id = $1", [req.params.attributeId])
        res.send(rows)

    } catch (ex) {
        next(ex)
    }
})


// add attribute-value
router.post("/", async function (req, res, next) {

    const schema = Joi.object({
        value: Joi.string()
            .required().label("value"),
        attribute_id: Joi.number()
            .required().label("attribute_id"),
    }).unknown(true);


    try {
        const {value, attribute_id, label = ""} = req.body
        let client = await connectDatabase()

        let {error} = await schema.validate({
            value,
            attribute_id
        }, {abortEarly: true})
        if (error?.message) return next(Error(error.message))


        let result = await client.query("select attribute_value_id from attribute_values where value = $1 AND attribute_id = $2 ", [value, attribute_id])
        if (result.rowCount > 0) return next(value + " attribute_value already exists")

        let {
            rowCount,
            rows
        } = await client.query(`insert into attribute_values(value, attribute_id, label) VALUES($1, $2, $3) RETURNING *`, [value, attribute_id, label])

        if (rowCount) {
            res.status(201).send(rows[0])
        } else {
            next("attribute_values adding fail")
        }

    } catch (ex) {
        next(ex)
    }
})


// update attribute
router.patch("/:attributeId", async function (req, res, next) {
    try {
        const {name, description} = req.body
        let client = await connectDatabase()

        const schema = Joi.object({
            value: Joi.string()
                .required().label("value"),
            attribute_id: Joi.number()
                .required().label("attribute_id"),
        }).unknown(true);

        let {error} = await schema.validate(req.body, {abortEarly: true})
        if (error?.message) return next(Error(error.message))


        const sql = `
            UPDATE attributes
                SET name = $1,
                description = $2 
            WHERE product_id = $3 RETURNING *
        `
        let {rowCount, rows} = await client.query(sql, [name, description, req.params.attributeId])

        if (rowCount) {
            res.status(201).send(rows[0])
        } else {
            next("attribute update fail")
        }

    } catch (ex) {
        next(ex)
    }
})


// delete attribute
router.delete("/:attributeId", async function (req, res, next) {
    try {
        let client = await connectDatabase()
        let {rowCount} = await client.query("DELETE FROM attributes WHERE product_id = $1", [req.params.attributeId])
        if (rowCount) {
            res.send("attribute has been deleted")
        } else {
            next("attribute already deleted or not exists")
        }

    } catch (ex) {
        next(ex)
    }
})


module.exports = router