import React, {useState} from 'react';
import {Link} from "react-router-dom";
import apis from "../apis/axios.ts";

const LoginPage = () => {

    const [userData, setUserData] = useState({
        email: "",
        password: ""
    })

    function handleChange(e) {
        setUserData(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }))
    }

    function handleSubmit(e){
        e.preventDefault();

        apis.post("/users-service/api/users/login", {
            email: userData.email,
            password: userData.password,
        }).then(({data, status})=>{
            if(status === 200 && data.token){
                localStorage.setItem("token", data.token)
            }
        })

    }

    return (
        <div>
            <form onSubmit={handleSubmit} className="max-w-xl mx-auto">

                <div>
                    <h2>Basic info</h2>
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
                <div className="text-sm my-4">New user? <Link to="/registration">registration</Link></div>
                <button>Login</button>
            </form>
        </div>
    );
};

export default LoginPage;