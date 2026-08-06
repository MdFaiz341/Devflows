import { useState } from "react"
import { toast } from "sonner";
import api from "../API/Interceptor";
import { useHook } from "./useHook";



export const useContent = ()=>{
    const [content, setContent] = useState([]);
    const {loading, setLoading} = useHook();
    const [type, setType] = useState("");

    async function getContentApi(){
        try{
            setLoading(true);
            await new Promise((res)=> setTimeout(res, 1000));
            const response = await api.post("/allcontent", {type});
            setContent(response.data.data);
        }
        catch(e:any){
            toast.error(e.response.data.message || "Couldn't able to fetch data");
        }finally{
            setLoading(false);
        }
    }

    return {
        content,
        getContentApi,
        setType, type,
        loading, setLoading,
    }

}