import { Dashboard_Sidebar } from "@repo/ui/Dashboard_Sidebar"
import { X } from "lucide-react"




export const Minisize_Sidebar = ({active, setActive}:{
    active : boolean,
    setActive : (e:boolean)=>void,
})=>{


 
    return(
        <>
            {
                active
                &&
                <div className="absolute bg-gray-950 inset-0 h-screen p-8">
                    <div className="float-end"><X size={30} onClick={()=>setActive(false)}/></div>
                    <div className="">
                        <Dashboard_Sidebar/>
                    </div>
                </div>
                // isko hata simply new component banado for mobile UI ke liye jaha pura screen pe sidebar dikhe and top ke ek cross button dikhe
            }
        </>
    )
}