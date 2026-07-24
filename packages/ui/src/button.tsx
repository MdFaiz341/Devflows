"use client";

import { ReactNode } from "react";


interface ButtonType{
  design? : "redbtn" | "primary" | "outline" | "plane" | "planeOutline" | "designedPrimary" | "designOutline" | "footerIcon" | "dash_sidebar",
  text? : string,
  icon? : ReactNode,
  iconFirst? : boolean | false,
  className: string,
  onClick : ()=>void,
  type : "button" | "submit",
  disabled? : boolean
}

const desingDefault = "mt-10 w-full rounded-2xl py-4 text-sm font-bold transition-all duration-300"
const designPrimary = "bg-gradient-to-r from-orange-400 via-pink-500 to-purple-400 text-black hover:scale-[1.02]"
const designOutline = "border border-white/10 bg-black text-white hover:border-white/20 hover:bg-white/5"

const bigPrimary = "group gap-3 rounded-2xl px-7 py-4 font-semibold shadow-[0_0_60px_rgba(99,102,241,0.45)] "
const smallPrimary = "gap-2 rounded-xl px-5 py-2.5 font-medium shadow-[0_0_40px_rgba(99,102,241,0.55)]"

const outline = "hidden rounded-xl border border-white/10 bg-white/5 px-5 py-2.5 backdrop-blur-xl transition hover:border-white/20 md:flex"
                "flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-7 py-4 transition hover:bg-white/10"
const plane = "rounded-2xl px-7 py-4 font-semibold"
const footerIcon = "flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white/5 transition hover:bg-white/10"


type keysAndValues = Record<string, string>;

const Defaultstyles : keysAndValues = {
  plane : "bg-white rounded-2xl font-semibold text-black transition hover:opacity-90",
  designedPrimary: "flex items-center bg-gradient-to-r from-blue-500 to-pink-500 transition-all duration-300 hover:scale-105",
  outline : "rounded-2xl border border-zinc-800 font-medium text-zinc-300 transition hover:bg-zinc-900  hover:border-white/20",
  primary : "bg-gradient-to-r from-purple-500 to-blue-600 hover:scale-105 transition-all duration-300 ease-in-out text-white font-semibold",
  redbtn : "bg-red-500 hover:bg-red-600 text-white rounded-xl transition",
  dash_sidebar : "flex w-full items-center gap-4 rounded-2xl px-4 py-4 text-left transition-all duration-300 will-change-transform",
}
 

export const Button = ({ design, text, icon, className, iconFirst, onClick, type, disabled }: ButtonType) => {
  return (
    <button 
      type={type} 
      className={`${className} ${design && Defaultstyles[design]}`} onClick={onClick} disabled={disabled}
    >
      {iconFirst && icon}
      {text}
      {!iconFirst && icon}
    </button>
  );
};