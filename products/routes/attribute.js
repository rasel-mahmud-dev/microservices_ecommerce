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
        const { name, description} = req.body
        let client = await connectDatabase()

        let result = await client.query("select name from attributes where name = $1", [name])
        if(result.rowCount > 0) return next(name + " attribute already exists")

        let {
            rowCount,
            rows
        } = await client.query(`insert into attributes(name, description) VALUES($1, $2) RETURNING *`, [name, description])

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
        const { name, description} = req.body
        let client = await connectDatabase()

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
        if(rowCount){
            res.send("attribute has been deleted")
        } else {
            next("attribute already deleted or not exists")
        }

    } catch (ex) {
        next(ex)
    }
})



module.exports = router