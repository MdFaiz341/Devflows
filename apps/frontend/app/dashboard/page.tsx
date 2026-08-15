"use client";

import { Button } from "@repo/ui/button";
import { Menu, Brain, PencilRulerIcon, MessagesSquareIcon,
        Users, Search, Sparkles, Bell, Clock4, LayoutGrid,
        Settings,
        Loader2,
        TextAlignJustify} from "lucide-react";
// import { SidebarButton } from "../../components/DashboardSidebar";
import { useHook } from "../../hook/useHook";
import { useStore } from "../../Storage/useStore";
import api from "../../API/Interceptor";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { DropdownProfile } from "../../components/ProfileDown";
import { useEffect, useState } from "react";
import "dotenv/config"
import { useChatStore } from "../../Storage/useChatStore";
import { chatHistory, joinUser } from "../../lib/socket/socket-emit";
import { useSocket } from "../../providers/SocketProvider";
import { eventHandler } from "../../lib/socket/socket-events";
import { Dashboard_Sidebar } from "@repo/ui/Dashboard_Sidebar"
import { Minisize_Sidebar } from "../../components/Minisize_Sidebar";
import { NotificationUI } from "../../components/ChatsUI/NotificationUI";


const sidebarItems = [
  {
    icon: LayoutGrid,
    label: "Dashboard",
    active:true,
  },
  {
    icon: PencilRulerIcon,
    label: "Canvas Rooms",
    active:false,
  },
  {
    icon: MessagesSquareIcon,
    label: "Chat Rooms",
    active:false,
  },
  {
    icon: Brain,
    label: "Second Brain",
    active:false,
  },
  {
    icon: Settings,
    label: "Settings",
    active:false,
  },
];


const activityFeed = [
  {
    id: "activity-1",
    text: "Aman joined Canvas Room",
  },
  {
    id: "activity-2",
    text: "Voice room recording uploaded",
  },
  {
    id: "activity-3",
    text: "AI summary generated",
  },
  {
    id: "activity-4",
    text: "New roadmap note synced",
  },
];

