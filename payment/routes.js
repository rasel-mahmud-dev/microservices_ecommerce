const connectDatabase = require("./database");
const auth = require("./middleware/auth");
const Bkash = require("./bkash/Bkash");
const router = require("express").Router()


// Create a payment
router.post('/api/payment', auth, async (req, res, next) => {
    try {
        const {} = req.body;

        const user_id = req.user.user_id


    } catch (error) {
        console.error('Error creating payment:', error);
        next('Creating payment fail.');
    }
});


// Create a payment
router.post('/api/payment/checkout', auth, async (req, res, next) => {
    try {
        const {} = req.body;

        const user_id = req.user.user_id

        let bkash = new Bkash()

        let bkashURL = await bkash.createAgreement()
        res.status(200).send(bkashURL)


    } catch (error) {
        console.error('Error creating payment:', error);
        next('Creating payment fail.');
    }
});


// Execute Agreement
router.get('/api/payment/execute-agreement', async (req, res, next) => {
    try {
        const {} = req.body;

        const {paymentID} = req.query

        const bkash = new Bkash()
        let result = await bkash.executeAgreement(paymentID)

        // now query agreement
        result = await bkash.queryAgreement(result.agreementID)
        const {
            statusCode,
            statusMessage,
            agreementID,
            paymentID: paymentId,
            agreementStatus,
            agreementCreateTime,
            agreementExecuteTime,
            payerReference,
            customerMsisdn,
        } = result;

        // now create payment
        result = await bkash.createPayment({
            payerReference,
            agreementID,
            merchantInvoiceNumber: "Test Invoice -" + Date.now()
        })
        if (!result.bkashURL) return next("Bkash payment fail")

        res.redirect(result.bkashURL)


    } catch (error) {
        console.error('Error creating payment:', error);

    }
});



// Execute Payment
router.get('/api/payment/execute-payment', async (req, res, next) => {
    try {
        const {} = req.body;

        const {paymentID} = req.query

        const bkash = new Bkash()
        let result = await bkash.executePayment(paymentID)
        let queryPaymentResult = await bkash.queryPayment(result.paymentID)

        const {
            trxID,
            merchantInvoice,
            paymentExecuteTime,
            amount,
            payerReference,
        }  = queryPaymentResult

        // now update you order table
        // and create transaction table row

        // and redirect frontend
        res.redirect("http://localhost:5173") // this url should be store in env file


    } catch (error) {
        console.error('Error creating payment:', error);

    }
});


module.exports = router