

import { useRouter } from "next/navigation";
import { RxCross2 } from "react-icons/rx";

import { VscDashboard, VscSignOut } from "react-icons/vsc"
import { useStore } from "../Storage/useStore";
import { toast } from "sonner";
import api from "../API/Interceptor";



export const DropdownProfile = ({setOpen}:{
    setOpen: (e:boolean)=>void
})=>{
    const router = useRouter();
    const user = useStore((state)=>state.user);

    async function logOutHandler() { 
        const toastId = toast.loading("Loading...")
        try{
            const response = await api.post("/logout", {});
            useStore.getState().logout();
            toast.success(response.data.message);
            router.push("/signin");
        }
        catch(e:any){
            toast.error(e?.response?.data.message);
        }finally{
            toast.dismiss(toastId);
        }
    }

    return(
        <div className="py-4 px-6 absolute bg-gradient-to-tl from-slate-900 to-gray-950 border border-gray-800 top-[3em] right-[2%] rounded-xl z-10">
            <div onClick={()=>setOpen(false)} className="mb-3 text-xl w-10 rounded-full h-10 flex justify-center items-center bg-gray-800 cursor-pointer">
                <RxCross2/>
            </div>
            <div className="flex flex-col gap-4">
                <div className="max-w-max border-b py-5 px-16 rounded-xl bg-violet-400 flex flex-col justify-center items-center">
                    <img src={user?.image} className="w-11 h-11 mb-4 rounded-full bg-red-500 text-purple-500 flex items-center justify-center font-bold"></img>
                    <p className="">{user?.firstname} {user?.lastname}</p>
                    <p className="text-sm text-gray-600">{user?.email}</p>
                </div>
                <div onClick={()=>{
                    router.push("/dashboard/profile")
                }} className="flex w-full items-center px-3 py-2 gap-x-1 text-lg text-richblack-100 hover:bg-gray-600 rounded-xl cursor-pointer">
                    <VscDashboard className="text-lg" />
                    Profile
                </div>

                <div
                onClick={logOutHandler}
                    className="flex w-full items-center px-3 py-2 gap-x-1 text-lg text-richblack-100 hover:bg-gray-600 rounded-xl cursor-pointer"
                >
                    <VscSignOut className="text-lg" />
                    Logout
                </div>
            </div>
        </div>
    )
}