import {useParams} from "react-router-dom";
import apis from "../apis/axios.ts";
import React, {useEffect, useState} from "react";
import attributeGroupFn from "../utils/attributeGroupFn.ts";
import useSWR from "swr";
import {Attribute} from "../interface";
import {BiCart} from "react-icons/bi";
import useCustomToast from "../hooks/useCustomToast.tsx";
import useCartState from "../store/cartState.ts";

const ProductDetail = () => {
    const {productId} = useParams()


    const {addToCart} = useCartState()

    const [productDetail, setProductDetail] = useState({})

    const toast = useCustomToast()


    useEffect(() => {
        if (productId) {
            apis.get("/products-service/api/products/" + productId).then(res => {
                const product = res.data
                setProductDetail(product)

                let attributeGroup = attributeGroupFn(product?.variants)
                console.log(attributeGroup)
                product.attributeGroup = attributeGroup

            })
        }
    }, [productId]);

    const [selectVariant, setSelectVariant] = useState(null)


    const attributeRes = useSWR('/api/attributes', () => {
        return apis.get<Attribute[]>("/products-service/api/attributes").then(res => res.data)
    });

    function getAttribute(attributeId?: string) {
        if (attributeRes && attributeRes?.data) {
            let a = attributeRes.data.find(attr => String(attr.attribute_id) === attributeId)
            return a
        }
        return {}
    }

    function renderGroupAttribute(attributes) {
        let group = {}
        attributes && attributes.forEach(attr => {
            if (group[attr.name]) {
                group[attr.name].push(attr)
            } else {
                group[attr.name] = [attr]
            }
        })

        return (
            <div>
                {/*<span>{attr.name}</span> :  {attr.name === "color" ? renderColor(attr.value) : attr.value}*/}

                <div>
                    {Object.keys(group).map(attrName => (
                        <div className="my-4">
                            <div>
                                <p className="my-1">{attrName}</p>
                            </div>

                            <div className="flex items-center gap-x-1">
                                {group[attrName].map(item => (
                                    <div className="text-xs font-medium">
                                        {item.name === "color" ? (
                                            <div className="w-8 h-8 rounded-full"
                                                 style={{background: item.value}}>
                                            </div>
                                        ) : (
                                            <div
                                                className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-400">
                                                {item.value}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>

                        </div>
                    ))}
                </div>

            </div>
        )
    }

    function handleChooseVariant(av) {
        const {
            attribute_id,
            attribute_value_id,
            label,
            sku,
            variant_id
        } = av

        setSelectVariant({
            product_id: productDetail?.product_id,
            variant_id: variant_id,
            sku,
            product: {
                image: productDetail?.image,
                title: productDetail?.title,
                price: productDetail?.price,
            }
        })
    }


    function handleAddToCart() {
        if (!productDetail) return toast("Please try again", true)

        if (!selectVariant) return toast("Please select a variant", true)

        let payload = {
            product_id: selectVariant.product_id,
            variant_id: selectVariant.variant_id,
            sku: selectVariant.sku,
            product: selectVariant.product,
            quantity: 1,
        }

        apis.post("/carts-service/api/carts", {
            product_id: productDetail.product_id,
            sku: payload.sku,
            variant_id: payload.variant_id,
            quantity: payload.quantity

        }).then(({status, data}) => {
            if(status === 201){
                addToCart({
                    product_id: selectVariant.product_id,
                    variant_id: selectVariant.variant_id,
                    sku: selectVariant.sku,
                    product: selectVariant.product,
                    quantity: 1,
                }, true)
            }
        })
    }

    return (
        <div>
            <div className="card">

                <div>
                    {productDetail?.product_id && (
                        <div>
                            <div className="detail-page-wrapper">

                                <div className="col-span-5">
                                    <div className="preview-image">
                                        <img className="w-full"
                                             src={productDetail?.image}
                                             alt=""/>
                                    </div>

                                </div>

                                <div className="col-span-7">
                                    <h3 className="font-semibold text-2xl">{productDetail.title}</h3>

                                    <h3 className="font-semibold text-2xl">${productDetail.price}</h3>

                                    <p>{productDetail?.description.substring(0, 500)}</p>

                                    <div className="mt-10">
                                        {/*<p className="my-1 font-medium text-lg">Variants</p>*/}

                                        <div className="relative z-10">
                                            {Object.keys(productDetail?.attributeGroup)?.map(attrId => (
                                                <div className="mt-6" key={attrId}>

                                                    <h4 className="mb-1 mt-1 font-medium uppercase text-sm">{getAttribute(attrId).name}</h4>

                                                    {getAttribute(attrId).name === "color" && (
                                                        <div className="flex gap-x-1.5 mt-4">
                                                            {
                                                                productDetail?.attributeGroup[attrId]?.map((av: {
                                                                    value: string,
                                                                    attribute_value_id: string
                                                                }) => (
                                                                    <div key={av.attribute_value_id}
                                                                         onClick={() => handleChooseVariant(av)}
                                                                         className="w-6 h-6 rounded-full"
                                                                         style={{background: av.value}}>
                                                                    </div>
                                                                ))
                                                            }
                                                        </div>
                                                    )}

                                                    {getAttribute(attrId).name === "size" && (
                                                        <div className="flex gap-x-1.5 text-xs mt-4">
                                                            {
                                                                productDetail?.attributeGroup[attrId]?.map((av: {
                                                                    value: string,
                                                                    attribute_value_id: string
                                                                }) => (
                                                                    <div key={av.attribute_value_id}
                                                                         onClick={() => handleChooseVariant(av)}
                                                                         className="w-10 h-10 bg-gray-800 flex justify-center items-center rounded-full">
                                                                        {av.value}
                                                                    </div>
                                                                ))
                                                            }
                                                        </div>
                                                    )}

                                                </div>
                                            ))}
                                        </div>


                                        {/*{productDetail.variants.map(variant => (*/}
                                        {/*    <div>*/}
                                        {/*        <p>{variant.sku}</p>*/}

                                        {/*        <div>*/}
                                        {/*            {renderGroupAttribute(variant?.attributes)}*/}

                                        {/*        </div>*/}
                                        {/*    </div>*/}
                                        {/*))}*/}
                                    </div>

                                    <div className="mt-10">
                                        <button onClick={handleAddToCart}
                                                className="py-3 px-10 flex items-center gap-x-2">
                                            <BiCart className="text-xl"/>
                                            <span>Add To Cart</span>
                                        </button>
                                    </div>


                                </div>
                            </div>

                            <div className="container">
                                asdklfjasdlkf
                            </div>

                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProductDetail;