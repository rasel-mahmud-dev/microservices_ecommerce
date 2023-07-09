import useSWR from 'swr';
import apis from "../../apis/axios.ts";
import {Attribute, AttributeValueGroup} from "../../interface";
import React, {useState} from "react";
import {BsHeart} from "react-icons/bs";
import {FaEdit} from "react-icons/fa";
import AddAttribute from "./AddAttribute.tsx";


const Attributes = () => {

    const attributeRes = useSWR('/api/attributes', () => {
        return apis.get<Attribute[]>("/products-service/api/attributes").then(res => res.data)
    });

    const [isOpen, setOpen] = useState(false)
    const [editItem, setEditItem] = useState<Attribute & {
        values: Array<{
            attribute_value_id: string;
            value: string;
            label?: string;
        }> | null;
    } | null>(null)

    const attributeValuesRes = useSWR('/api/attribute-values', () => {
        return apis.get<Array<Attribute & { values: {
                attribute_value_id: string;
                value: string;
                label?: string;
        } | undefined }>>("/products-service/api/attribute-value?group_by=attribute_id").then(res => res.data)
    });

    function renderColor(attrValue = []) {
        return (
            <div className="flex gap-1">
                {attrValue.map(attrV => (
                    <div>
                        <div className="w-4 h-4 rounded-full"
                             style={{background: attrV.value}}>
                        </div>
                        <label htmlFor="">{attrV.label}</label>
                    </div>
                ))}
            </div>
        )
    }

    function renderSize(attrValue = []) {
        return (
            <div className="flex gap-1">
                {attrValue.map(attrV => (
                    <div>
                        <div className="w-6 h-6 flex items-center justify-center rounded-full bg-gray-600 text-xs">
                            {attrV.value}
                        </div>
                    </div>
                ))}
            </div>
        )
    }

    return (
        <div className="card">

            <div className="flex justify-between items-center">
                <h4>Attributes</h4>
                <button onClick={()=> {
                    setEditItem(null);
                    setOpen(true)
                }}>Add new</button>
            </div>

            <div>

                { isOpen && <AddAttribute onClose={()=>setOpen(false)} edit={editItem} /> }

            </div>

            <table>
                <thead>
                <tr>
                    <th>Id</th>
                    <th>Name</th>
                    <th>Desc</th>
                    <th>Values</th>
                    <th>Action</th>
                </tr>
                </thead>
                <tbody>
                {attributeRes.data?.map((attr) => (
                    <tr key={attr.attribute_id}>
                        <td>{attr.attribute_id}</td>
                        <td>{attr.name}</td>
                        <td>{attr.description}</td>
                        <td>
                            <div>

                                {attributeValuesRes?.data?.map(attrValue => attrValue.attribute_id === attr.attribute_id && (
                                    <div>
                                        {attr.name === "color"
                                            ? renderColor(attrValue?.values)
                                            : renderSize(attrValue?.values)
                                        }
                                    </div>
                                ))}
                            </div>
                        </td>
                        <td>
                            <div className="flex items-center gap-x-2">

                                <div onClick={()=>{
                                    setEditItem({
                                        ...attr,
                                        values: attributeValuesRes?.data?.find(av=>av.attribute_id === attr.attribute_id)?.values
                                    })
                                    setOpen(true)
                                }} className="rounded-full w-6 h-6 bg-gray-700 flex items-center justify-center">
                                    <FaEdit className="text-xs" />
                                </div>

                                <div className="rounded-full w-6 h-6 bg-gray-700 flex items-center justify-center">
                                    <BsHeart className="text-xs" />
                                </div>


                            </div>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>




        </div>
    );
};

export default Attributes;