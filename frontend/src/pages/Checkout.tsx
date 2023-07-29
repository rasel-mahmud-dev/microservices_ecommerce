import useCartState from "../store/cartState.ts";
import {CgTrash} from "react-icons/cg";
import {useNavigate} from "react-router-dom";
import useCustomToast from "../hooks/useCustomToast.tsx";

const Checkout = () => {

    const {carts} = useCartState()

    const toast = useCustomToast()

    const navigate = useNavigate()

    function totalPay() {
        let totalPrice = carts.reduce((acc, item) => {
            return acc + item.product.price * item.quantity
        }, 0)
        return totalPrice
    }

    function handleGoPayment() {
        if (carts && carts.length > 0) {
            navigate("/payment")
        } else {
            toast("You cart is currently empty", true)
        }
    }

    return (
        <div>
            <div className="container">
                <h2 className="py-4 text-xl font-medium text-white">Checkout Page</h2>


                <div className="grid grid-cols-12">


                    <div className="py-4 col-span-8">
                        {carts.map(cart => (
                            <div
                                className="border-b border-gray-100/20 pt-4 pb-5 last:border-0">

                                <div className="flex items-start gap-x-2">
                                    <div className="w-40">
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


                    <div className="py-4 col-span-4">

                        <div>
                            <h2 className="py-4 text-xl font-medium text-white">Summary</h2>
                            <h2 className="py-4 text-sm font-medium text-white">Total: {totalPay()}</h2>


                        </div>

                        <button onClick={handleGoPayment}>Pay & Order</button>
                    </div>

                </div>

            </div>
        </div>
    );
};

export default Checkout;