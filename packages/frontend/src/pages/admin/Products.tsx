import useSWR from "swr";
import {Link} from "react-router-dom";
import apis from "../../apis/axios.ts";

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

    function handleDelete(productId: string){
        apis.delete("/products-service/api/products/" + productId).then(res => {
            console.log(res.data)
        })
    }


    return (
        <div>
            <div className="card">
                <div className="flex justify-between items-center">
                    <h4>Products</h4>
                    <Link to="/dashboard/add-product">
                        <button>Add Product</button>
                    </Link>
                </div>
                <table className="mt-8">
                    <thead>
                    <tr>
                        <th>Id</th>
                        <th>Title</th>
                        <th>Desc</th>
                        <th>Variant</th>
                        <th>Action</th>
                    </tr>
                    </thead>
                    <tbody>
                    {data?.map((prod) => (
                        <tr key={prod.product_id}>
                            <td>{prod.product_id}</td>
                            <td>
                                <Link to={`/p/${prod.product_id}`}>{prod.title}</Link>
                            </td>
                            <td>{prod?.description?.substring(0, 200)}</td>
                            <td>
                               <div>
                                   {prod?.variants?.map((vari)=>(
                                       <div>{vari.sku}</div>
                                   ))}
                               </div>
                            </td>
                            <td>
                                <div className="flex gap-x-2">
                                    <button onClick={()=>handleDelete(prod.product_id)}>Delete</button>
                                    <Link to={`/dashboard/update-product/${prod.product_id}`}><button>Edit</button></Link>
                                </div>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Products;