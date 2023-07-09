import React, {useEffect, useState} from 'react';
import useSWR from "swr";
import apis from "../apis/axios.ts";
import {Attribute, AttributeValueGroup} from "../interface";
import {Link} from "react-router-dom";

const HomePage = () => {

    let {data, error} = useSWR('/api/products', () => {
        return apis.get("/products-service/api/products").then(res => res.data)
    });

    const CATEGORIES = [
        "New Arivals",
        "Accesories",
        "Bags",
        "Dressed",
        "Jackets",
        "jewelry",
        "Shoes",
        "Shirts",
        "Sweaters",
        "T-shirts"
    ]

    const [products, setProducts] = useState([])


    function attributeGroupFn(variants) {
        if (variants) {
            let groupAttr = [] // [{ name: "color", values: [] }, { name: "size", values: [] } ]
            variants.forEach(varr => {
                if (varr?.attributes) {
                    let g = []
                    varr.attributes.forEach(attr => {

                        let existIndex = g.findIndex(gp => gp.attribute_id === attr.attribute_id)

                        let variantValue = {
                            sku: varr.sku,
                            variant_id: varr.variant_id,
                            attribute_id: attr.attribute_id,
                            value: attr.value,
                            label: attr.label,
                            attribute_value_id: attr.attribute_value_id
                        }

                        if(existIndex !== -1){

                        }else {
                            g.push(variantValue)
                        }

                        console.log(existIndex)

                        // if(g[varr.variant_id]){
                        //     g[varr.variant_id].push(variantValue)
                        // } else {
                        //     g[varr.variant_id] = [variantValue]
                        // }




                        // let existIndex = groupAttr.findIndex(gp => gp.attribute_id === attr.attribute_id)
                        // console.log(existIndex)
                        // if (existIndex !== -1) {
                            // groupAttr[existIndex].values.push({
                            //     value: attr.value,
                            //     label: attr.label,
                            //     attribute_value_id: attr.attribute_value_id,
                            //     sku: varr.sku,
                            //     variant_id: varr.variant_id,
                            // })
                        // } else {
                            // groupAttr = [{
                            //     attribute_id: attr.attribute_id,
                            //     name: attr.name,
                            //     values: []
                            // }]

                        // }

                    })

                    console.log(g)

                }
            })
            return groupAttr
        }
        return []
    }

    useEffect(() => {
        if (data) {
            let arr = [...data]
            arr = arr.map((product) => {
                let attributeGroup = attributeGroupFn(product?.variants)
                console.log(attributeGroup)
                product.attributeGroup = attributeGroup || []
                return product
            })
            setProducts(arr)
        }
    }, [data]);


    const attributeRes = useSWR('/api/attributes', () => {
        return apis.get<Attribute[]>("/products-service/api/attributes").then(res => res.data)
    });


    const attributeValuesRes = useSWR('/api/attribute-values', () => {
        return apis.get<AttributeValueGroup[]>("/products-service/api/attribute-value?group_by=attribute_id").then(res => res.data)
    });

    return (
        <div className="homepage">
            <div>

                <div>
                    <h4 className="font-medium text-sm uppercase mb-4">Categories</h4>
                    <div className=" ">
                        {CATEGORIES.map(category => (
                            <div className="flex items-center gap-3 pb-3 text-xs font-medium">
                                <input id={category} type="checkbox"/>
                                <label htmlFor={category}>{category}</label>
                            </div>
                        ))}
                    </div>
                </div>

                {attributeRes?.data?.map(attr => (
                    <div>
                        <h4 className="font-medium text-sm uppercase mb-4">{attr.name}</h4>

                        <div className="text-xs font-medium ">
                            {attr.name === "color" ? (
                                <div>
                                    {attributeValuesRes?.data?.map(attVal => (
                                        <div className="grid grid-cols-2">
                                            {attr.attribute_id === attVal.attribute_id && attVal.values.map(v => (
                                                <div className="flex items-center gap-2 pb-3">
                                                    <div className="w-4 h-4 rounded-full"
                                                         style={{background: v.value}}>
                                                    </div>
                                                    <label htmlFor="">{v.label}</label>
                                                </div>
                                            ))}
                                        </div>
                                    ))}
                                </div>

                            ) : attr.name === "size" ? (
                                (
                                    <div>
                                        {attributeValuesRes?.data?.map(attVal => (
                                            <div className="grid grid-cols-2">
                                                {attr.attribute_id === attVal.attribute_id && attVal.values.map(v => (
                                                    <div className="flex items-center gap-3 pb-3">
                                                        <input id={v.attribute_value_id} type="checkbox"/>
                                                        <label htmlFor={v.attribute_value_id}>{v.value}</label>
                                                    </div>
                                                ))}
                                            </div>
                                        ))}
                                    </div>

                                )
                            ) : (
                                <div>

                                    {attributeValuesRes?.data?.map(attVal => (
                                        <div>
                                            {attr.attribute_id === attVal.attribute_id && attVal.values.map(v => (
                                                <div className="w-8 h-8 rounded-full">
                                                    {v.value}
                                                </div>
                                            ))}
                                        </div>
                                    ))}

                                </div>
                            )}
                        </div>


                    </div>
                ))}
            </div>


            <div>

                <h4 className="text-sm pb-6 pt-2">Showing 1–9 of 48 results</h4>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                    {products?.map(prod => (
                        <div className="p-card relative">

                            <img className="object-cover"
                                 src={prod?.image}
                                 alt={prod.title}
                            />


                            <div className="p-card-content ">
                                <h4 className="p-0 m-0">{prod.title}</h4>
                                <h4 className="text-orange-500 my-1 p-0">${prod.price}</h4>

                                <div className="relative z-10">
                                    {prod?.attributeGroup?.map(attr => (
                                        <div className="my-0">
                                            <h2 className="uppercase text-xs m-0 px-0 py-2 font-semibold">{attr.name}</h2>
                                            <div>
                                                {attr.name === "color" && (
                                                    <div className="flex gap-x-1.5">
                                                        {
                                                            attr.values.map((av: {value: string}) => (
                                                                <div className="w-4 h-4 rounded-full"
                                                                     style={{background: av.value}}>
                                                                </div>
                                                            ))
                                                        }
                                                    </div>
                                                )}

                                                {attr.name === "size" && (
                                                    attr.values.map(av => (
                                                        <div className="w-4 h-4 rounded-full">
                                                            {av.value}
                                                        </div>
                                                    ))
                                                )}

                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>


                            <Link className="absolute top-0 bottom-0 left-0 right-0" to={`/p/${prod.product_id}`}></Link>

                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default HomePage;