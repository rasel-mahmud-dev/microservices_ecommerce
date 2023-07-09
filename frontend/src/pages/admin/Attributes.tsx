import useSWR from 'swr';
import apis from "../../apis/axios.ts";
import {Attribute, AttributeValueGroup} from "../../interface";
import React from "react";


const Attributes = () => {

    const attributeRes = useSWR('/api/attributes', () => {
        return apis.get<Attribute[]>("/products-service/api/attributes").then(res => res.data)
    });


    const attributeValuesRes = useSWR('/api/attribute-values', () => {
        return apis.get<AttributeValueGroup[]>("/products-service/api/attribute-value?group_by=attribute_id").then(res => res.data)
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
            <h4>Attributes</h4>
            <table>
                <thead>
                <tr>
                    <th>Id</th>
                    <th>Name</th>
                    <th>Desc</th>
                    <th>Values</th>
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
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};

export default Attributes;