const connectDatabase = require("../database");
const {func} = require("joi");
const router = require("express").Router()

const productGRPCClient = require("../grpc/productGRPCClient")


// get all cart products
router.get("/", async function (req, res, next) {
    try {
        let client = await connectDatabase()
        const userId = req.user.user_id

        const result = await client.query(`
             SELECT 
                cart_id,
                variant_id,
                sku,
                quantity,
                product_id
             FROM cart 
               WHERE user_id = $1
               
           `, [userId])

        if (result.rowCount === 0) return res.status(200).send([])



        let carts = result.rows
        let productIds = []
        carts.forEach(item => {
            const id = item.product_id
            if (!productIds.includes(id)) {
                productIds.push(id)
            }
        })


        // Make the gRPC call to list the products
        productGRPCClient.ListProducts({productIds}, (error, response) => {
            if (error) {
                next("GRPC connection fail")
                return;
            }
            const products = response.products;

            carts = carts.map(item => {
                let prod = products.find(p => p.product_id == item.product_id) || null
                item.product = prod
                return item
            })

            res.status(200).send( carts)
        });

    } catch (ex) {
        next("Cart items fetch fail")
    }
})

// add cart
router.post("/", async function (req, res, next) {
    try {
        const {
            product_id,
            sku,
            variant_id,
            quantity = 1
        } = req.body


        let client = await connectDatabase()

        // get or create one cart
        let result = await client.query(`
            INSERT INTO cart (user_id, product_id, sku, variant_id, quantity)
                VALUES ($1, $2, $3, $4, $5)
                ON CONFLICT (user_id, product_id, sku, variant_id)
                DO UPDATE SET quantity = cart.quantity + 1 
            returning *
        `, [req.user.user_id, product_id, sku, variant_id, quantity]);

        if(result.rowCount){
            res.send(result.rows[0])
        } else {
            res.send(null)
        }

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