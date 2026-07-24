"use client"

import { Brain, PencilRuler, MessagesSquare } from "lucide-react";
import { CircleIcon } from "../Icons/icon";

export function FeatureCard({
  title,
  description,
  icon
}: {
  title: string;
  description: string;
  icon:string;
}) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl transition hover:-translate-y-1 hover:bg-white/10">
      <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500/20 to-cyan-500/20">
        {icon === "canvas" && <PencilRuler/>}
        {icon === "chat" && <MessagesSquare/>}
        {icon === "brain" && <Brain/>}
        {icon === "ai" && <CircleIcon className="h-6 w-6"/>}
      </div>

      <h3 className="text-xl font-semibold">{title}</h3>

      <p className="mt-3 leading-relaxed text-zinc-400">{description}</p>
    </div>
  );
}