"use client";

import {useEffect, useRef, useState } from "react";
import { useHook } from "../../../../hook/useHook";
import { Button } from "@repo/ui/button";
import { EllipsisVertical, MessageCircleCheck, Plus } from "lucide-react";
import CreateGroupModal from "../../../../components/ChatsUI/CreateGroupModal";
import { CreateDmModal } from "../../../../components/ChatsUI/CreateDmModal";
import { useChatStore } from "../../../../Storage/useChatStore";
import { ChatArea } from "../../../../components/ChatsUI/ChatArea";
import { SidebarConversations } from "../../../../components/ChatsUI/SidebarConversations";



export default function DevFlowChatUI() {
  const {active, setActive} = useHook();

  const [openGroupModal, setOpenGroupModal] = useState(false);
  const [addContact, setAddContact] = useState(false);
  const [groups, setGroups] = useState<number[]>([]);
  const [dms, setDms] = useState<number[]>([]);
  const [allChat, setAllChat] = useState<number[]>([]);
  const [unreads, setUnreads] = useState<number[]>([]);
  const [selectBtn, setSelectBtn] = useState("All")

  const conversationOrder = useChatStore((state)=>state.sideConversationOrder);
  const [conversationOrderIds, setConversationOrderIds] = useState<number[]>(conversationOrder);
  
  const sidebarDefaultConversation = useChatStore((state)=>state.sidebarDefaultConversation);
  const unreadMessage = useChatStore((state)=>state.unreadMessage);

  const totalMessage = conversationOrder.reduce((sum, ids)=> sum + (unreadMessage[ids] ?? 0), 0)

  // filter group and dms
  useEffect(()=>{
    const allIds = conversationOrder;
    const groupIds = conversationOrder.filter(
      (id: number) =>
        sidebarDefaultConversation[id]?.type === "Group"
    );

    const dmIds = conversationOrder.filter(
      (id) => sidebarDefaultConversation[id]?.type === "DM"
    )
    const unreadIds = conversationOrder.filter(
      (id) => unreadMessage[id]! > 0
    )

    setUnreads(unreadIds);

    setGroups(groupIds);
    setDms(dmIds);
    setAllChat(allIds);
    setConversationOrderIds(conversationOrder)

  }, [conversationOrder]);




  return (
    <div className="h-screen bg-[#0B141A] text-white flex overflow-hidden">
      {/* Sidebar */}
      <aside className="w-[380px] bg-[#111B21] border-r border-white/10 flex flex-col relative">
          {/* Top */}
          <div className="h-16 px-4 flex items-center justify-between border-b border-white/10">
              <span className="text-xl font-bold">Chats</span>
  
              <div className="relative">
                <div onClick={()=>setActive(!active)} className="cursor-pointer rounded-full bg-gray-600 p-2"><EllipsisVertical size={18}/></div>
                {
                    active 
                    && <div className="absolute bg-gray-900 rounded-3xl py-2 right-4 w-[7rem] flex flex-col items-center justify-center gap-2">
                    <Button
                        text="Group"
                        type="button"
                        design="outline"
                        className="py-1 px-3 flex items-center justify-center gap-1"
                        onClick={()=>{setOpenGroupModal(true); setActive(false)}}
                        icon={<Plus size={16}/>}
                        iconFirst={true}
                        />
                    </div>
                }
              </div>
          </div>
  
          {/* Search */}
          <div className="p-2 border-b border-white/10">
              <input
              placeholder="Search chats"
              className="w-full bg-[#202C33] rounded-lg px-4 py-3 text-sm outline-none"
              />

              <div className="flex gap-5 pt-2">
                <button 
                    onClick={()=>{setSelectBtn("All"), setConversationOrderIds(allChat)}}
                    className={`py-1 px-3 rounded-2xl border border-zinc-800 font-medium text-zinc-300 transition hover:border-white/20 ${selectBtn === "All" ? "bg-gray-700" : "hover:bg-zinc-800"} `}>
                      All
                </button>
                <button 
                    onClick={()=>{setSelectBtn("Groups"), setConversationOrderIds(groups)}}
                    className={`py-1 px-3 rounded-2xl border border-zinc-800 font-medium text-zinc-300 transition hover:border-white/20 ${selectBtn === "Groups" ? "bg-gray-700" : "hover:bg-zinc-800"}`}>
                      Groups
                </button>
                <button 
                    onClick={()=>{setSelectBtn("UnreadCount"), setConversationOrderIds(unreads)}}
                    className={`py-1 px-3 rounded-2xl border border-zinc-800 font-medium text-zinc-300 transition hover:border-white/20 ${selectBtn === "UnreadCount" ? "bg-gray-700" : "hover:bg-zinc-800"}`}>
                      Unread <span className="text-sm">{totalMessage > 0 && totalMessage}</span>
                </button>
              </div>
          </div>
  
          {/* Chats */}
          <div className="flex-1 overflow-y-auto">
            {
              conversationOrderIds.length === 0 
              ? <div className="w-full h-full flex flex-1 items-center justify-center">
                  {
                    selectBtn === "UnreadCount"
                    ? <div>
                        <div className="flex flex-col gap-3 items-center">
                          <div><MessageCircleCheck size={50}/></div>
                          <div className="text-xl text-white">No unread chats</div>
                          <div className="text-sm text-gray-500">You're all caught up.</div>
                          <Button
                            type="button"
                            onClick={()=>{setConversationOrderIds(allChat), setSelectBtn("All")}}
                            text="View all chats"
                            design="outline"
                            className="text-green-500 px-3 py-2 mt-5"
                          />
                        </div>
                    </div> 
                    : <div className="w-screen h-screen flex justify-center items-center">
                        <p className="text-gray-400">No friends</p>
                    </div>
                  }
                </div>
              : <div>
                    {
                      conversationOrderIds.map((ids : any) => {
                        const chat = sidebarDefaultConversation[ids];
                        return(
                          <div key={chat?.conversationId || ids}>
                            <SidebarConversations chat={chat}
                              unreads={unreads} setUnreads={setUnreads}/>
                          </div>
                        )
                      })
                    }
                </div>
            }
          </div>
          <div 
              onClick={()=>{setAddContact(true)}}
              className="absolute bg-gradient-to-tr from-slate-400 to-green-500 rounded-full w-10 h-10 right-5 bottom-4 z-50 flex items-center justify-center cursor-pointer">
              <Plus size={18}/>
          </div>
      </aside>

      {/* Chat Area */}
      <ChatArea/>

      {/* Create Room Modal */}
      <CreateDmModal addContact={addContact} setAddContact={setAddContact}/>

      <CreateGroupModal openGroupModal={openGroupModal} setOpenGroupModalAction={setOpenGroupModal} 
          dms={dms}/>
    </div>
  );
}


