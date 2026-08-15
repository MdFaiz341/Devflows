"use client"

import { useEffect, useRef } from "react";
import api from "../API/Interceptor";
import { useStore } from "../Storage/useStore";
import { useHook } from "../hook/useHook";
import { Loader2 } from "lucide-react";
import { useChatStore } from "../Storage/useChatStore";
import { useRouter } from "next/navigation";



export default function AuthProvider({children}:{
    children : React.ReactNode
}){

    const setUser = useStore((state)=> state.setUser);
    const logout = useStore((state)=>state.logout);
    const {loading, setLoading} = useHook();
    const fetchProfileRef = useRef(false);
    const router = useRouter();

    useEffect(()=>{
        async function fetchProfile() {
            try{
                setLoading(true);

                const response = await api.get("/profile");
                setUser({
                    firstname:response.data.user.firstname,
                    lastname:response.data.user.lastname,
                    image:response.data.user.image,
                    email : response.data.user.email,
                    id:response.data.user.id
                });
                console.log("user Set")
                setLoading(false);
            }
            catch(e:any){
                console.log(e);
                logout();
                router.push("/signin");
                return;
            }

            //  WE CAN ADD TIME OF 10S TO CAL AAGAIN THE PROFILE 
            // Loading lagana hai
        }
        
        if(!fetchProfileRef.current){
            console.log("Auth privider---");
            fetchProfile();
            fetchProfileRef.current = true;
        }

        // const times = setInterval(()=>{
        //     fetchProfile();
        // }, 20000);
        
        // return ()=>{
        //     clearInterval(times);
        // }
        
    }, []);

    
    if (loading) {
        return (
            <div className="absolute inset-0 z-10 w-screen h-screen flex flex-col justify-center items-center backdrop-blur-xs">
                <div className="loaderCanvas w-20"></div>
                <span className="mt-4 ml-2 text-white text-lg">Loading...</span>
            </div>
        );
    }


    return <>{children}</>

}