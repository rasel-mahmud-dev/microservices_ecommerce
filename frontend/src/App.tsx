import {useEffect, useState} from 'react'
import './App.css'
import useAuthState from "./store/authState.ts";
import {BrowserRouter, NavLink, Route, Routes} from "react-router-dom";
import Products from "./pages/Products.tsx";
import axios from "axios";
import Attributes from "./pages/Attributes.tsx";

function App() {
    const [count, setCount] = useState(0)

    const auth = useAuthState()

    axios.defaults.baseURL = "http://127.0.0.1:1003"


    console.log(auth)
    return (
        <div>
            <BrowserRouter>


                <div className="flex items-center gap-x-2">
                    <NavLink to="/products">Products</NavLink>
                    <NavLink to="/attributes">Attributes</NavLink>
                </div>


                <Routes>
                    <Route path="/products" element={<Products/>}/>
                    <Route path="/attributes" element={<Attributes/>}/>
                </Routes>
            </BrowserRouter>
        </div>
    )
}

export default App
