



import { FaYoutube } from "react-icons/fa";
import { RiTwitterFill } from "react-icons/ri";
import { FaGithub } from "react-icons/fa6";
import { Aperture, Globe } from "lucide-react"
import { LuLinkedin } from "react-icons/lu";



export const SidebarButton = [
    {
        icon: <Aperture size={13}/>,
        name: "All"
    },
    {
        icon: <FaYoutube/>,
        name: "youtube"
    },
    {
        icon : <RiTwitterFill/>,
        name: "twitter"
    },
    {
        icon: <FaGithub/>,
        name: "github"
    },
    {
        icon: <LuLinkedin/>,
        name: "linkedin"
    },
    {
        icon: <Globe size={15}/>,
        name: "website"
    },
]


export const BrainNavbar = ({setSlctButton, slctButton}:{
    slctButton : string,
    setSlctButton : (val:string)=>void
})=>{

    return(
        <div className="flex gap-3">
            {
                    SidebarButton.map((items, index)=>(
                    <div 
                        onClick={()=>setSlctButton(items.name)}
                        key={index}
                        className={`flex py-1 text-sm dark:text-white items-center gap-2 cursor-pointer px-3 dark:hover:bg-gray-700 ${slctButton === items.name && "bg-gray-700"} hover:bg-gray-600 rounded-xl transition-all duration-300 ease-in-out`}>
                        {items.icon}
                        {items.name}
                    </div>
                ))
            }
        </div>
    )
}