const mongoose = require("mongoose")


const schema = new mongoose.Schema({
    attribute_id: String,
    name: String
})

const Attribute = mongoose.model("Attribute", schema)

module.exports = Attribute