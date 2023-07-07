import useSWR from 'swr';
import axios from "axios";


const Attributes = () => {

    const {data, error} = useSWR('/api/attributes', () => {
        return axios.get("/api/attributes").then(res => res.data)
    });


    if (error) {
        return <div>Error occurred: {error.message}</div>;
    }

    if (!data) {
        return <div>Loading...</div>;
    }


    return (
        <div className="card">
            <h4>Attributes</h4>
            <table>
                <thead>
                <tr>
                    <th>Id</th>
                    <th>Name</th>
                    <th>Desc</th>
                </tr>
                </thead>
                <tbody>
                {data?.map((attr) => (
                    <tr key={attr.attribute_id}>
                        <td>{attr.attribute_id}</td>
                        <td>{attr.name}</td>
                        <td>{attr.description}</td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};

export default Attributes;