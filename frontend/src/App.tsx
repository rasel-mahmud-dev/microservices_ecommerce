import {useEffect, useState} from 'react'
import './App.scss'
import useAuthState from "./store/authState.ts";
import {BrowserRouter, NavLink, Route, Routes} from "react-router-dom";
import Products from "./pages/Products.tsx";

import Attributes from "./pages/admin/Attributes.tsx";
import AddProduct from "./pages/AddProduct.tsx";
import ProductDetail from "./pages/ProductDetail.tsx";
import HomePage from "./pages/HomePage.tsx";
import Navigation from "./components/Navigation.tsx";
import LoginPage from "./pages/LoginPage.tsx";
import RegistrationPage from "./pages/RegistrationPage.tsx";
import apis from "./apis/axios.ts";
import Dashboard from "./pages/admin/Dashboard.tsx";

function App() {
    const [count, setCount] = useState(0)

    const authState = useAuthState()

    useEffect(()=>{
        apis.get("/users-service/api/users/validate").then(({data, status})=>{
            if(status === 200){
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
                        <Route path="/" element={<HomePage/>} children={(
                            <>
                                <Route path="/products" element={<Products/>}/>
                                <Route path="/p/:productId" element={<ProductDetail/>}/>
                                <Route path="/add-product" element={<AddProduct/>}/>
                                <Route path="/update-product/:productId" element={<AddProduct/>}/>
                                <Route path="/attributes" element={<Attributes/>}/>
                                <Route path="/login" element={<LoginPage/>}/>
                                <Route path="/registration" element={<RegistrationPage/>}/>
                            </>
                        )}/>


                        <Route path="/dashboard" children={(
                            <>
                                <Route path="attributes" element={<Attributes/>}/>
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
