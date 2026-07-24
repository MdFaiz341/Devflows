"use client"

import { useEffect, useState } from "react"
import { GridIcon, Icon } from "../Icons/icon"
import { Button } from "@repo/ui/button";
import { useRouter } from "next/navigation";
import api from "../API/Interceptor";
import { useStore } from "../Storage/useStore";
import { toast } from "sonner";


export const Navbar = ()=>{
    const [scrolled, setScrolled] = useState(false);
    const user = useStore((state)=>state.user);
    const router = useRouter();


    useEffect(()=>{
        const scrollHandler = ()=>{
            setScrolled(window.scrollY > 40)
        }

        window.addEventListener("scroll", scrollHandler);

        return ()=>{
            window.removeEventListener("scroll", scrollHandler);
        }
    }, [])

    return(
        <header className="fixed top-1 right-0 left-0 z-50 border-b border-white/10 bg-black/40 backdrop-blur-lg shadow-xl">
            <div className={`
                    ${scrolled ? "px-20" : "px-6"} mx-auto flex h-16 max-w-7xl items-center justify-between transition-all duration-500`}>

                <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 via-blue-500 to-cyan-400 shadow-[0_0_40px_rgba(99,102,241,0.6)]">
                    <GridIcon className="h-5 w-5" />
                    </div>

                    <h1 className="text-2xl font-black tracking-tight">
                    Dev<span className="text-violet-400">Flows</span>
                    </h1>
                </div>

                <nav className="hidden items-center gap-8 text-sm text-zinc-300 lg:flex">
                    {
                        navMenu.map((val, index)=>{
                            return (
                                <a key={index} href={val.link} className="transition hover:text-white">
                                    {val.text}
                                </a>
                            )
                        })
                    }
                </nav>

                <div className="flex items-center gap-4">
                    <Button
                        type="button" 
                        onClick={()=>router.push("/dashboard")} 
                        design="outline" text="Login" 
                        className="hidden rounded-xl px-5 py-2.5 md:flex"/>

                    <Button 
                        type="button"
                        onClick={()=>router.push("/dashboard")} 
                        design="designedPrimary" text="Get Started" 
                        className="gap-2 rounded-xl px-5 py-2.5 font-medium shadow-[0_0_40px_rgba(99,102,241,0.55)]"
                        icon={<Icon  className="h-4 w-4"/>}
                    />
                </div>
            </div>
        </header>
    )
}


const navMenu = [
    {
        link : "#features",
        text: "Features"
    },
    {
        link : "#workspace",
        text: "Workspace"
    },
    {
        link : "#brain",
        text: "Second Brain"
    },
    {
        link : "#price",
        text: "Price"
    }
];