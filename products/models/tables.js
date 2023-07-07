class Product  {
    product_id = "" // (Primary Key)
    name = ""
    description = ""
    price = ""
}




/* Variant Table
variant_id	product_id	sku	...
1	            1	    SKU001	...
2	            1	    SKU002	...
*/
class Variant  {
    variant_id = ""
    product_id = "" // ref,
    sku  = ""
}



/*
Attribute Table:
attribute_id	name
1               Color
2               Size
...	            ...
*/

class Attribute {
    attribute_id = ""
    name = "" // Color, Size, ...
}



/*
Variant_Attribute Table:
variant_attribute_id	variant_id	attribute_id
1	                        1	         1
2	                        1	         2
3	                        2	         1
4	                        2	         2
...	...	...
*/
class VariantAttribute {
    variant_attribute_id = ""
    variant_id = ""
    attribute_id = "" // ref attribute table
    value = ""
}



/*
Variant Attribute_Value Table
variant_attribute_id	value
1	                    Blue
2	                    Medium
3	                    Red
4	                    Large
...	                    ...
*/
class Variant_Attribute_Value {
    variant_attribute_id = ""
    value = ""
}


