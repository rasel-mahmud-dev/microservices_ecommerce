import {useParams} from "react-router-dom";
import apis from "../apis/axios.ts";
import {useEffect, useState} from "react";

const ProductDetail = () => {


    const {productId} = useParams()

    const [productDetail, setProductDetail] = useState({})


    useEffect(() => {
        if (productId) {
            apis.get("/products-service/api/products/" + productId).then(res => {
                setProductDetail(res.data)
            })
        }
    }, [productId]);


    function handleDelete(productId: string) {
        console.log(productId)
    }

    function renderColor(value: string) {
        return (
            <div>
                <div className="w-6 h-6 rounded-full" style={{background: value}}></div>
            </div>
        )
    }

    function renderGroupAttribute(attributes) {

        let group = {}

        attributes.forEach(attr => {
            if (group[attr.name]) {
                group[attr.name].push(attr)
            } else {
                group[attr.name] = [attr]
            }
        })

        console.log(group)


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
                                            <div className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-400">
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

    return (
        <div>
            <div className="card">

                <div>
                    {productDetail?.product_id && (
                        <div className="grid grid-cols-12 gap-x-4">

                            <div className="col-span-5">
                                <div>

                                    <img className="w-full"
                                         src="https://img.freepik.com/free-vector/white-product-podium-with-green-tropical-palm-leaves-golden-round-arch-green-wall_87521-3023.jpg"
                                         alt=""/>
                                </div>

                                <div className="mt-4">
                                    <button>Order Now</button>
                                </div>

                            </div>

                            <div className="col-span-7">
                                <h3>{productDetail.title}</h3>
                                <p>{productDetail.description}</p>

                                <div>
                                    <p className="my-1 font-medium text-lg">Variants</p>
                                    {productDetail.variants.map(variant => (
                                        <div>
                                            <p>{variant.sku}</p>

                                            <div>
                                                {renderGroupAttribute(variant?.attributes)}

                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProductDetail;