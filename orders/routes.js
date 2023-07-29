const connectDatabase = require("./database");
const auth = require("./middleware/auth");
const router = require("express").Router()


/**
 Retrieve all orders for a specific user.
 @route GET /api/orders
 @returns []
 */

router.get("/api/orders", auth, async function (req, res, next) {
    let client = null
    try {
        client = await connectDatabase()
        let {rows} = await client.query(`
          select * from orders where user_id = $1`
            [req.user.user_id]
        )
        res.send(rows)

    } catch (ex) {
        next(ex)
    }
})


// Create an order
router.post('/api/orders', auth, async (req, res, next) => {
    try {
        const {
            product_ids = [],
            quantity = 1,
            total_price = 0.0,
            order_date = new Date(),
            order_status = "pending",
            shipping_address,
            billing_address,
            payment_method,
            order_notes,
            tax = 0,
            shipping_cost,
            discount,
            coupon_code,
            customer_comments,
            order_fulfilled_by
        } = req.body;

        const user_id = req.user.user_id

        const query = `
          INSERT INTO orders (
            user_id,
            product_ids,
            quantity,
            total_price,
            order_date,
            order_status,
            shipping_address,
            billing_address,
            payment_method,
            order_notes,
            tax,
            shipping_cost,
            discount,
            coupon_code,
            customer_comments,
            order_fulfilled_by
          )
          VALUES (
            $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16
          )
          RETURNING order_id;
        `;

        const values = [
            user_id,
            JSON.stringify(product_ids),
            quantity,
            total_price,
            order_date,
            order_status,
            shipping_address,
            billing_address,
            payment_method,
            order_notes,
            tax,
            shipping_cost,
            discount,
            coupon_code,
            customer_comments,
            order_fulfilled_by
        ];

        const client = await connectDatabase()
        const result = await client.query(query, values);
        const orderId = result.rows[0].order_id;


        res.status(201).json({order_id: orderId});
    } catch (error) {
        console.error('Error creating order:', error);
        next('Creating order fail.');
    }
});


module.exports = router