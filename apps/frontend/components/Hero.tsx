"use client"

import { Button } from "@repo/ui/button";
import { CircleIcon, Icon, floatingTransition} from "../Icons/icon"
import { m } from "framer-motion";
import { Brain, PencilRuler, MessagesSquare } from "lucide-react";


export const Hero = ()=>{
    return(
        <section className="relative px-6 pb-24 pt-44">
            <div className="mx-auto grid max-w-7xl items-center gap-20 lg:grid-cols-2">
            <div>
                <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-violet-500/30 bg-violet-500/10 px-4 py-2 text-violet-300">
                    <CircleIcon className="h-4 w-4" />
                    Collaborative AI Workspace
                </div>

                <h1 className="text-5xl font-black leading-[1.05] tracking-tight md:text-7xl">
                Build.
                {/* <br /> */}
                Draw.
                <br />
                <span className="bg-gradient-to-r from-violet-400 via-blue-400 to-cyan-300 bg-clip-text text-transparent">
                    Think Together.
                </span>
                </h1> 

                <p className="mt-8 max-w-xl text-lg leading-relaxed text-zinc-400">
                    DevFlows combines collaborative canvas, realtime chat, and a
                    powerful second brain into one futuristic workspace for creators,
                    developers and teams.
                </p>

                <div className="mt-10 flex flex-wrap gap-4">
                    <Button type="button" design="designedPrimary" text="Start Building" 
                        icon={<Icon className="h-[18px] w-[18px] transition group-hover:translate-x-1"/>} 
                        className="group gap-3 rounded-2xl px-7 py-4 font-semibold shadow-[0_0_60px_rgba(99,102,241,0.45)]"
                    />
                    <Button type="button" design="outline" text="Live Demo" 
                        className="flex items-center gap-3 rounded-2xl px-7 py-4"
                        icon={<CircleIcon className="h-[18px] w-[18px]"/>} iconFirst={true}
                    />
                </div>
            </div>

            <m.div
                className="relative "
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.7 }}
            >
                <div className="absolute -inset-10 bg-gradient-to-r from-violet-500/20 via-blue-500/20 to-cyan-400/20 blur-3xl" />

                <div className="relative overflow-hidden rounded-[32px] border border-white/10 bg-white/5 shadow-[0_0_100px_rgba(99,102,241,0.18)] backdrop-blur-2xl">
                <div className="flex h-16 items-center justify-between border-b border-white/10 px-6">
                    <div className="flex items-center gap-3">
                    <div className="h-3 w-3 rounded-full bg-red-400" />
                    <div className="h-3 w-3 rounded-full bg-yellow-400" />
                    <div className="h-3 w-3 rounded-full bg-green-400" />
                    </div>

                    <div className="rounded-full border border-violet-500/30 bg-violet-500/20 px-4 py-1.5 text-xs text-violet-300">
                    Live Collaboration
                    </div>
                </div>

                <div className="flex">
                    <div className="relative flex flex-wrap gap-6 overflow-hidden bg-[#0d0d12] p-6 lg:justify-center">
                    <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[size:32px_32px]" />

                    <m.div
                        animate={{ y: [-8, 8] }}
                        transition={floatingTransition}
                        className="relative z-10 w-full max-w-[320px] rounded-3xl border border-violet-500/20 bg-violet-500/10 p-5 backdrop-blur-xl"
                    >
                        <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-violet-500/20">
                            <Brain className="h-5 w-5 text-violet-300"/>
                        </div>

                        <div>
                            <h4 className="font-semibold">Second Brain</h4>

                            <p className="text-xs text-zinc-400">
                            Save tweets, docs and videos
                            </p>
                        </div>
                        </div>
                    </m.div>

                    <m.div
                        animate={{ y: [10, -10] }}
                        transition={{ ...floatingTransition, duration: 6 }}
                        className="relative z-10 w-full max-w-[360px] self-center rounded-3xl border border-cyan-500/20 bg-cyan-500/10 p-5 backdrop-blur-xl"
                    >
                        <div className="flex items-center justify-between">
                        <h4 className="font-semibold">
                            Collaborative Canvas
                        </h4>

                        <PencilRuler className="h-[18px] w-[18px] text-cyan-300" />
                        </div>

                        <div className="relative mt-6 h-36 overflow-hidden rounded-2xl border border-white/5 bg-black/30">
                        <m.div
                            animate={{ x: [0, 40, 0] }}
                            transition={{ duration: 4, repeat: Infinity }}
                            className="absolute left-10 top-10 h-20 w-28 rounded-xl border-2 border-cyan-400"
                        />
                        </div>
                    </m.div>

                    <m.div
                        animate={{ x: [-6, 6] }}
                        transition={{ ...floatingTransition, duration: 5 }}
                        className="relative z-10 w-full max-w-[320px] self-end rounded-3xl border border-pink-500/20 bg-pink-500/10 p-5 backdrop-blur-xl"
                    >
                        <div className="flex items-center justify-between">
                        <h4 className="font-semibold">Realtime Chat</h4>

                        <MessagesSquare className="h-[18px] w-[18px] text-pink-300"/>
                        </div>

                        <div className="mt-5 space-y-3">
                        <div className="rounded-xl bg-white/5 p-3 text-sm text-zinc-300">
                            Design looks insane 🔥
                        </div>

                        <div className="ml-8 rounded-xl bg-pink-500/20 p-3 text-sm">
                            Ship it today 🚀
                        </div>
                        </div>
                    </m.div>
                    </div>
                </div>
                </div>
            </m.div>
            </div>
        </section>
    )
}