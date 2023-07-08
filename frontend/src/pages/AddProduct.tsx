import React, {useState} from 'react';
import useSWR from "swr";
import axios from "axios";

const AddProduct = () => {

    const {data, error} = useSWR('/api/attributes', () => {
        return axios.get("/api/attributes").then(res => res.data)
    });

    const [variants, setVariants] = useState([
        {}
    ])

    const [basicData, setBasicData] = useState([
        {}
    ])

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


    }


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
                                {data?.map((attr) => (
                                    <option key={attr.attribute_id}>{attr.name}</option>
                                ))}
                            </select>

                            <label>Variant Value</label>
                            <input name="value" onChange={(e) => handleChange(e, i)}
                                   type="text"
                                   placeholder="Variant Value"
                            />


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