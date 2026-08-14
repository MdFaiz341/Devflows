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