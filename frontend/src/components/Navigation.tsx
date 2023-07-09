import React from 'react';
import {NavLink} from "react-router-dom";
import useAuthState from "../store/authState.ts";
import {BiCart} from "react-icons/bi";
import {BsCart, BsHeart} from "react-icons/bs";


function openAuthDropdown(){
    return (
        <div>

        </div>
    )
}

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
                    <div className="flex items-center justify-between ">

                        <div className="flex items-center gap-x-2 mr-10">

                            <div className="rounded-full w-8 h-8 bg-gray-700 flex items-center justify-center">
                            <BsHeart />
                            </div>

                            <div className="rounded-full w-8 h-8 bg-gray-700 flex items-center justify-center">
                                <BsCart />
                            </div>

                        </div>

                        <div>
                            {authState.auth ? (
                                <div className="flex items-center gap-x-2">
                                    {authState.auth.avatar && (
                                        <div>
                                            <img className="w-10 h-10 rounded-full" src={authState.auth.avatar} alt=""/>
                                        </div>
                                    )}
                                    <span className="font-medium text-lg">{authState.auth.username}</span>
                                </div>
                            ) : (
                                <NavLink to="/login">Login</NavLink>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Navigation;