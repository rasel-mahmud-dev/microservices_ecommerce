
const product = {
    product_id: String, // (Primary Key)
    name: String,
    description: String,
    price: String
}


const attribute = {
    attribute_id: String,
    name: String // Color, Size, ...
}

const variant_attribute = {
    variant_attribute_id: String,
    variant_id: String,
    attribute_id: String, // ref attribute table

}

const variant = {
    variant_id: String,
    product_id: String, // ref,
    sku: String,
    color: String,
    size: String,
    price: String,
    quantity: String
}

// Variant_Attribute
// Attribute_Value