"use client"


import { useEffect, useRef, useState, type ChangeEvent } from "react";
import { GiNightSleep } from "react-icons/gi";
import { WiDaySunny } from "react-icons/wi";
import { FiSidebar } from "react-icons/fi";
import { PlusCircle, RefreshCcw, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { CreateContent } from "../../../../components/Brain/CreateContent";
import { useHook } from "../../../../hook/useHook";
import { Card } from "../../../../components/Brain/Card";
import { SidebarDown } from "../../../../components/Brain/SidebarDown";
import { useContent } from "../../../../hook/GetContent";
import { useStore } from "../../../../Storage/useStore";
import { Image } from "../../../../Icons/icon";
import { BrainNavbar } from "../../../../components/Brain/BrainNavbar";
import { Button } from "@repo/ui/button";









export default function Brain(){
    const { theme, setTheme, user } = useStore();
    const [sidebar, setSidebar] = useState(true);
    const contentHook = useContent();  // to keep only one instance for dashboard as well as sidebar
    const {open, setOpen} = useHook();
    const findRef = useRef<HTMLInputElement>(null);
    const [val, setVal] = useState<string>("");


    function changeHandler(e:ChangeEvent<HTMLInputElement>){
        setVal(e.target.value);
    }
    useEffect(()=>{
        const time = setTimeout(()=>{
            contentHook.setType(val);
            contentHook.getContentApi();
        }, 700);

        return ()=>{
            clearTimeout(time);
        }
    }, [val]);

    useEffect(()=>{
        if(theme == "dark"){
            document.documentElement.classList.add("dark");
        }
        else{
            document.documentElement.classList.remove("dark");
        }
    }, [theme]);

    useEffect(()=>{
        contentHook.getContentApi();
    }, [contentHook.type]);

    useEffect(() => {
        if (!document.getElementById("twitter-script")) {
            const script = document.createElement("script")
            script.id = "twitter-script"
            script.src = "https://platform.twitter.com/widgets.js"
            document.body.appendChild(script)
        }
    }, []);

    


    return(
        <>
        <CreateContent open={open} setOpen={setOpen}/>
        <div className="flex min-h-screen bg-white overflow-hidden dark:bg-[#020617]">
            {/* Sidebar */}
            {/* <div  className={`fixed top-0 left-0 h-full w-52 md:block hidden shadow-lg transform transition-transform duration-300 
                ${sidebar ? "translate-x-0" : "-translate-x-full"} dark:bg-linear-to-br from-black to-gray-700`}
            >
                <Sidebar setModalOpen={setModalOpen} contentHook={contentHook}/>
            </div> */}
            

            <div className={`flex-1 max-w-full flex flex-col justify-center transition-all duration-300   overflow-y-auto overflow-x-hidden`}>
                {/* top */}
                <div className="bg-gray-900 border-b border-slate-600 sticky top-0 z-40 w-full flex items-center justify-between py-3 px-5  dark:bg-linear-to-bl from-black to-gray-800 drop-shadow-xl backdrop-blur-2xl ">
                    <div className="flex gap-5 items-center justify-center">
                        {/* <FiSidebar onClick={()=>setSidebar(v=>!v)} className="w-6 h-6 md:block hidden cursor-pointer dark:text-white"/> */}
                        <div className="w-8 h-8">
                            <Image/>
                        </div>
                        <div className="text-2xl font-semibold dark:text-blue-500">Brain</div>
                    </div>

                    <BrainNavbar/>
                    
                    <div className="flex gap-6 items-center pr-5">
                        {
                            theme === "dark" 
                            ? <WiDaySunny onClick={()=>setTheme("light")} className="w-7 h-7 cursor-pointer dark:text-white"/>
                            : <GiNightSleep onClick={()=>setTheme("dark")} className="w-6 h-6 cursor-pointer"/>
                        }
                        <motion.input
                            ref={findRef}
                            onChange={changeHandler}
                            whileFocus={{ scale: 1.03 }}
                            type="text"
                            placeholder="Search"
                            autoCapitalize="on"
                            autoFocus={true}
                            className={`px-4 py-1 md:w-xs w-20 rounded-lg bg-fuchsia-200 text-black outline-none focus:ring-2 focus:ring-purple-500`}
                        />
                        
                        {/* <Button
                            type="button"
                            text="Create"
                            design="designedPrimary"
                            className="px-3 shadow-[0_0_40px_rgba(99,102,241,0.55)] py-1 rounded-xl flex items-center gap-2 font-semibold dark:text-white text-lg cursor-pointer transition-all duration-300 ease-in-out"
                            onClick={()=>{setOpen(true)}}
                            icon={<PlusCircle size={20}/>}
                            iconFirst={true}
                        /> */}
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setOpen(true)}
                            className="flex items-center gap-2 px-5 py-1 rounded-2xl bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-500 text-white font-medium shadow-lg shadow-indigo-500/25 border border-white/20 backdrop-blur-md"
                          >
                            <Sparkles className="w-5 h-5" />
                            Add to memory
                        </motion.button>

                    </div>
                </div>
                
                
                {/* Card */}
                <div className="flex-1 overflow-y-auto">
                    {
                        contentHook.loading
                        ? (<div className="flex justify-center items-center min-h-[80vh]">
                                <div className="spinner w-8 h-8 "></div>
                            </div>) 
                        : contentHook.content.length !== 0   // here some thing problem while clicking on refresh
                            ? <div className="p-5 columns-1 md:columns-2 lg:columns-3 gap-4 space-y-4">
                                {
                                    contentHook.content.map(({title, type, link, createdAt, _id}, index)=>{
                                        return <Card contentHook={contentHook}
                                            title={title} createdAt={createdAt}
                                            type={type} id={_id}
                                            link={link} 
                                            key={index}
                                        />
                                    })
                                }
                            </div>
                            : <div className="flex flex-col justify-center items-center min-h-[80vh] gap-4">
                                <p className="text-gray-400">No content found</p>

                                <div
                                    onClick={()=>contentHook.getContentApi()}
                                    className="py-2 px-4 flex items-center gap-2 cursor-pointer border-2 border-white bg-blue-400 hover:bg-violet-500 transition rounded-xl"
                                >
                                    <RefreshCcw size={16}/> Refresh
                                </div>
                            </div>  
                    } 
                </div>
            </div>
            
        </div>
        </>
    )
}