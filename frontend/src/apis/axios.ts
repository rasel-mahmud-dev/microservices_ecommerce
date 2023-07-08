import axios from "axios";


const apis = axios.create({
    baseURL: "http://localhost:80"
})

export default apis
