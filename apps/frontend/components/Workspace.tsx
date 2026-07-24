"use client"

import { Brain, MessagesSquare } from "lucide-react"



export const Workspace = ()=>{

  

    return(
        <section id="workspace" className="px-6 py-28">
          <div className="mx-auto grid max-w-7xl items-center gap-16 lg:grid-cols-2">
            <div>
              <div className="mb-4 inline-flex rounded-full border border-cyan-500/30 bg-cyan-500/10 px-4 py-2 text-sm text-cyan-300">
                How it works
              </div>

              <h2 className="text-4xl font-black md:text-6xl">
                Draw, chat and think visually.
              </h2>

              <div className="mt-10 space-y-6">
                {[1, 2, 3].map((step) => (
                  <div
                    key={step}
                    className="flex gap-5 rounded-3xl border border-white/10 bg-white/5 p-6"
                  >
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 to-blue-500 text-lg font-bold">
                      {step}
                    </div>

                    <div>
                      <h3 className="text-xl font-semibold">
                        {step === 1 && "Create a workspace"}
                        {step === 2 && "Invite your team"}
                        {step === 3 && "Collaborate in realtime"}
                      </h3>

                      <p className="mt-2 leading-relaxed text-zinc-400">
                        Build collaborative rooms where teammates can brainstorm, save resources and communicate instantly.
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[32px] border border-white/10 bg-white/5 p-8 backdrop-blur-xl">
              <div className="grid gap-5">
                <div className="rounded-3xl border border-violet-500/20 bg-violet-500/10 p-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-semibold">Second Brain</h3>
                    <Brain/>
                  </div>

                  <div className="mt-5 space-y-3">
                    <div className="rounded-2xl bg-black/30 p-4 text-sm text-zinc-300">
                      Saved tweet about scaling websocket rooms.
                    </div>

                    <div className="rounded-2xl bg-black/30 p-4 text-sm text-zinc-300">
                      Youtube video: Building collaborative canvas.
                    </div>
                  </div>
                </div>

                <div className="rounded-3xl border border-pink-500/20 bg-pink-500/10 p-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-semibold">Team Chat</h3>
                    <MessagesSquare/>
                  </div>

                  <div className="mt-5 space-y-3">
                    <div className="rounded-2xl bg-white/5 p-4 text-sm text-zinc-300">
                      UI is looking premium now 🚀
                    </div>

                    <div className="ml-10 rounded-2xl bg-pink-500/20 p-4 text-sm text-white">
                      Ship the beta tonight 🔥
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
    )
}