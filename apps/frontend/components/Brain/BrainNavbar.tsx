


import { IoMdAddCircleOutline } from "react-icons/io";
// import image from "../assets/brain-generator-idea-svgrepo-com.svg";
// import image from "../../Icons/brain-generator-idea-svgrepo-com.svg"
import { useRouter } from "next/navigation";
import { FaYoutube } from "react-icons/fa";
import { RiTwitterFill } from "react-icons/ri";
import { IoSettingsSharp } from "react-icons/io5";
import { FaGithub } from "react-icons/fa6";
import { Aperture, PlusCircle } from "lucide-react"
import { Button } from "@repo/ui/button";
import { Image } from "../../Icons/icon";



export const SidebarButton = [
    {
        icon: <Aperture size={15}/>,
        name: "All"
    },
    {
        icon: <FaYoutube/>,
        name: "Youtube"
    },
    {
        icon : <RiTwitterFill/>,
        name: "Twitter"
    },
    {
        icon: <FaGithub/>,
        name: "Github"
    }
]


export const BrainNavbar = ({setSlctButton, slctButton}:{
    slctButton : string,
    setSlctButton : (val:string)=>void
})=>{

    const router = useRouter();
    

    function clickHandler(name:string){
        const value = name === "All" ? "" : name.toLowerCase();
    }


    return(
        <div className="flex gap-3">
            {
                    SidebarButton.map((items, index)=>(
                    <div 
                        onClick={()=>setSlctButton(items.name)}
                        key={index}
                        className={`flex py-1 font-semibold text-base dark:text-white items-center gap-2 cursor-pointer px-3 dark:hover:bg-gray-700 ${slctButton === items.name && "bg-gray-700"} hover:bg-gray-600 rounded-xl transition-all duration-300 ease-in-out`}>
                        {items.icon}
                        {items.name}
                    </div>
                ))
            }
        </div>
    )
}