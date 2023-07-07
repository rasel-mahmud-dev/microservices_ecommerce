
import useSWR from 'swr';
import axios from "axios";


const Attributes = () => {

    const { data, error } = useSWR('/api/attributes', ()=>{
        return axios.get("/api/attributes")
    });


    if (error) {
        return <div>Error occurred: {error.message}</div>;
    }

    if (!data) {
        return <div>Loading...</div>;
    }


    return (
        <div>
            {data?.data?.map((attr)=>(
                <div key={attr.attribute_id}>
                    {attr.name}
                </div>
            ))}
        </div>
    );
};

export default Attributes;