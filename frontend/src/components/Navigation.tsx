import React from 'react';
import {NavLink} from "react-router-dom";
import useAuthState from "../store/authState.ts";

const Navigation = () => {

    const authState = useAuthState()

    return (
        <header>
            <div className="container">
                <div className="flex justify-between items-center">
                    <div className="flex items-center gap-x-2  px-4 py-2 rounded my-4">
                        <NavLink to="/">Home</NavLink>
                        <NavLink to="/products">Products</NavLink>
                        <NavLink to="/attributes">Attributes</NavLink>
                    </div>
                    <div>
                        {authState.auth ? (
                            <div>
                                <span>{authState.auth.username}</span>
                            </div>
                        ) : (
                            <NavLink to="/login">Login</NavLink>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Navigation;