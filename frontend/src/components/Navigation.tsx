import React, {useState} from 'react';
import {Link, NavLink} from "react-router-dom";
import useAuthState from "../store/authState.ts";
import {BsCart, BsHeart} from "react-icons/bs";
import CartSidebar from "./CartSidebar.tsx";
import useCartState from "../store/cartState.ts";


function openAuthDropdown() {
    return (
        <div className="absolute top-14 right-0 bg-gray-800 p-5">
            <ul className="list-none m-0 p-0 px-4">
                <li className="m-0 pb-2">
                    <Link to="/dashboard">Dashboard</Link>
                </li>
                <li className="m-0 py-2">
                    <Link to="/dashboard">Dashboard</Link>
                </li>
                <li className="m-0 pt-2"><Link to="/dashboard">Dashboard</Link></li>

            </ul>
        </div>
    )
}

const Navigation = () => {

    const authState = useAuthState()
    const {carts, isOpenCart, toggleOpenCart} = useCartState()

    const [open, setOpen] = useState("")

    return (
        <header>
            <div className="container">
                <div className="flex justify-between items-center">

                    <div className="flex items-center gap-x-2  px-4 py-2 rounded my-4">
                        <NavLink to="/">Home</NavLink>
                    </div>

                    <div className="flex items-center gap-x-10">

                        <div className="flex items-center gap-x-2 ">
                            <div className="rounded-full w-8 h-8 bg-gray-700 flex items-center justify-center">
                                <BsHeart/>
                            </div>

                            <div className="relative" onClick={() => toggleOpenCart(true)}>

                            <div
                                 className="rounded-full w-8 h-8 bg-gray-700 flex items-center justify-center">
                                <BsCart/>
                            </div>
                                <span className="absolute -top-2 -right-2 text-[10px] rounded-full w-5 h-5 bg-primary flex items-center justify-center ">{carts.cart_items.length}</span>
                            </div>

                           <CartSidebar carts={carts} isOpen={isOpenCart} onClose={() => toggleOpenCart(false)}/>

                        </div>

                        <div>
                            {authState.auth ? (
                                <div className="flex items-center gap-x-2 relative"
                                     onClick={() => setOpen(p => p === "auth" ? "" : "auth")}>
                                    {authState.auth.avatar && (
                                        <div>
                                            <img className="w-8 h-8 rounded-full" src={authState.auth.avatar} alt=""/>
                                        </div>
                                    )}
                                    <span className="font-medium text-lg">{authState.auth.username}</span>

                                    {
                                        open === "auth" && openAuthDropdown()
                                    }

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