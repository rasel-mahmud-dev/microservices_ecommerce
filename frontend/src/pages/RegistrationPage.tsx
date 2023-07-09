import React, {useState} from 'react';
import {Link} from "react-router-dom";
import apis from "../apis/axios.ts";

const RegistrationPage = () => {

    const [userData, setUserData] = useState({
        email: "",
        password: "",
        username: ""
    })

    function handleChange(e) {
        setUserData(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }))
    }

    function handleSubmit(e){
        e.preventDefault();

        apis.post("/users-service/api/users/create", {
            username: userData.username,
            email: userData.email,
            password: userData.password,
        })
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
                </div>
                <div className="text-sm my-4">Already have an account ? <Link to="/login">login</Link></div>
                <button>Create</button>
            </form>
        </div>
    );
};

export default RegistrationPage;