export default function DashboardPage() {

  const user = useStore((state)=>state.user);
  const {open, setOpen} = useHook();
  const unreadMessage = useChatStore((state)=>state.unreadMessage);
  const conversationIds = useChatStore((state)=>state.sideConversationOrder);
  // const {socket} = useSocket();
  const [openNotification,  setOpenNotification] = useState(false);
  const [active, setActive] = useState(false);


  const totalMessage = conversationIds.reduce((sum, ids)=> sum + (unreadMessage[ids] ?? 0), 0)

  const stats = [
    {
      title: "Active Canvas",
      value: "24",
      icon: PencilRulerIcon,
    },
    {
      title: "Live Chat Rooms",
      value: `${conversationIds.length}`,
      icon: MessagesSquareIcon,
    },
    {
      title: "Brain Memories",
      value: "1.8K",
      icon: Brain,
    },
    {
      title: "Realtime Users",
      value: "98",
      icon: Users,
    },
  ];


  return (
    <>  
      <div className="min-h-screen overflow-x-hidden bg-black text-white">
        <div className="fixed inset-0 -z-10 bg-[radial-gradient(circle_at_top,rgba(120,119,198,0.12),transparent_35%)]" />

        <div className="fixed inset-0 -z-10 opacity-10">
          <div className="h-full w-full bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:60px_60px]" />
        </div>

        <div className="relative flex">
          {/* <aside className="fixed left-0 top-0 z-50 hidden h-screen w-[290px] shrink-0 border-r border-white/10 bg-white/[0.02] backdrop-blur-xl lg:block">
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
          </aside> */}
          <div className="md:block hidden top-0">
            <Dashboard_Sidebar/>
          </div>

          <main className="w-full md:ml-[280px] flex-1 px-5 py-6 sm:px-6 lg:px-10">
            <div className="fixed top-1 left-0 md:left-[291px] py-2 right-5 z-50 border-b border-white/10 bg-black/40 backdrop-blur-lg shadow-xl flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
              <div className="flex justify-between items-center">
                <h2 className="lg:text-4xl pl-3 font-black tracking-tight text-4xl md:text-lg">
                  Welcome back 👋
                </h2>

                {/* mobile_UI */}
                <Button type="button" onClick={()=>setActive(!active)} className={`block md:hidden float-end`} icon={<TextAlignJustify/>}/>
                <Minisize_Sidebar active={active} setActive={setActive}/>
              </div>

              <div className="flex gap-4 flex-row sm:items-center justify-between">
                <label className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-4 text-zinc-400 backdrop-blur-xl">
                  <Search className="h-5 w-5 shrink-0" />

                  <input
                    type="text"
                    aria-label="Search dashboard"
                    placeholder="Search rooms, notes, chats..."
                    className="w-full bg-transparent outline-none placeholder:text-zinc-500"
                  />
                </label>

                <button
                  type="button"
                  onClick={()=>setOpenNotification(!openNotification)}
                  aria-label="Notifications"
                  className="hidden md:block relative rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-zinc-400 transition-colors duration-300 hover:bg-white/[0.10] hover:text-white"
                >
                  <Bell className="h-5 w-5" />

                  {
                    totalMessage > 0 
                    && <span className="flex animate-bounce justify-center items-center absolute right-2 top-2 w-5 h-5 p-2 rounded-full bg-orange-500 text-white font-semibold text-xs">{totalMessage}</span>
                  }
                  
                </button>

                <NotificationUI openNotification={openNotification}/>

                <img onClick={()=>setOpen(!open)} src={user?.image}  
                  className="w-10 h-10 rounded-full cursor-pointer shadow-xl border-2 border-white hidden md:block hover:scale-105 transition"
                />
                {
                  open 
                  &&  <DropdownProfile setOpen={setOpen}/>
                }
                  
                
                {/* mobile_UI */}
                {/* <Button type="button" className={`block md:hidden float-end`} icon={<TextAlignJustify/>}/> */}
                {/* <Minisize_Sidebar active={active} setActive={setActive}/> */}

              </div>
              
            </div>

            <div className="mt-28 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
              {stats.map((stat) => (
                <StatCard
                  key={stat.title}
                  title={stat.title}
                  value={stat.value}
                  icon={stat.icon}
                />
              ))}
            </div>

            <div className="mt-10 grid gap-6 xl:grid-cols-[1.5fr_1fr]">
              <div className="space-y-6">
                <div className="overflow-hidden rounded-[30px] border border-white/10 bg-white/[0.03] p-7 backdrop-blur-xl">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <h3 className="text-2xl font-bold">
                        Recent Activity
                      </h3>
                      <p className="mt-2 text-zinc-500">
                        Live events.
                      </p>
                    </div>

                    <Clock4 className="h-6 w-6 shrink-0 text-zinc-400" />
                  </div>

                  <div className="mt-8 space-y-5">
                    {activityFeed.map((activity) => (
                      <div
                        key={activity.id}
                        className="flex items-start gap-4"
                      >
                        <div className="mt-2 h-2 w-2 shrink-0 rounded-full bg-orange-400" />

                        <p className="text-zinc-300">
                          {activity.text}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="overflow-hidden rounded-[30px] border border-orange-400/20 bg-gradient-to-br from-orange-500/10 via-pink-500/10 to-purple-500/10 p-7 backdrop-blur-xl">
                  <div className="flex items-center gap-4">
                    <div className="rounded-2xl bg-white/10 p-4">
                      <Sparkles className="h-7 w-7 text-yellow-300" />
                    </div>

                    <div>
                      <h3 className="text-2xl font-bold">
                        AI Workspace Assistant
                      </h3>
                      <p className="mt-1 text-zinc-400">
                        Summaries, brainstorming and semantic recall.
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    className="mt-8 w-full rounded-2xl bg-white py-4 font-semibold text-black transition-transform duration-300 hover:scale-[1.02]"
                  >
                    Open Assistant
                  </button>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </>
  );
}










function StatCard({
  title,
  value,
  icon: Icon,
}: {
  title: string;
  value: string;
  icon: React.ElementType;
}) {
  return (
    <div className="group overflow-hidden rounded-[30px] border border-white/10 bg-white/[0.03] p-6 backdrop-blur-xl transition-all duration-500 hover:-translate-y-1 hover:border-white/20 will-change-transform">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm text-zinc-500">{title}</p>
          <h3 className="mt-4 text-2xl font-black tracking-tight sm:text-3xl">
            {value}
          </h3>
        </div>

        <div className="rounded-2xl bg-gradient-to-br from-orange-400/20 via-pink-500/20 to-purple-500/20 p-4 text-orange-300">
          <Icon className="h-7 w-7" />
        </div>
      </div>
    </div>
  );
}