import  {FC, memo} from 'react';

import "./card-sidebar.scss"
import useCartState, {Cart} from "../store/cartState.ts";
import {FaTimes} from "react-icons/fa";
import {CgTrash} from "react-icons/cg";
import {Link} from "react-router-dom";

interface CartSidebarProps {
    onClose: () => void,
    isOpen: boolean,
    carts: Cart
}

const CartSidebar: FC<CartSidebarProps> = ({onClose, isOpen}) => {

    const {toggleSelectCartItem, selectedCartItem, carts} = useCartState()


    return (
        <div className={`right-sidebar ${isOpen ? "sidebar-open" : "sidebar-close"}`}>
            <div onClick={onClose} className="backdrop"></div>

            <div>

                <div className="card-sidebar">

                    <div onClick={() => onClose()} className="cursor-pointer">
                        <FaTimes/>
                    </div>


                    <div className="py-4">
                        {carts.map(cart => (
                            <div
                                className="border-b border-gray-100/20 pt-4 pb-5 last:border-0 flex items-start gap-x-2">

                                <input onChange={() => toggleSelectCartItem(cart.cart_id as string)}
                                       checked={selectedCartItem.includes(cart.cart_id as string)} type="checkbox"/>

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

                    <Link to="/checkout"><button>Checkout</button></Link>

                </div>

            </div>
        </div>
    );
};

export default memo(CartSidebar);