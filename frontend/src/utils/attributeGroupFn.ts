function attributeGroupFn(variants) {
    if (variants) {

        let groupAttr = {} // [{ name: "color", values: [] }, { name: "size", values: [] } ]

        variants.forEach(varr => {

            if (varr?.attributes) {

                varr.attributes.forEach(attr => {

                    // let existIndex = g.findIndex(gp => gp.attribute_id === attr.attribute_id)
                    let variantValue = {
                        sku: varr.sku,
                        variant_id: varr.variant_id,
                        attribute_id: attr.attribute_id,
                        value: attr.value,
                        label: attr.label,
                        attribute_value_id: attr.attribute_value_id
                    }

                    if (groupAttr[attr.attribute_id]) {

                        groupAttr[attr.attribute_id].push(variantValue)

                    } else {
                        groupAttr[attr.attribute_id] = [variantValue]
                    }
                })

            }
        })

        return groupAttr
    }
    return {}
}
export default attributeGroupFn