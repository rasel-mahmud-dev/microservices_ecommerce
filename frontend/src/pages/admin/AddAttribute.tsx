import {ChangeEvent, useEffect, useState} from 'react';
import apis from "../../apis/axios.ts";

const AddAttribute = ({edit, onClose}) => {

    const [state, setState] = useState<{
        name: string,
        description: string,
        attributeValues: { value: string, label: string, attribute_value_id?: string }[]
    }>({
        name: "",
        description: "",
        attributeValues: [
            {value: "", label: ""}
        ]
    })

    useEffect(() => {
        if(edit){
            let updatedState = {...state}
            if(edit.name) updatedState["name"] = edit.name
            if(edit.description) updatedState["description"] = edit.description

            if(edit.values){
                updatedState.attributeValues = edit.values
            }
            setState(updatedState)
        }

    }, [edit]);



    function handleChange(e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, index?: number) {
        const {name, value} = e.target

        if (index === undefined) {
            setState(prevState => ({
                ...prevState,
                [name]: value
            }))
        } else {
            setState(prevState => {
                const updatedAttributeValues = prevState.attributeValues.map((val, i) => i === index ? {
                    ...val,
                    [name]: value
                } : val)
                return {
                    ...prevState,
                    attributeValues: updatedAttributeValues
                }
            })
        }
    }

    function addNewAttributeValue() {
        setState(prevState => ({
            ...prevState,
            attributeValues: [
                ...prevState.attributeValues,
                {value: "", label: ""}
            ]
        }))
    }


    async function handleSubmit(e) {
        e.preventDefault();

        try {
            if (edit && edit?.attribute_id) {
                let response = await apis.patch("/products-service/api/attributes/" + edit?.attribute_id, {
                    name: state.name,
                    description: state.description,
                    attributeValues: state.attributeValues
                })
            } else {
                let response = await apis.post("/products-service/api/attributes", {
                    name: state.name,
                    description: state.description,
                    attributeValues: state.attributeValues
                })
                console.log(response)
            }
        } catch (ex) {
            console.log(ex)
        }
    }

    return (
        <div className="rounded">

            <form onSubmit={handleSubmit} className="max-w-xl">

                <div>
                    <h2 className="m-0 pb-4">{(edit && edit.attribute_id) ? "Update"  : "Add"} Attribute</h2>
                    <input
                        type="text"
                        onChange={handleChange}
                        name="name"
                        value={state.name}
                        placeholder="Attribute Name"
                    />

                    <textarea
                        onChange={handleChange}
                        placeholder="Atte description"
                        name="description"
                        value={state.description}
                    />

                    <h4 className="p-0 m-0">Attribute value</h4>
                    {state.attributeValues.map((av, index) => (
                        <div className="flex">
                            <input
                                type={state.name === "color" ? "color": "text" }
                                onChange={(e) => handleChange(e, index)}
                                name="value"
                                value={av.value}
                                placeholder="Attribute Value"
                            />
                            <input
                                type="text"
                                onChange={(e) => handleChange(e, index)}
                                name="label"
                                value={av.label}
                                placeholder="Attribute Value label"
                            />
                        </div>
                    ))}
                    <button className="py-1 px-2 text-xs" onClick={addNewAttributeValue}>Add More value</button>

                </div>


                <div className="flex items-center gap-x-2 py-4">
                    <button>{(edit && edit.attribute_id) ? "Update"  : "Add"}</button>
                    <button type="button" onClick={onClose}>Cancel</button>
                </div>

            </form>


        </div>
    );
};

export default AddAttribute;