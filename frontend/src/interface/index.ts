export type Attribute = {
    attribute_id: string,
    name: string
    description: string
    attribute_value_id: string
}


export type AttributeValueGroup = {
    attribute_id: string,
    values: {
        attribute_value_id: string,
        value: string
    }[]
}