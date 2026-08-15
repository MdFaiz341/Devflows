"use client"

import { LuYoutube } from "react-icons/lu";
import { FiTwitter } from "react-icons/fi";
import { GrNotes } from "react-icons/gr";
import { IoLinkOutline } from "react-icons/io5";


const cards = [
  {
    id: "tweet",
    icon: <FiTwitter/>,
    type: "Tweet",
    title: "@dhh on monoliths",
    description:
      "The majestic monolith is back. Here's why teams are shipping faster again.",
    tag: "#engineering",
  },
  {
    id: "video",
    icon: <LuYoutube/>,
    type: "Video",
    title: "Designing for trust",
    description:
      "A 12-min talk from Config 2025 on micro-interactions and premium UX.",
    tag: "#design",
  },
  {
    id: "link",
    icon: <IoLinkOutline/>,
    type: "Link",
    title: "The Pragmatic Engineer",
    description:
      "How Stripe ships infrastructure: rituals, reviews and rollout systems.",
    tag: "#reading",
  },
  {
    id: "note",
    icon: <GrNotes/>,
    type: "Note",
    title: "Q3 roadmap",
    description:
      "Ship canvas v2, voice rooms beta, mobile offline mode.",
    tag: "#private",
  },
];

const features = [
  "AI summaries on every save",
  "Semantic search across all formats",
  "One-click recall inside the canvas",
];

export default function SecondBrainCard() {
  return (
    <section id="brain" className="relative overflow-hidden bg-black py-24 text-white">
      <div className="absolute inset-0 opacity-20">
        <div className="h-full w-full bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:70px_70px]" />
      </div>

      <div className="absolute left-1/2 top-1/2 h-[420px] w-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-purple-500/10 blur-3xl" />

      <div className="relative z-10 mx-auto grid max-w-7xl gap-16 px-6 lg:grid-cols-2 lg:items-center">
        <div>
          <p className="mb-6 bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-sm font-bold uppercase tracking-[0.05em] text-transparent">
            Second Brain
          </p>

          <h2 className="max-w-xl text-xl font-black leading-[0.95] tracking-tight sm:text-3xl md:text-5xl">
            Save anything.
            <br />
            Find it instantly.
          </h2>

          <p className="mt-8 max-w-2xl text-lg leading-relaxed text-zinc-400 sm:text-sm md:text-lg">
            Drop a tweet, a YouTube video, an article or a quick note.
            Devflow automatically tags, summarizes and embeds everything so your future self can find it in seconds.
          </p>

          <div className="mt-14 space-y-4">
            {features.map((item) => (
              <div
                key={item}
                className="flex items-center gap-4 text-lg text-zinc-400 sm:text-base"
              >
                <div className="h-2 w-2 rounded-full bg-yellow-400 shadow-[0_0_20px_rgba(250,204,21,0.8)]" />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          {cards.map((card) => {

            return (
              <div
                key={card.id}
                className="group relative overflow-hidden rounded-[30px] border border-white/10 bg-[#050505] p-8 transition-all duration-500 hover:-translate-y-2 hover:border-white/20"
              >
                <div className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                  <div className="absolute inset-0 bg-gradient-to-b from-white/[0.04] to-transparent" />
                </div>

                <div className="relative z-10">
                  <div className="flex items-center gap-3 text-zinc-500">
                    {card.icon}
                    <span className="text-sm">{card.type}</span>
                  </div>

                  <h3 className="mt-4 text-xs font-bold leading-tight text-white sm:text-base">
                    {card.title}
                  </h3>

                  <p className="mt-4 text-[9px] leading-relaxed text-zinc-400 sm:text-xs">
                    {card.description}
                  </p>

                  <div className="mt-5 inline-flex rounded-full border border-white/10 bg-white/[0.02] px-4 py-2 text-xs text-zinc-400">
                    {card.tag}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
