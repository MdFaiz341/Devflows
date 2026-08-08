
import { Globe, Loader } from "lucide-react";
import { FaYoutube } from "react-icons/fa";
import { RiTwitterXFill } from "react-icons/ri";
import { ContentType } from "./Card";
import { LuLinkedin } from "react-icons/lu";
import { FaGithub } from "react-icons/fa";



export const ContentIcon = ({ type }: { type: ContentType })=> {
  if (type === "youtube") {
    return (
      <div
        className=" flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red-500/10 text-red-500">
        <FaYoutube size={20} />
      </div>
    );
  }

  if (type === "twitter") {
    return (
      <div
        className=" flex h-10 w-10 shrink-0 items-center justify-center rounded-xl  bg-white/10 text-white">
        <RiTwitterXFill size={19} />
      </div>
    );
  }

  if (type === "github") {
    return (
      <div
        className=" flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/10 text-white">
        <FaGithub size={20} />
      </div>
    );
  }

  if (type === "linkedin") {
    return (
      <div
        className=" flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/10 text-white">
        <LuLinkedin size={20} />
      </div>
    );
  }

  return (
    <div
      className=" flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-400">
      <Globe size={20} />
    </div>
  );
}