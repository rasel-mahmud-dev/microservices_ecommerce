const connectDatabase = require("../database");
const router = require("express").Router()


// get all attributes
router.get("/", async function (req, res, next) {
    try {
        let client = await connectDatabase()
        let {rows} = await client.query("select * from attributes")
        res.send(rows)

    } catch (ex) {
        next(ex)
    }
})


// add attribute
router.post("/", async function (req, res, next) {
    try {
        const {name, description, attributeValues} = req.body
        let client = await connectDatabase()

        let result = await client.query("select name from attributes where name = $1", [name])
        if (result.rowCount > 0) return next(name + " attribute already exists")

        let {
            rowCount,
            rows
        } = await client.query(`insert into attributes(name, description) VALUES($1, $2) RETURNING *`, [name, description])


        if (attributeValues) {
            for (let attributeValue of attributeValues) {
                let response = await client.query(
                    `insert into attribute_values(value, label) VALUES($1, $2) RETURNING *`,
                    [attributeValue.value, attributeValue.label]
                )
                console.log(response.rowCount)
            }
        }

        if (rowCount) {
            res.status(201).send(rows[0])
        } else {
            next("attribute adding fail")
        }

    } catch (ex) {
        next(ex)
    }
})


// update attribute
router.patch("/:attributeId", async function (req, res, next) {
    try {
        const {attributeId} = req.params
        const {name, description, attributeValues} = req.body
        let client = await connectDatabase()

        if (!attributeId) return next("Please provide attribute id")

        let result = await client.query("select name from attributes where attribute_id = $1", [attributeId])
        if (result.rowCount === 0) return next("attribute not exits")

        result = await client.query(`
                update attributes 
                    set name = $1, 
                    description = $2
               WHERE attribute_id = $3 RETURNING *`, [name, description, attributeId])

        if (attributeValues) {
            for (let attributeValue of attributeValues) {
                /// here maybe two cases either update or create a new one

                if (!attributeValue.value) continue;

                if (attributeValue.attribute_value_id) {
                    let response = await client.query(`
                        update attribute_values 
                            set value = $1, 
                            label = $2, 
                            attribute_id = $3
                           WHERE attribute_value_id = $4
                        RETURNING *`,
                        [
                            attributeValue.value,
                            attributeValue.label,
                            attributeId,
                            attributeValue.attribute_value_id
                        ]
                    )
                } else {
                    let response = await client.query(
                        `insert into attribute_values(value, label, attribute_id) VALUES($1, $2, $3) RETURNING *`,
                        [
                            attributeValue.value,
                            attributeValue.label,
                            attributeId
                        ]
                    )
                }
            }
        }

        res.status(201).send({})

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