const mongoose = require("mongoose")


const schema = new mongoose.Schema({
    variant_id: String,
    product_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product"
    },
    attribute_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Attribute"
    }
})

const Variant_Attribute  = mongoose.model("Variant_Attribute", schema)

module.exports = Variant_Attribute

