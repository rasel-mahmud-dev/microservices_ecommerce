import axios from "axios";

const apis = axios.create({
    baseURL: "http://localhost:80"
})

apis.interceptors.request.use(function (config){
    config.headers["token"] = localStorage.getItem("token") || ""
    return config
})

export default apis
