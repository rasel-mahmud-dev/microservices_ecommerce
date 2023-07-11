import React, {useEffect, useState} from 'react';
import useSWR from "swr";
import apis from "../../apis/axios.ts";
import {useParams} from "react-router-dom";
import {Attribute} from "../../interface";
import {AxiosResponse} from "axios";
import useCustomToast from "../../hooks/useCustomToast.tsx";



type VariantKey = number

type Variant = {
    variant_id?: string // for update
    sku: string
    attributes: Attribute[]
}

type Variants = {
    [key: VariantKey]: Variant
}

type AttributeId = string


type AttributeValue = {
    attribute_value_id: string,
    attribute_id: string,
    variant_attribute_id?: string
    value: string
    label?: string
}


interface EditProductData {

    "product_id": string,
    "title": string,
    "description": string,
    "price": null,
    "variants": [
        {
            "variant_id": 10,
            "sku": "SKU90001",
            "attributes": [
                {
                    "attribute_id": 1,
                    "attribute_value_id": 10
                },
                {
                    "attribute_id": 2,
                    "attribute_value_id": 16
                },
                {
                    "attribute_id": 1,
                    "attribute_value_id": 12
                }
            ]
        }
    ]
}

const AddProduct = () => {

    const {productId} = useParams()


    let toast = useCustomToast()


    const [updateProductData, setUpdateProductData] = useState({})


    const data = useSWR('/api/attributes', () => {
        return apis.get<Attribute[]>("/products-service/api/attributes").then(res => res.data)
    });


    const [variants, setVariants] = useState<Variants>({
        0: {
            sku: "",
            variant_id: "",
            attributes: [{
                attribute_id: "",
                attribute_value_id: "",
                image: "",
            }]
        }
    })


    const [basicData, setBasicData] = useState<{
        imageBlob?: File,
        title: string,
        description: string,
        price?: number
        image?: string
    }>({
        title: "",
        price: 0,
        imageBlob: undefined,
        image: "",
        description: ""
    })


    useEffect(() => {
        if (data?.data && data?.data) {
            const firstAttribute = data?.data[0]
            fetchAttributeValue(firstAttribute.attribute_id)
        }
    }, [data?.data])


    useEffect(() => {
        if (productId) {
            apis.get<EditProductData>("/products-service/api/products/edit/" + productId).then(({data, status}) => {
                if (data) {
                    setUpdateProductData(data)
                    setBasicData({
                        title: data.title,
                        price: data.price || 0,
                        description: data.description,
                        image: data.image,
                    })

                    if (data.variants) {
                        let updateVariants: Variant[] = []

                        data.variants.forEach(vari => {

                            let a: Attribute[] = vari.attributes && vari?.attributes?.map(attr => {

                                fetchAttributeValue(attr.attribute_id)

                                return ({
                                    variant_attribute_id: attr.variant_attribute_id,
                                    attribute_id: attr.attribute_id,
                                    attribute_value_id: attr.attribute_value_id,
                                    image: "",
                                })
                            }) || [{
                                attribute_id: "",
                                attribute_value_id: "",
                                image: "",
                            }]
                            updateVariants.push({
                                sku: vari.sku,
                                variant_id: vari.variant_id as unknown as string,
                                attributes: a
                            })
                        })
                        setVariants(updateVariants)
                    }
                }
            })
        }
    }, [productId]);


    const [attributeValue, setAttributeValue] = useState<{
        [key: AttributeId]: AttributeValue[]
    }>({})


    function fetchAttributeValue(attributeId: Pick<Attribute, "attribute_id">['attribute_id']) {
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
        setVariants(prev => {
            let updatedState = {...prev}

            let keys = Object.keys(updatedState)
            let lastKey = Number(keys[keys.length - 1])
            updatedState[lastKey + 1] = {
                sku: "",
                attributes: [{
                    attribute_id: "",
                    attribute_value_id: "",
                    image: "",
                }]
            }
            return updatedState
        })
    }

    function handleAddMoreAttribute(variantItemIndex: number) {
        setVariants(prev => {
            let updatedState = {...prev}
            updatedState[variantItemIndex].attributes = [
                ...updatedState[variantItemIndex].attributes,
                {
                    attribute_id: "",
                    attribute_value_id: "",
                    image: "",
                }
            ]
            return updatedState
        })
    }


    async function handleSubmit(e) {
        e.preventDefault();


        try {

            let image = basicData.image
            let response: AxiosResponse<{url: string}> | undefined
            if(basicData.imageBlob) {
                const formData = new FormData()
                formData.append("image", basicData.imageBlob, basicData.imageBlob.name)
                formData.append("folder", "product")
                response = await apis.post("/products-service/api/upload-image", formData)
                if(response?.data && response?.data.url){
                    image = response?.data.url as string
                }
            }

            if (productId) {
                response = await apis.patch("/products-service/api/products/" + productId, {
                    variants: variants,
                    title: basicData.title,
                    image: image,
                    price: basicData.price,
                    description: basicData.description,
                })
                console.log(response)
            } else {
                response = await apis.post("/products-service/api/products", {
                    variants: variants,
                    price: basicData.price,
                    title: basicData.title,
                    image: image,
                    description: basicData.description,
                })
                console.log(response)
            }


        } catch (ex) {
            let msg = ex?.response?.data?.message || "Product update or add fail"
            toast(
                <p className="m-0 px-4">{msg}</p>, true
            )

        }

    }


    function handleChange(e, variantkey?: VariantKey, attributeIndex?: number) {

        const {name, value} = e.target

        if (variantkey === undefined) {
            setBasicData(prevState => ({
                ...prevState,
                [name]: value
            }))

        } else {

            let updateVariants = {...variants}

            if (attributeIndex === undefined) {
                updateVariants[variantkey][name as keyof Variant] = value

            } else {
                if (updateVariants[variantkey]) {
                    updateVariants[variantkey].attributes[attributeIndex as number][name as keyof Attribute] = value
                }
            }
            setVariants(updateVariants)
        }
        if (name === "attribute_id") {
            fetchAttributeValue(value)
        }
    }


    return (
            <form onSubmit={handleSubmit} className="max-w-2xl mx-auto">

                <div>
                    <h2>Basic info</h2>
                    <input
                        type="text"
                        onChange={handleChange}
                        name="title"
                        value={basicData.title}
                        placeholder="Product Title"
                    />
                    <input
                        type="number"
                        onChange={handleChange}
                        name="price"
                        value={basicData.price}
                        placeholder="Product Price"
                    />

                    <textarea
                        onChange={handleChange}
                        placeholder="Product Title"
                        name="description"
                        value={basicData.description}
                    />

                    <input
                        type="file"
                        onChange={(e)=>handleChange({target: { name: "imageBlob", value: e?.target?.files?.[0] as  unknown as string }})}
                        name="imageBlob"
                    />

                    { basicData.image && (
                        <div className="">
                            <img className="object-cover w-[150px]" src={basicData.image} alt=""/>
                        </div>
                    ) }

                </div>


                <div>
                    <div className="flex justify-between items-center">

                        <h2>Create Variant</h2>
                        <button
                            type="button"
                            onClick={handleAddMoreVariant}>
                            Add More Variant
                        </button>
                    </div>

                    {Object.keys(variants).map((variantkey, i) => (
                        <div className="mt-6">

                            <div>
                                <label>Variant SKU</label>
                                <input
                                    name="sku"
                                    onChange={(e) => handleChange(e, i)}
                                    type="text"
                                    value={variants[variantkey as unknown as VariantKey].sku}
                                    placeholder="Variant SKU"
                                />
                            </div>

                            <div className="">
                                {variants[variantkey as unknown as VariantKey] && variants[variantkey as unknown as VariantKey].attributes.map((variantAttribute, index) => (
                                    <div className="flex items-center">
                                        <div>
                                            <label>Attribute</label>
                                            <select value={variantAttribute.attribute_id} name="attribute_id"
                                                    onChange={(e) => handleChange(e, variantkey as unknown as VariantKey, index)}>
                                                <option value="">Select Attribute</option>
                                                {data.data?.map((attr) => (
                                                    <option key={attr.attribute_id}
                                                            value={attr.attribute_id}>{attr.name}</option>
                                                ))}
                                            </select>
                                        </div>

                                        <div>
                                            <label>Attribute Value</label>
                                            <select
                                                value={variantAttribute.attribute_value_id}
                                                name="attribute_value_id"
                                                onChange={(e) => handleChange(e, i, index)}
                                            >
                                                <option value="">Select value</option>

                                                {attributeValue[variantAttribute.attribute_id as keyof AttributeValue] && attributeValue[variantAttribute.attribute_id]?.map((attrValue) => (
                                                    <option key={attrValue.attribute_value_id}
                                                            value={attrValue.attribute_value_id}>{attrValue.value}</option>
                                                ))}
                                            </select>
                                        </div>


                                        <div>
                                            <label>Image </label>
                                            <input
                                                name="value"
                                                type="file"
                                                placeholder="Image"
                                            />
                                        </div>
                                    </div>
                                ))}

                            </div>
                            <button
                                type="button"
                                onClick={() => handleAddMoreAttribute(i)}>
                                More Attribute
                            </button>

                        </div>
                    ))}


                    <button
                        className="mt-4 w-full"
                        type="submit">
                        {productId ? "Update " : "Add "} Product
                    </button>

                </div>
            </form>
    );
};

export default AddProduct;