const connectDatabase = require("../database");
const {func} = require("joi");
const router = require("express").Router()
const grpc = require('@grpc/grpc-js');

const protoLoader = require('@grpc/proto-loader');
const {readFile} = require("fs");
const {join} = require("path");

const PROTO_FILE = 'protos/product.proto';

const packageDefinition = protoLoader.loadSync(PROTO_FILE, {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true
});


const productProto = grpc.loadPackageDefinition(packageDefinition).product;


// readFile("protos/product.proto", (err, data)=>{
//     console.log("result", data.toString())
// })

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

        // Create the gRPC client
        const gClient = new productProto.ProductService('172.20.0.5:50053', grpc.credentials.createInsecure());

        // Define the request message
        const request = {
            page_size: 10,
            page_number: 1
        };


        // Make the gRPC call to list the products
        gClient.ListProducts(request, (error, response) => {
            if (error) {
                console.error('Error:', error.message);
                return;
            }

            const products = response.products;
            console.log('List of Products: s', products);

        });


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