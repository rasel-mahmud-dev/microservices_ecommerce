const mongoose = require("mongoose")


const schema = new mongoose.Schema({
    product_id: String, // (Primary Key)
    name: String,
    description: String,
    price: String
})

const Product = mongoose.model("Product", schema)

module.exports = Produ