import {lazy, useEffect, useState} from 'react'
import './App.scss'
import useAuthState from "./store/authState.ts";
import {BrowserRouter, Route, Routes} from "react-router-dom";
import {Toaster} from "react-hot-toast";
import apis from "./apis/axios.ts";
import HomeLayout from "./pages/HomeLayout.tsx"
import Dashboard from "./pages/admin/Dashboard.tsx"
import useCartState from "./store/cartState.ts";
import Checkout from "./pages/Checkout.tsx";

const Products = lazy(() => import( "./pages/admin/Products.tsx"));
const Attributes = lazy(() => import( "./pages/admin/Attributes.tsx"));
const AddProduct = lazy(() => import( "./pages/admin/AddProduct.tsx"));
const ProductDetail = lazy(() => import( "./pages/ProductDetail.tsx"));
const HomePage = lazy(() => import( "./pages/HomePage.tsx"));
const Navigation = lazy(() => import( "./components/Navigation.tsx"));
const LoginPage = lazy(() => import( "./pages/LoginPage.tsx"));
const RegistrationPage = lazy(() => import( "./pages/RegistrationPage.tsx"));
// const Dashboard  = lazy(()=>import( "./pages/admin/Dashboard.tsx"));


// const HomeLayout  = lazy(()=>import( "./pages/HomeLayout.tsx"));


function App() {
    const [count, setCount] = useState(0)

    const authState = useAuthState()
    const {fetchCarts} = useCartState()

    useEffect(() => {
        apis.get("/users-service/api/users/validate").then(({data, status}) => {
            if (status === 200) {
                authState.setAuth(data.user)
            }
        })
    }, [])


    useEffect(() => {
        apis.get("/carts-service/api/carts").then(({data}) => {
            fetchCarts(data)
        })
    }, []);


    return (
        <div>
            <BrowserRouter>

                <Navigation></Navigation>
                <div className="header-space"></div>


                <div className="">
                    <Routes>


                        <Route path="/" element={<HomeLayout/>} children={(
                            <>
                                <Route path="" element={<HomePage/>}/>
                                <Route path="p/:productId" element={<ProductDetail/>}/>
                                <Route path="login" element={<LoginPage/>}/>
                                <Route path="checkout" element={<Checkout/>}/>
                                <Route path="registration" element={<RegistrationPage/>}/>
                            </>
                        )}/>


                        <Route path="/dashboard" children={(
                            <>
                                <Route path="attributes" element={<Attributes/>}/>
                                <Route path="product-list" element={<Products/>}/>
                                <Route path="update-product/:productId" element={<AddProduct/>}/>
                                <Route path="add-product" element={<AddProduct/>}/>
                                <Route path="attribute-value" element={<RegistrationPage/>}/>
                            </>
                        )} element={<Dashboard/>}/>
                    </Routes>

                    <Toaster/>

                </div>
            </BrowserRouter>
        </div>
    )
}

export default App
