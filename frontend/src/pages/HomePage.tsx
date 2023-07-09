import React from 'react';
import useSWR from "swr";
import apis from "../apis/axios.ts";

const HomePage = () => {

    const {data, error} = useSWR('/api/products', () => {
        return apis.get("/products-service/api/products").then(res => res.data)
    });


    if (error) {
        return <div>Error occurred: {error.message}</div>;
    }

    if (!data) {
        return <div>Loading...</div>;
    }

    return (
        <div>

            <div className="grid grid-cols-4 gap-5">
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