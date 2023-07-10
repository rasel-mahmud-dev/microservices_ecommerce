const connectDatabase = require("../database");
const {func} = require("joi");
const router = require("express").Router()
const grpc = require('@grpc/grpc-js');
// const productProto = require('./product_pb');
// const productGrpc = require('./product_grpc_pb');


// get all cart products
router.get("/", async function (req, res, next) {
    try {
        let client = await connectDatabase()
        const userId = req.user.user_id

        const result = await client.query(`
             SELECT 
                c.cart_id,
                json_agg(json_build_object(
                'variant_id', ci.variant_id,
                'sku', ci.sku,
                'product_id', ci.product_id
              )) AS cartItems
             
             FROM cart c 
               JOIN cart_item ci ON ci.cart_id = c.cart_id         
                WHERE user_id = $1
           GROUP BY c.cart_id

`,
            [userId]
        )

        // Create a gRPC client
        // const productService = new productGrpc.ProductServiceClient('product-service:50051', grpc.credentials.createInsecure());



        res.send(result.rows)

    } catch (ex) {
        next(ex)
    }
})


// add cart
router.post("/", async function (req, res, next) {
    try {
        const {
            cart_id,
            product_id, sku,
            variant_id,
            quantity = 1
        } = req.body


        let client = await connectDatabase()

        if (cart_id) {
            // const result = await client.query(`
            //      INSERT INTO cart_item (cart_id, product_id, sku, quantity)
            //         VALUES (cart_id_value, product_id_value, 1, price_value)
            //         ON CONFLICT (cart_id, sku,  product_id)
            //         DO UPDATE SET quantity = cart_item.quantity + 1`
            //     [product_id, sku, variant_id, quantity]
            // )
        }


        // get or create one cart
        let result = await client.query(`
            INSERT INTO cart (user_id)
            SELECT $1
            WHERE NOT EXISTS (
                SELECT 1
                FROM cart
                WHERE user_id = $1
            )
            RETURNING cart_id
        `, [req.user.user_id]);


        if (result.rowCount === 0) {
            result = await client.query(`
                SELECT cart_id from cart WHERE user_id = $1
        `, [req.user.user_id]);
        }


        if (result.rowCount === 0) return next("Product adding in cart fail ")

        let cart = result.rows[0]
        result = await client.query(`
           INSERT INTO cart_item (cart_id, product_id, sku, variant_id, quantity)
                VALUES ($1, $2, $3, $4, $5)
                ON CONFLICT (cart_id, product_id, sku, variant_id)
                DO UPDATE SET quantity = cart_item.quantity + 1;
        `,
            [cart.cart_id, product_id, sku, variant_id, quantity]
        )

        if (result.rowCount) {
            res.status(201).json({
                message: "Cart successfully added"
            })
        } else {
            res.status(500).json({
                message: "Cart added fail"
            })
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