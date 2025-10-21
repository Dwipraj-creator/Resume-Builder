import axios from "axios"
import { BASE_URL } from "./apiPaths"

const axioInstance = axios.create({
    baseURL:BASE_URL,
    timeout:10000,
    headers:{
        "Content-Type":"application/json",
        Accept:"application/json",
    }
})

// Request Intercepter 

axioInstance.interceptors.request.use(
    (config)=>{
        const accessTocken = localStorage.getItem("token");
        if(accessTocken){
            config.headers.Authorization = `Bearer ${accessTocken}`
        }
        return config
    },
    (error)=>{
        return Promise.reject(error)
    }
)

// Response Intercceptor 

axioInstance.interceptors.response.use(
    (response)=>{
        return response 
    },
    (error)=>{
        if(error.response){
            if(error.response.status === 401){
                window.location.href = "/"
            }
            else if(error.response.status === 500){
                console.error("Server Error")
            }
           
        } else if(error.code === "ECONNABORTED"){
                console.error("Request timeout")
            }
            return Promise.reject(error)
    }
)


export default axioInstance

