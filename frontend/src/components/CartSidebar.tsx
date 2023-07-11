import React, {FC, memo} from 'react';

import "./card-sidebar.scss"
import {Cart} from "../store/cartState.ts";
import {FaTimes} from "react-icons/fa";
import {CgTrash} from "react-icons/cg";

interface CartSidebarProps {
    onClose: () => void,
    isOpen: boolean,
    carts: Cart
}

const CartSidebar: FC<CartSidebarProps> = ({onClose, isOpen, carts}) => {
    return (
        <div className={`right-sidebar ${isOpen ? "sidebar-open" : "sidebar-close"}`}>
            <div onClick={onClose} className="backdrop"></div>

            <div>

                <div className="card-sidebar">

                    <div onClick={()=>onClose()} className="cursor-pointer">
                        <FaTimes  />
                    </div>


                    <div className="py-4">
                        {carts.map(cart=>(
                            <div className="border-b border-gray-100/20 pt-4 pb-5 last:border-0">

                                <div className="flex items-start gap-x-2">
                                    <div className="w-20">
                                        <img className="w-full" src={cart.product.image} alt=""/>
                                    </div>

                                    <div>
                                        <div className="flex items-start gap-x-2">
                                            <h4 className="m-0 p-0">{cart.product.title}</h4>
                                            <CgTrash onCli className="mt-1"/>
                                        </div>
                                        <div className="text-sm">
                                            <p className="m-0 p-0">SKU: {cart.sku}</p>
                                            <p className="m-0 p-0 mt-2">QTY: {cart.quantity}</p>
                                            <p className="m-0 p-0">inc vat</p>
                                            <h4 className="text-primary text-sm m-0 p-0">${cart.product.price}</h4>
                                        </div>
                                    </div>
                                </div>

                            </div>
                        ))}
                    </div>

                    <button>Checkout</button>

                </div>

            </div>
        </div>
    );
};

export default memo(CartSidebar);