
import {Brain, PencilRulerIcon, MessagesSquareIcon, LayoutGrid, Settings} from "lucide-react";

const sidebarItems = [
  {
    icon: <LayoutGrid/>,
    label: "Dashboard",
    active:true,
  },
  {
    icon: <PencilRulerIcon/>,
    label: "Canvas Rooms",
    active:false,
  },
  {
    icon: <MessagesSquareIcon/>,
    label: "Chat Rooms",
    active:false,
  },
  {
    icon: <Brain/>,
    label: "Second Brain",
    active:false,
  },
  {
    icon: <Settings/>,
    label: "Settings",
    active:false,
  },
];



export const Dashboard_Sidebar = ()=>{
    return(
        <aside className="fixed left-0 z-50 w-[290px] shrink-0 border-r border-white/10 bg-white/[0.02] backdrop-blur-xl">
            <div className="flex h-full flex-col px-6 py-8">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-400 via-pink-500 to-purple-500 text-xl font-black text-black shadow-[0_0_40px_rgba(255,120,80,0.45)]">
                      D
                  </div>

                  <div>
                      <h1 className="text-xl font-bold tracking-tight">
                      Devflow
                      </h1>
                      <p className="text-sm text-zinc-500">
                      collaborative workspace
                      </p>
                  </div>
                </div>

                <div className="mt-12 space-y-3">
                  {sidebarItems.map((item) => {
                      return (
                      <SidebarButton
                          key={item.label}
                          icon={item.icon}
                          label={item.label}
                          active={item.active}
                      />
                      )
                  })}
                </div>
            </div>
        </aside>
    )
}


import { useRouter } from "next/navigation";
import { Button } from "./button";


type RouteURL = Record<string, string>

const subUrl : RouteURL = {
    "Canvas Rooms" : "canvas",
    "Dashboard" : "/",
    "Chat Rooms" : "chat-room",
    "Second Brain" : "brain",
    "Settings" : "profile",
}


export function SidebarButton({
  icon,
  label,
  active,
}: {
  icon: React.ReactNode;
  label: string;
  active: boolean;
}) {

    const router = useRouter();

    function clickHandler(url:string){
        router.push(`dashboard/${subUrl[url]}`);
    }

  return (
    <Button
        design="dash_sidebar"
        type="button"
        text={label}
        onClick={()=>clickHandler(label)}
        className={`${active 
                    ? "bg-gradient-to-r from-orange-500/40 to-pink-500/20 text-white shadow-[0_0_30px_rgba(255,120,80,0.15)]"
                    : "text-zinc-400 hover:bg-white/[0.08] hover:text-white"
                } font-medium`}
        icon={icon}
        iconFirst={true}
    />
  );
}