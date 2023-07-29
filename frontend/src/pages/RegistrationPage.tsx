import  {ChangeEvent, FormEvent, useState} from 'react';
import {Link} from "react-router-dom";
import apis from "../apis/axios.ts";
import  {AxiosResponse} from "axios";

const RegistrationPage = () => {

    const [userData, setUserData] = useState<{
        email: string,
        password: string,
        username: string,
        avatar: string,
        avatarBlob?: File
    }>({
        email: "",
        password: "",
        username: "",
        avatar: "",
        avatarBlob: undefined
    })


    function handleChange(e: ChangeEvent<HTMLInputElement>) {
        setUserData(prev => ({
            ...prev,
            [e.target.name]: e.target.name === "avatarBlob"
                ? ((e.target) as { files: FileList }).files[0]
                : e.target.value
        }))
    }


    async function handleSubmit(e: FormEvent<HTMLFormElement>){
        e.preventDefault()

        // first uploaded image

        try{
            let response: AxiosResponse<{url: string}> | undefined = undefined
            if(userData.avatarBlob) {
                const formData = new FormData()
                formData.append("image", userData.avatarBlob, userData.avatarBlob.name)
                formData.append("folder", "avatar")
                response = await apis.post("/products-service/api/upload-image", formData)
            }

            let avatar: string = ""

            if(response && response.status === 200){
                avatar = response.data.url
            }

            await apis.post("/users-service/api/users/create", {
                username: userData.username,
                email: userData.email,
                avatar: avatar,
                password: userData.password,
            })

        } catch (ex){

        }
    }

    return (
        <div>
            <form onSubmit={handleSubmit} className="max-w-xl mx-auto">

                <div>
                    <h2>Basic info</h2>
                    <input
                        type="text"
                        onChange={handleChange}
                        name="username"
                        value={userData.username}
                        placeholder="Username"
                    />
                    <input
                        type="email"
                        onChange={handleChange}
                        name="email"
                        value={userData.email}
                        placeholder="Email"
                    />
                    <input
                        type="password"
                        onChange={handleChange}
                        name="password"
                        value={userData.password}
                        placeholder="Password"
                    />
                    <input
                        type="file"
                        onChange={handleChange}
                        name="avatarBlob"
                    />
                </div>
                <div className="text-sm my-4">Already have an account ? <Link to="/login">login</Link></div>
                <button>Create</button>
            </form>
        </div>
    );
};

export default RegistrationPage;