"use client"


import { useEffect, useRef, useState, type ChangeEvent } from "react";
import { GiNightSleep } from "react-icons/gi";
import { WiDaySunny } from "react-icons/wi";
import { History, Loader, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { useHook } from "../../../../hook/useHook";
import { Card } from "../../../../components/Brain/Card";
import { useContent } from "../../../../hook/GetContent";
import { useStore } from "../../../../Storage/useStore";
import { Image } from "../../../../Icons/icon";
import { BrainNavbar } from "../../../../components/Brain/BrainNavbar";
import { Button } from "@repo/ui/button";
import { CreateContent } from "../../../../components/Brain/CreateContent";
import api from "../../../../API/Interceptor";
import { toast } from "sonner";
import { ContentFormat, useBrainStore } from "../../../../Storage/useBrainStore";









export default function Brain(){
    const { theme, setTheme } = useStore();
    const {open, setOpen, loading, setLoading} = useHook();
    const findRef = useRef<HTMLInputElement>(null);
    const [val, setVal] = useState<string>("");
    const setContent = useBrainStore((state)=>state.setContent);
    const content = useBrainStore((state)=>state.content);
    const clearMemory = useBrainStore((state)=>state.clearMemory);

    const [slctButton, setSlctButton] = useState("All");


    function changeHandler(e:ChangeEvent<HTMLInputElement>){
        setVal(e.target.value);
    }

    async function getContentApi(){
        try{
            setLoading(true);
            const response = await api.get("/allcontent");

            const allContent = response.data.allContent;
            const grouped : Record<string, ContentFormat[]> = {
                All : allContent,
                youtube: [],
                twitter: [],
                github: [],
                website: [],
                linkedin : []
            }

            allContent.forEach((item:ContentFormat) => {
                if(grouped[item.type]){
                    grouped[item.type]?.push(item);
                }
            });

            setContent(grouped);
        }
        catch(e:any){
            toast.error(e.response.data.message || "Couldn't able to fetch data");
        }finally{
            setLoading(false);
        }
    }
    useEffect(()=>{
        clearMemory();
        getContentApi();
        return ()=>{
            clearMemory();
        }
    }, [])


    useEffect(()=>{
        if(theme == "dark"){
            document.documentElement.classList.add("dark");
        }
        else{
            document.documentElement.classList.remove("dark");
        }
    }, [theme]);


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
        <CreateContent open={open} setOpen={setOpen} getContentApi={getContentApi}/>
        <div className="flex min-h-screen bg-white overflow-hidden dark:bg-[#020617]">
            {/* Sidebar */}

            <div className={`flex-1 max-w-full flex flex-col justify-center transition-all duration-300   overflow-y-auto overflow-x-hidden`}>
                {/* top */}
                <div className="bg-gray-900 border-b border-slate-600 sticky top-0 z-40 w-full flex items-center justify-between py-3 px-5  dark:bg-linear-to-bl from-black to-gray-800 drop-shadow-xl backdrop-blur-2xl ">
                    <div className="flex gap-5 items-center justify-center">
                        <div className="w-8 h-8">
                            <Image/>
                        </div>
                        <div className="text-2xl font-semibold dark:text-blue-500">Brain</div>
                    </div>

                    <BrainNavbar setSlctButton={setSlctButton} slctButton={slctButton}/>
                    
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
                {
                    loading 
                    ?   <div className="flex justify-center items-center w-full h-full">
                            <Loader size={30} className="animate-spin text-white"/>
                        </div>
                    :
                    content[slctButton]?.length === 0
                        ? <div className="flex  w-full h-full justify-center items-center ">
                            <div className="flex flex-col justify-center items-center min-h-[80vh] gap-4">
                                <p className="text-gray-400">No content found</p>
                                <Button
                                type="button"
                                icon={<History size={20}/>}
                                iconFirst={true}
                                design="outline"
                                text="Refresh"
                                className="px-4 py-2 flex items-center font-semibold gap-3 shadow-[0_0_40px_rgba(99,102,241,0.65)]"
                                onClick={getContentApi}
                                />
                            </div> 
                        </div>
                    :
                    <div className="flex-1 overflow-y-auto p-5 columns-1 md:columns-2 lg:columns-3 gap-4 space-y-4">
                    {
                        content[slctButton]?.map((val)=>{
                            return(
                                <Card
                                    key={val.id}
                                    tags={val.tags}
                                    title={val.title}
                                    link={val.link}
                                    createdAt={val.createdAt}
                                    id={val.id}
                                    userId={val.userId}
                                    type={val.type}
                                    
                                />
                            )
                        })
                    }
                </div>
                }
                
            </div>
            
        </div>
        </>
    )
}