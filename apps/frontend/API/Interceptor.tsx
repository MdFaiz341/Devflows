

import axios from "axios";
import { useStore } from "../Storage/useStore";
import { toast } from "sonner";
import 'dotenv/config' 



const api = axios.create({
    baseURL:process.env.NEXT_PUBLIC_HTTP_SERVER_URL,
    withCredentials:true,
})

// attach token
api.interceptors.request.use(
    (config)=>{
        return config;
    },
    (error)=>{
        return Promise.reject(error);
    }
)

// catch 401;
api.interceptors.response.use(
    (res)=>res,
    async(error)=>{

        if(error.response?.status === 401){
            console.log("Invalid Token");
            useStore.getState().logout();
            try{
                await axios.post(`${process.env.NEXT_PUBLIC_HTTP_SERVER_URL}/logout`, {}, { withCredentials: true });
            }
            catch(e){
                console.error("Failed to clear cookie on backend", e);
            }
            window.location.href = "/signin";
            toast.error("Session Expired")
        }
        return Promise.reject(error);
    }
)


export default api;