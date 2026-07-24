"use client"

import { Button } from "@repo/ui/button";

export const BannerCard = ()=>{
    return(
        <section className="px-6 pb-28">
          <div className="mx-auto max-w-7xl overflow-hidden rounded-[40px] border border-violet-500/20 bg-gradient-to-r from-violet-500/20 via-blue-500/20 to-cyan-500/20 p-12 backdrop-blur-xl">
            <div className="max-w-3xl">
              <h2 className="text-4xl font-black md:text-6xl">
                Build your collaborative workspace today.
              </h2>

              <p className="mt-6 text-lg leading-relaxed text-zinc-300">
                Create realtime rooms, brainstorm visually, store knowledge and work together with your team.
              </p>

              <div className="mt-10 flex flex-wrap gap-4">
                <Button type="button" design="plane" text="Start Free" className="px-5 py-3"/>
                 <Button
                    type="button"
                    design="outline"
                    className=" px-5 py-3"
                    text="Book Demo"
                  />
              </div>
            </div>
          </div>
        </section>
    )
}