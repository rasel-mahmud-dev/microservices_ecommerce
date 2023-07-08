const connectDatabase = require("../database");
const {pool} = require("../database");
const router = require("express").Router()

// get all products
router.get("/", async function (req, res, next) {
    let client = null
    try {
        client = await connectDatabase()
        let {rows} = await client.query(`
          SELECT
              p.product_id,
              p.title,
              p.description,
              p.price,
              json_agg(json_build_object(
                'variant_id', v.variant_id,
                'sku', v.sku,
                'attributes', (
                  SELECT json_agg(json_build_object(
                    'attribute_id', va.attribute_id,
                    'attribute_value_id', va.attribute_value_id,
                    'value', av.value,
                    'label', av.label,
                    'name', att.name
                  ))
                  FROM variant_attributes va
                  JOIN attribute_values av ON av.attribute_value_id = va.attribute_value_id
                  JOIN attributes att ON att.attribute_id = va.attribute_id
                  WHERE va.variant_id = v.variant_id
                )
              )) AS variants
            FROM
              products p
            LEFT JOIN
              variants v ON v.product_id = p.product_id
            GROUP BY
              p.product_id, p.title, p.description, p.price;
        `)
        res.send(rows)

    } catch (ex) {
        next(ex)
    }
})


// add product
router.post("/", async function (req, res, next) {
    try {
        const {
            title,
            price,
            description,
            variants
        } = req.body

        let client = await connectDatabase()

        let productId = ""

        // step 1 create variant
        // create product
        const sql = `insert into products(title, price, description) values ($1, $2, $3) returning product_id`
        let result = await client.query(sql, [title, price, description])
        let product_id;
        if (result.rowCount) {
            product_id = result.rows[0].product_id
        }

        if (!product_id) return next("Product adding fail please try again.");


        let variantIds = []
        let attributes = []

        // step 2 create variant
        for (const variantKey in variants) {
            const {sku} = variants[variantKey]

            attributes = variants[variantKey]["attributes"]

            const sql = `insert into variants(sku, product_id) values ($1, $2) returning variant_id`
            let result = await client.query(sql, [sku, product_id])
            if (result.rowCount) {
                variantIds = result.rows
            }
        }

        // if(!(variantIds && variantIds.length > 0)) return next("Product Variant adding fail."); // we can roll back previous operation

        let resultOfVariantAttribute = []
        for (let i = 0; i < variantIds.length; i++) {
            let variant = variantIds[i]
            resultOfVariantAttribute = await createVariantAttribute(attributes, variant.variant_id)
        }


        // step 3 create variant attributes
        async function createVariantAttribute(attributes, variant_id) {
            if (!variant_id) return;
            let out = []
            for (let i = 0; i < attributes.length; i++) {
                const {attribute_id, attribute_value_id, image = ""} = attributes[i]
                const sql = `insert into variant_attributes(attribute_id, variant_id, attribute_value_id, image) values ($1, $2, $3, $4) returning variant_attribute_id`
                let result = await client.query(sql, [attribute_id, variant_id, attribute_value_id, image])
                if (result.rowCount) {
                    out.push(result.rows[0])
                }
            }
            return out
        }

        if (resultOfVariantAttribute.length !== attributes.length) return next("Product all variant could not added")

        res.status(201).json({
            message: "Product successfully added"
        })

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
        if (rowCount) {
            res.send("Product has been deleted")
        } else {
            next("Product already deleted or not exists")
        }

    } catch (ex) {
        next(ex)
    }
})


module.exports = router