import {useEffect, useState} from 'react'
import './App.scss'
import useAuthState from "./store/authState.ts";
import {BrowserRouter, NavLink, Route, Routes} from "react-router-dom";
import Products from "./pages/Products.tsx";
import axios from "axios";
import Attributes from "./pages/Attributes.tsx";
import AddProduct from "./pages/AddProduct.tsx";

function App() {
    const [count, setCount] = useState(0)

    const auth = useAuthState()
    axios.defaults.baseURL = "http://127.0.0.1:1003"

    return (
        <div>
            <BrowserRouter>

                <div className="flex items-center gap-x-2 bg-orange-500 px-4 py-2 rounded my-4">
                    <NavLink to="/products">Products</NavLink>
                    <NavLink to="/attributes">Attributes</NavLink>
                </div>


                <Routes>
                    <Route path="/products" element={<Products/>}/>
                    <Route path="/add-product" element={<AddProduct/>}/>
                    <Route path="/attributes" element={<Attributes/>}/>
                </Routes>
            </BrowserRouter>
        </div>
    )
}

export default App
