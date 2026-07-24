"use client"

import { Trash2 } from "lucide-react"
import { useRef } from "react"
import { useStore } from "../Storage/useStore"
import {toast} from "sonner"
import api from "../API/Interceptor"
import { useHook } from "../hook/useHook"
import { useRouter } from "next/navigation"
import { Button } from "@repo/ui/button"
import { InputField } from "@repo/ui/input"






export const DeleteAccount = ({open, setOpen}:{
    open:boolean,
    setOpen: (e:boolean)=>void
})=>{

    const inputRef = useRef<HTMLInputElement>(null);
    const {loading, setLoading } = useHook();
    const router = useRouter();


    async function deleteHanler() {
        const email = inputRef.current?.value;
        if(!email){
            alert("Enter correct email");
            return;
        }
        try{
            setLoading(true);
            await new Promise((res)=>setTimeout(res, 3000));
            const response = await api.post("/deleteAccount", {email});
            useStore.getState().logout();
            router.push("/signup");
            toast.success(response.data.message);
        }
        catch(e:any){
            toast.error(e.response.data?.message);
        }finally{
            setLoading(false);
        }
    }


    return(
        <>
            {
                open &&
                <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/40 transition-all duration-300">
                    <div className="flex w-[342px] flex-col gap-8 bg-gradient-to-br from-gray-800 via-gray-900 to-black rounded-2xl p-5">
                        <h1 className="text-2xl font-bold text-white">Are you Sure ?</h1>
                        <InputField
                            label="Email" 
                            ref={inputRef}
                            type='text'
                            placeholder='you@example.com'
                        />
    
                        <div className="flex gap-10 items-center w-full justify-between">
                            <Button 
                                type="button" design="outline" text="Cancle" onClick={()=>setOpen(false)}
                                className="rounded-xl px-5 py-2.5 "
                            />
                            
                            {
                                loading 
                                ? <div className="flex w-full justify-center items-center">
                                    <div className="loader w-10 h-10 bottom-4"></div>
                                </div>
                                :  <Button
                                        type="button"
                                        text="Delete account"
                                        design="redbtn"
                                        onClick={deleteHanler}
                                        className="flex items-center gap-2 px-5 py-2 "
                                        icon={<Trash2 size={16} />}
                                        iconFirst={true}
                                    />
                            }
                               
                        </div>
                    </div>
                </div>
            }
        </>
        
    )
}