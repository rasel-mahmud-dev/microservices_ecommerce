import React, {useEffect, useState} from 'react';
import useSWR from "swr";
import apis from "../apis/axios.ts";


const AddProduct = () => {

    const data = useSWR('/api/attributes', () => {
        return apis.get("/products-service/api/attributes").then(res => res.data)
    });

    const [variants, setVariants] = useState([
        {}
    ])

    const [basicData, setBasicData] = useState([
        {}
    ])

    useEffect(()=>{
        if(data?.data){
            const firstAttribute = data.data[0]
            fetchAttributeValue(firstAttribute.attribute_id)
        }
    }, [data?.data])

    const [attributeValue, setAttributeValue] = useState({})

    function fetchAttributeValue(attributeId: number) {
        apis.get("/products-service/api/attribute-value/" + attributeId).then(({data, status}) => {
            if (status === 200) {
                setAttributeValue(prev => ({
                    ...prev,
                    [attributeId]: data
                }))
            }
        })
    }

    function handleAddMoreVariant() {
        setVariants(prev => ([
            ...prev,
            {}
        ]))
    }

    function handleSubmit(e) {
        e.preventDefault();

        console.log(variants)
    }


    function handleChange(e, index?: number) {
        const {name, value} = e.target

        if (index === undefined) {
            setBasicData(prevState => ({
                ...prevState,
                [name]: value
            }))

        } else {
            let updateVariants = [...variants]
            updateVariants[index] = {
                ...updateVariants[index],
                [name]: value
            }
            setVariants(updateVariants)
        }

        if (name === "attribute_id") {
            fetchAttributeValue(value)
        }

    }

    console.log(attributeValue)

    return (
        <div>

            <form onSubmit={handleSubmit} className="max-w-md mx-auto">

                <div>
                    <h2>Basic info</h2>
                    <input
                        type="text"
                        onChange={handleChange}
                        name="title"
                        placeholder="Product Title"
                    />


                    <textarea
                        onChange={handleChange}
                        placeholder="Product Title"
                        name="description"
                    />
                </div>


                <div>
                    <h2>Create Variant</h2>

                    {variants.map((item, i) => (
                        <div className="mt-6">
                            <label>Variant SKU</label>
                            <input name="sku" onChange={(e) => handleChange(e, i)}
                                   type="text"
                                   placeholder="Variant SKU"
                            />

                            <label>Variant Type</label>
                            <select name="attribute_id" onChange={(e) => handleChange(e, i)}>
                                <option value="">Select Variant</option>
                                {data.data?.map((attr) => (
                                    <option key={attr.attribute_id} value={attr.attribute_id}>{attr.name}</option>
                                ))}
                            </select>

                            <label>Variant Value</label>
                            {/*<input name="value" onChange={(e) => handleChange(e, i)}*/}
                            {/*       type="text"*/}
                            {/*       placeholder="Variant Value"*/}
                            {/*/>*/}

                            <select name="attribute_value_id" onChange={(e) => handleChange(e, i)}>
                                {attributeValue[variants[i].attribute_id] && attributeValue[variants[i].attribute_id]?.map((attrValue) => (
                                    <option key={attrValue.attribute_value_id}>{attrValue.value}</option>
                                ))}
                            </select>


                            <label>Variant Image </label>
                            <input name="value"
                                   type="file"
                                   placeholder="Image"
                            />


                        </div>
                    ))}

                    <button
                        type="button"
                        onClick={handleAddMoreVariant}>
                        Add More Variant
                    </button>


                    <button
                        className="mt-4 w-full"
                        type="submit">
                        Add Product
                    </button>


                </div>


            </form>

        </div>
    );
};

export default AddProduct;