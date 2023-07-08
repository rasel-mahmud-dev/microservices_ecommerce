import useSWR from "swr";
import {Link} from "react-router-dom";
import apis from "../apis/axios.ts";

const Products = () => {
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
            <div className="card">
                <div className="flex justify-between items-center">
                    <h4>Products</h4>
                    <Link to="/add-product">
                        <button>Add Product</button>
                    </Link>
                </div>
                <table className="mt-8">
                    <thead>
                    <tr>
                        <th>Id</th>
                        <th>Title</th>
                        <th>Desc</th>
                    </tr>
                    </thead>
                    <tbody>
                    {data?.map((prod) => (
                        <tr key={prod.product_id}>
                            <td>{prod.product_id}</td>
                            <td>{prod.title}</td>
                            <td>{prod?.description}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Products;