import useCartState from "../store/cartState.ts";
import {CgTrash} from "react-icons/cg";
import useCustomToast from "../hooks/useCustomToast.tsx";
import {useNavigate} from "react-router-dom";
import {useState} from "react";
import apis from "../apis/axios.ts";

const Payment = () => {

    const {carts} = useCartState()

    const [selectPaymentMethod, setSelectPaymentMethod] = useState("COD")

    const toast = useCustomToast()

    const navigate = useNavigate()

    function totalPay() {
        let totalPrice = carts.reduce((acc, item) => {
            return acc + item.product.price * item.quantity
        }, 0)
        return totalPrice
    }

    async function handlePayment() {
        if (selectPaymentMethod === "COD") return toast("You cart is currently empty", true)

        if (selectPaymentMethod === "BKASH") {
            const {data} = await apis.post("/payment-service/api/payment/checkout")
            window.location.href = data + `&token=` + localStorage.getItem("token") || ""
        }

    }

    // https://sandbox.payment.bkash.com/redirect/tokenized/?paymentID=TR0000HxQkslx1689161036346&hash=NEZst7Xq0txkQUK3eHXonEc8qeF0g1nx3aNEF7wNYxRfjm8GfR(1t8x02ZnYLaj8wkkXOLI3aHXx5VPC!nhYa8RGks-89prnFsp41689161036401&mode=0000&apiVersion=v1.2.0-beta&token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoyLCJpYXQiOjE2ODkxNDY2NzUsImV4cCI6MTY5MTczODY3NX0.aARPmtTXcFlGoavsnZroENqQ9aEJfQqgX7Rcq8I8u0w

    const paymentMethod = {
        COD: {
            label: "Cash on delivery",
            render: <div>
                <p>
                    Sorry, Currently not available cash on delivery
                </p>
            </div>
        },
        BKASH: {
            label: "Bkash",
            render: <div>
                <button onClick={handlePayment}>Pay with Bkash</button>
            </div>
        },
        CARD: {
            label: "Credit Card",
            render: <div>sdlfkjsdklfjsdlkfj</div>
        },
        SSCL: {
            label: "Cash on delivery",
            render: <div>sdlfkjsdklfjsdlkfj</div>
        }
    }

    return (
        <div>
            <div className="container">
                <h2 className="py-4 text-xl font-medium text-white">Payment</h2>

                <div className="grid grid-cols-12">

                    <div className="py-4 col-span-8">
                        <h2 className="py-4 text-base font-medium text-white">Select Payment Method</h2>

                        {Object.keys(paymentMethod).map(key => (
                            <div className="flex items-center gap-x-2 py-2">
                                <input onChange={() => setSelectPaymentMethod(key)} name="payment-type" id={key}
                                       type="radio" className="w-max !mb-0"/>
                                <label className="text-sm font-medium" htmlFor={key}>{paymentMethod[key].label}</label>
                            </div>
                        ))}

                        <div className="mt-6">

                            <h2 className="py-4 text-base font-medium text-white">Payment</h2>
                            <div>
                                {paymentMethod[selectPaymentMethod].render}
                            </div>

                        </div>


                    </div>

                    <div className="py-4 col-span-4">

                        <div>

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
                            <h2 className="py-4 text-sm font-medium text-white">Total: {totalPay()}</h2>
                        </div>

                    </div>

                </div>

            </div>
        </div>
    );
};

export default Payment;