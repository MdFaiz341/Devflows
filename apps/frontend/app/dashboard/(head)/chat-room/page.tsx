"use client";

import {useEffect, useRef, useState } from "react";
import { useHook } from "../../../../hook/useHook";
import { toast } from "sonner";
import api from "../../../../API/Interceptor";
import { Button } from "@repo/ui/button";
import { motion } from "framer-motion";
import { EllipsisVertical, History, Loader2, MessageCircleCheck, MessagesSquare, Plus } from "lucide-react";
import { FormatChatDate, FormatMessageTime } from "../../../../formatter/FormatTime";
import { useSocket } from "../../../../providers/SocketProvider";
import CreateGroupModal from "../../../../components/ChatsUI/CreateGroupModal";
import { CreateDmModal } from "../../../../components/ChatsUI/CreateDmModal";
import { chatHistory, joinUser } from "../../../../lib/socket/socket-emit";
import { useChatStore } from "../../../../Storage/useChatStore";
import { useStore } from "../../../../Storage/useStore";
import { ChatArea } from "../../../../components/ChatsUI/ChatArea";
import { SidebarConversations } from "../../../../components/ChatsUI/SidebarConversations";



export default function DevFlowChatUI() {
  const {active, setActive, loading, setLoading} = useHook();

  const [isChatAdd, setIsChatAdd] = useState(false);
  // const socket = useSocket();
  const [openGroupModal, setOpenGroupModal] = useState(false);
  const [addContact, setAddContact] = useState(false);
  const [groups, setGroups] = useState<number[]>([]);
  const [dms, setDms] = useState<number[]>([]);
  const [allChat, setAllChat] = useState<number[]>([]);
  const [unreads, setUnreads] = useState<number[]>([]);
  const [selectBtn, setSelectBtn] = useState("All")

  const conversationOrder = useChatStore((state)=>state.sideConversationOrder);
  const [conversationOrderIds, setConversationOrderIds] = useState<number[]>(conversationOrder);
  
  // const user = useStore((state)=>state.user);
  // const conversationIdRef = useRef<number | null>(null)
  // const [selectedChat, setSelectedChat] = useState<any | null>(null);
  // const setSelectedConversation = useChatStore((state)=>state.setSelectedConversation);
  // const conversationId = useChatStore((state)=>state.selectedConversation);

  // const setSidebarDefaultConversation = useChatStore((state)=>state.setSidebarDefaultConversation);
  // const setSideConversationOrder = useChatStore((state)=>state.setSideConversationOrder);
  const sidebarDefaultConversation = useChatStore((state)=>state.sidebarDefaultConversation);
  // const messageByConversation = useChatStore((state)=>state.messageByConversation);
  const unreadMessage = useChatStore((state)=>state.unreadMessage);
  // const clearCount = useChatStore((state)=>state.clearCount);
  const socketListnerRef = useRef(false);

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

    console.log("unreadIds: ", unreadIds);
    setUnreads(unreadIds);

    console.log("dms: ", dmIds);
    setGroups(groupIds);
    setDms(dmIds);
    setAllChat(allIds);
    setConversationOrderIds(conversationOrder)

    // const groups = conversation.filter((c:any) => c.type === "Group");
    // const dms = conversation.filter((c:any) => c.type === "DM");
    // setDms(dms);
    // setGroups(groups);

    // const val = conversation.map((v:any)=> v.id)
    // setSideConversationOrder(val);

    // conversation.forEach((v:any)=> {
    //   const friendDetails = v.members.find((users:any) => users.userId !== user?.id);
    //   const data = {
    //     conversationId : v.id,
    //     createdAt : v.createdAt,
    //     image : v.image || null,
    //     member : {
    //       senderId : friendDetails.userId,
    //       firstname : friendDetails.user.firstname,
    //       image : friendDetails.user.image,
    //     },
    //     lastMessage : v.messages[0].text,
    //     type : v.type,
    //     name : v.name || null,
    //     updatedAt : v.updatedAt,
    //   } 
    //   setSidebarDefaultConversation(v.id, data);
    // })

    // if(!socket || socket.readyState !== WebSocket.OPEN) return;
    // conversation.map((v:any)=>{
    //     // new join coversation
    //     const payload = {
    //       conversationId : v.id,    
    //     }
    //     joinUser(socket, payload)
    // })

    console.log("conversationOrder---", conversationOrder)

  }, [conversationOrder]);

  console.log("default sidebar: ", sidebarDefaultConversation);


  // useEffect(()=>{
  //   async function fetchDmsAnsGroupChat() {
  //     try{
  //       setLoading(true);
  //       const response = await api.get("/conversations");
  //       console.log("allchatsWithRoom: ", response.data.conversation);
  //       // setConversation(response.data.conversation);
        
  //       setAllChat(response.data.conversation);
  //     }
  //     catch(e:any){
  //       console.log(e);
  //       toast.error(e.response.data.message);
  //     } finally{
  //       setLoading(false);
  //     }
  //   }

  //   fetchDmsAnsGroupChat();
  // }, [isChatAdd]);


  // async function socketStartHandler(chat:any){
  //   console.log("socket:", socket);
  //   // if(!socket || socket.readyState !== WebSocket.OPEN) return;

  //   // leave previous room before joining new room
  //   if(conversationIdRef.current){
  //     const payload = {
  //       type : "leave_conversation",
  //       conversationId : conversationIdRef.current
  //     };
  //     socket.send(payload);
  //   }


  //   // leave conversation hata diya jisse server ke Map me socket / user present hai and broad cast
  //   // karta jayega sabhi ko whoever is just open WebSocket

  //   // bar bar join karane se and leave conversation bhi hata diya hai to map me may be double entry 
  //   // ban sakti hai socket/user ka, so when user click on chat-room on dashboard hit "join_conversation" for all
  //   // and friend send message it will appear on both the side


  //   console.log("Handler Chat--- ", chat);

  //   setSelectedConversation(chat.conversationId);

  //   const cached = messageByConversation[chat.conversationId];
  //   if(!cached){
  //     const payload = {
  //       type : "history",
  //       conversationId : chat.conversationId
  //     }
  //     socket.send(payload);
  //     // chatHistory(socket, payload)
  //   }

  //   // // new join coversation
  //   const payload = {    
  //     type : "joinLiveUser" ,                     // uper laga diya jaise conversation update hoga waise hi all room active(dms, group)
  //     conversationId : chat.conversationId,    
  //   }
  //   socket.send(payload);
  //   // joinUser(socket, payload)
  //   // socket.send(JSON.stringify({
  //   //     type : "joinLiveUser",
  //   //     ...payload
  //   // }))
    
  //   conversationIdRef.current = chat.conversationId;

  //   clearCount(chat.conversationId);

  //   setSelectedChat(chat);

  //   const removeUnreadCount = unreads.filter((id)=> id !== chat.conversationId);
  //   setUnreads(removeUnreadCount);
    
  //   // hit backend if unreadMessage not zero
  //   try{
  //     await api.put("/clearCount", {conversationId : chat.conversationId})
  //     console.log("count remove");
  //   }
  //   catch(e){
  //     console.log("error:", e);
  //   }
  // }

  // if(!socket){
  //   return(
  //     <div className="w-full flex justify-center items-center">
  //       <Loader2 size={30}/>
  //     </div>
  //   )
  // }

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
                        console.log("data: ", chat);
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


