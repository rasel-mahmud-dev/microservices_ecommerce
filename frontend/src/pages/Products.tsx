import React from 'react';
import useSWR from "swr";
import axios from "axios";

const Products = () => {
    const {data, error} = useSWR('/api/products', () => {
        return axios.get("/api/products")
    });


    if (error) {
        return <div>Error occurred: {error.message}</div>;
    }

    if (!data) {
        return <div>Loading...</div>;
    }


    return (
        <div>
            {data?.data?.map((prod) => (
                <div key={prod.product_id}>
                    {prod.title}
                </div>
            ))}
        </div>
    );


};

export default Products;