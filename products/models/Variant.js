const mongoose = require("mongoose")


const schema = new mongoose.Schema({
    variant_id: String,
    product_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product"
    },
    sku: String,
    color: String,
    size: String,
    price: String,
    quantity: String
})

const Variant = mongoose.model("Variant", schema)

module.exports = Variant