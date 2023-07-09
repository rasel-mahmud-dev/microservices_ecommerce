import React from 'react';
import useSWR from "swr";
import apis from "../apis/axios.ts";
import {Attribute, AttributeValueGroup} from "../interface";

const HomePage = () => {

    const {data, error} = useSWR('/api/products', () => {
        return apis.get("/products-service/api/products").then(res => res.data)
    });


    const attributeRes = useSWR('/api/attributes', () => {
        return apis.get<Attribute[]>("/products-service/api/attributes").then(res => res.data)
    });


    const attributeValuesRes = useSWR('/api/attribute-values', () => {
        return apis.get<AttributeValueGroup[]>("/products-service/api/attribute-value?group_by=attribute_id").then(res => res.data)
    });

    console.log(attributeValuesRes.data)


    function renderColor(){

    }

    return (
        <div className="homepage">
            <div>
                {attributeRes?.data?.map(attr=>(
                    <div>
                        <h4 className="font-medium text-sm uppercase">{attr.name}</h4>

                        <div className="text-xs font-medium">
                            {attr.name === "color" ? (
                                <div>
                                    {attributeValuesRes?.data?.map(attVal=>(
                                        <div className="flex">
                                            {attr.attribute_id === attVal.attribute_id && attVal.values.map(v=>(
                                               <div>
                                                   <div className="w-4 h-4 rounded-full"
                                                        style={{background: v.value}}>
                                                   </div>
                                                   <label htmlFor="">{v.label}</label>
                                               </div>
                                            ))}
                                        </div>
                                    ))}
                                </div>

                            ) : (
                                <div>

                                    {attributeValuesRes?.data?.map(attVal=>(
                                        <div>
                                            {attr.attribute_id === attVal.attribute_id && attVal.values.map(v=>(
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


            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                {data?.map(prod=>(
                    <div>
                        <img className="w-full"
                             src="https://img.freepik.com/free-vector/white-product-podium-with-green-tropical-palm-leaves-golden-round-arch-green-wall_87521-3023.jpg"
                             alt=""
                        />
                        <h4>{prod.title}</h4>
                        <h4>${prod.price}</h4>
                    </div>
                ))}
            </div>

        </div>
    );
};

export default HomePage;