


import { FaChevronDown } from "react-icons/fa";
import { X } from "lucide-react";
import { useHook } from "../../hook/useHook";



export const SidebarDown = ({setModalOpen, contentHook}:{
    setModalOpen:(e:boolean)=>void,
    contentHook:any,
})=>{

    const { open, setOpen } = useHook();



    return(
        <div
            onClick={()=>setOpen(v =>!v)} 
            className="flex gap-2 items-center cursor-pointer justify-center md:hidden relative" 
        >

            <span className="font-semibold dark:text-white text-lg">Menu</span>
            {
                open ? <X size={20} className="mt-1 font-bold dark:text-white"/> : <FaChevronDown className="mt-1 dark:text-white"/>
            }
            
            {
                open && 
                <div className="bg-white dark:bg-gray-700 shadow-2xl rounded-2xl p-2 absolute top-12 z-50">
                    {/* <Sidebar setModalOpen={setModalOpen} contentHook={contentHook}/> */}
                </div>
            }
            
        </div>
    )
}