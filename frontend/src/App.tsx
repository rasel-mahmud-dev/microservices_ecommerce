import {useEffect, useState} from 'react'
import './App.scss'
import useAuthState from "./store/authState.ts";
import {BrowserRouter, Route, Routes} from "react-router-dom";
import Products from "./pages/admin/Products.tsx";

import Attributes from "./pages/admin/Attributes.tsx";
import AddProduct from "./pages/admin/AddProduct.tsx";
import ProductDetail from "./pages/ProductDetail.tsx";
import HomePage from "./pages/HomePage.tsx";
import Navigation from "./components/Navigation.tsx";
import LoginPage from "./pages/LoginPage.tsx";
import RegistrationPage from "./pages/RegistrationPage.tsx";
import apis from "./apis/axios.ts";
import Dashboard from "./pages/admin/Dashboard.tsx";
import HomeLayout from "./pages/HomeLayout.tsx";

function App() {
    const [count, setCount] = useState(0)

    const authState = useAuthState()

    useEffect(() => {
        apis.get("/users-service/api/users/validate").then(({data, status}) => {
            if (status === 200) {
                authState.setAuth(data.user)
            }
        })
    }, [])


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
                </div>
            </BrowserRouter>
        </div>
    )
}

export default App
