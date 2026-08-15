"use client"

import { useEffect, useRef, useState } from "react";
import { deleteConversation, sendUserTyping, userSendMessage } from "../../lib/socket/socket-emit";
import { useChatStore } from "../../Storage/useChatStore"
import {  motion } from "framer-motion"
import { useStore } from "../../Storage/useStore";
import TypingDots from "./TypingDots";
import { GroupMembers } from "./GroupMembers";
import { useHook } from "../../hook/useHook";
import { InputField } from "@repo/ui/input";
import { FormatMessageTime } from "../../formatter/FormatTime";
import { Check, CheckCheck, Cross, Ellipsis, Loader2, Plus, PlusCircle, User, Users, X } from "lucide-react";
import CreateGroupModal from "./CreateGroupModal";
import { Button } from "@repo/ui/button";
import api from "../../API/Interceptor";
import { toast } from "sonner";
import { useSocket } from "../../providers/SocketProvider";
import { chatManager } from "../../lib/socket/ChatManager";







export const ChatArea = ()=>{
  
    const conversationId = useChatStore((state)=>state.selectedConversation);
    const setConversationId = useChatStore((state)=>state.setSelectedConversation);
    const user = useStore((state)=>state.user);
    const {open, setOpen, setActive, active, loading, setLoading} = useHook();

    const totalJoinedUser = useChatStore((state)=>state.joinedUser[conversationId || -1]);
    const inputMessageRef = useRef<HTMLInputElement | null>(null)
    const addInstantMessage = useChatStore((state)=>state.addInstantMessage);
    const storeMessages = useChatStore((state)=>state.messageByConversation[conversationId || -1]);
    const [show, setShow] = useState(false);
    const setSideConversationOrder = useChatStore((state)=>state.setSideConversationOrder)
    const sideConversationOrder = useChatStore((state)=>state.sideConversationOrder);
    const selectedChat = useChatStore((state)=>state.sidebarDefaultConversation[conversationId || -1]);



    const typing = useChatStore((state)=>state.typing[conversationId || -1])
    const typingIds = Object.keys(typing || {});
    const data = Object.entries(typing || {})

    const typingTimeOut = useRef<NodeJS.Timeout | null>(null);
    const bottomRef = useRef<HTMLDivElement | null>(null);

    useEffect(()=>{
       bottomRef.current?.scrollIntoView({
        behavior : storeMessages!.length > 0 ? "smooth" : "auto"
       })

    }, [storeMessages])

    function sendMessage(){

        try{
            const message = inputMessageRef.current?.value
            if(!message){
                return;
            }


            if(conversationId){  
                if(!user || !conversationId) return;

                const clientID  = crypto.randomUUID();
                addInstantMessage(
                  conversationId,
                  {
                    text : message,
                    sender : {
                        id : user?.id,
                        firstname : user?.firstname,
                    },
                    clientID,
                    createdAt : new Date().toISOString(),
                    conversationId
                  }
                )

                const payload = {
                    type : "new_message",
                    conversationId,     // selectedChat?.conversationId
                    text : message,
                    clientID,
                }
                chatManager.sendMessage(payload);
                // socket.send(payload);
                // send message
                // userSendMessage(socket, payload);
                if(inputMessageRef.current){
                  inputMessageRef.current.value = "";
                }
            }
        }
        catch(e){
            console.log(e);
        }
    }

    function userTypingInput(){
      const val = inputMessageRef.current?.value

      // if(!socket) return;

      if(conversationId){

        const payload = {
          type:"typing",
          conversationId,
        }
        chatManager.sendMessage(payload);
        // const type = "typing"
        // sendUserTyping(socket, type, payload);

        // remove previous Timeout
        if(typingTimeOut.current){
          clearTimeout(typingTimeOut.current)
        }
        
        typingTimeOut.current = setTimeout(() => {
          const payload = {
            type : "stop_typing",
            conversationId,
          }
          chatManager.sendMessage(payload);
          // const type = "stop_typing";
          // sendUserTyping(socket, type, payload);
        }, 2000);

      }
    }

    // UI se delet nahi hua conversation after leaving room and text show nahi hua other user ke chat me ki (faiz left)

    async function leaveConversatioHandler(){
      // if(!socket || socket.readyState !== WebSocket.OPEN) return;
      
      setLoading(true);
      const payload = {
        type : "delete_chat",
        conversationId, 
      }
      chatManager.sendMessage(payload);

      await new Promise((res)=>setTimeout(res, 2000));

      const filterIds = sideConversationOrder.filter((ids)=> ids !== conversationId) // selectedChat?.conversationId
      setSideConversationOrder(filterIds);

      setConversationId(null);

      toast.success("Successfully deleted")
      setActive(false);
      setLoading(false);

    }

    return(
        <main className="flex-1 flex flex-col bg-[#0B141A] relative">
        {
          !selectedChat ? (
            <div className="h-full flex flex-col items-center justify-center text-center px-6">
              {/* Icon */}
              <div className="w-32 h-32 rounded-full bg-white/5 flex items-center justify-center mb-8 shadow-2xl">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-16 h-16 text-white/60"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-4l-4 4v-4z"
                  />
                </svg>
              </div>

              {/* Heading */}
              <h1 className="text-4xl font-bold mb-4 tracking-tight">
                Welcome to Chat App
              </h1>

              {/* Description */}
              <p className="text-white/50 max-w-lg leading-relaxed text-lg">
                Select a conversation from the sidebar and start chatting
                with your friends and groups in real time.
              </p>

              {/* Bottom Text */}
              <div className="absolute bottom-10 text-sm text-white/30 flex items-center gap-2">
                🔒 End-to-end encrypted messaging
              </div>
          </div>
          ) : (
            <div className="flex-1 flex flex-col min-h-0 bg-[#0B141A] ">
              {/* Header */}
              <div className="h-16 px-6 border-b border-white/10 flex items-center justify-between bg-[#111B21] relative">
                <div className="flex items-center gap-4">
                  <div>
                    {
                        selectedChat.type === "DM" 
                        ? <div>
                              <img src={selectedChat.member[0].user.image} className="rounded-full w-10 h-10 font-semibold"/>
                          </div>
                        : <div><img src={selectedChat.image} className="rounded-full w-10 h-10 font-semibold"/></div>
                    }
                  </div>

                  <div>
                    {
                      selectedChat.type === "DM"
                      ? <div>
                          <p className="font-medium truncate">{selectedChat.member[0].user.firstname}</p>
                        </div>
                      : <p className="font-medium truncate">{selectedChat.name}</p>
                    }

                    {
                      totalJoinedUser 
                      &&  <div>
                          {
                            selectedChat.type === "DM"
                            ? <div>
                                {
                                  totalJoinedUser.activeUser > 1
                                  ? <p className="text-xs text-green-400">● online</p>
                                  : <p className="text-xs text-green-400">offline</p>
                                }  
                              </div>
                            : <p className="text-xs text-green-400">● {totalJoinedUser.activeUser} online</p>
                          }
                        </div>
                    }
                    
                  </div>
                </div>

                <div className="flex items-center gap-5 text-gray-400 text-lg">
                  <span 
                    onClick={()=>setActive(!active)}
                    className=" cursor-pointer bg-gray-700 px-1 rounded-xl">
                      <Ellipsis size={20}/>
                  </span>
                  
                  {
                    selectedChat.type === "Group" 
                      && <div className="flex gap-4 items-center relative">
                            {show && <span className="absolute text-xs -top-4 -left-6 text-orange-400 font-semibold">Add members</span>}
                            <div 
                              // onClick={addMembersHandler}
                              className="cursor-pointer w-5 h-5 flex justify-center items-center" onMouseEnter={()=>setShow(true)} onMouseLeave={()=>setShow(false)}>
                              <PlusCircle size={20}/>
                            </div>
                            <span onClick={()=>setOpen(!open)} className="bg-gray-800 cursor-pointer transition-all duration-200 rounded-2xl px-3 py-1 text-sm hover:bg-gray-700">members</span>
                        </div>
                  }
                  <span>📞</span>
                  <span>🎥</span>
                </div>

                {/* Group Members */}
                <GroupMembers selectedChat={selectedChat} open={open} setOpen={setOpen}/>
              </div>

              {/* Messages */}
              <div className="flex-1 min-h-0 overflow-y-auto px-6 py-6 space-y-4 bg-[#0B141A] bg-[url('https://www.transparenttextures.com/patterns/cartographer.png')]">
                {
                  !storeMessages
                  ? <div className="flex justify-center items-center w-full h-full"><Loader2 size={30} className="animate-spin"/></div>
                  : <div className="relative">
                      {
                        storeMessages.length === 0
                        ? <div className="flex justify-center items-center text-xl w-full h-full"><span className="text-green-300 mt-[10rem]">𝓢𝓽𝓪𝓻𝓽  𝓬𝓱𝓪𝓽  𝔀𝓲𝓽𝓱  𝓗𝓮𝓵𝓵𝓸 <span className="animate-pulse">👋</span></span></div>
                        : <>
                            {storeMessages?.map((msg) => (
                              <motion.div
                                key={msg.id || msg.clientID}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                

                                className={`flex ${msg.text.includes("joined") || msg.text.includes("left") ? "text-center w-full flex justify-center" : `${msg.sender.id == user?.id ? "justify-end" : "justify-start"}`} mb-4`}
                              >
                                <div
                                  className={`max-w-[60%] px-4 py-1 rounded-2xl text-sm shadow-lg ${
                                    msg.sender.id === user?.id
                                      ? `${!msg.text.includes("left") && !msg.text.includes("joined") && "bg-[#005C4B] rounded-br-sm"}`
                                      : `${!msg.text.includes("left") && !msg.text.includes("joined") && "bg-[#202C33] rounded-bl-sm"}`
                                  }`}
                                >
                                    {!msg.text.includes("left") && !msg.text.includes("joined") && msg.sender.id !== user?.id && selectedChat.type === "Group" && (
                                      <p className="text-[10px] text-indigo-400">{msg.sender.firstname}</p>
                                    )}

                                    {
                                      msg.text.includes("left") || msg.text.includes("joined")
                                      ? <div>
                                          {
                                            !(msg.sender.id === user?.id )
                                            && <div className="text-green-500 bg-gray-700 px-3 py-1 rounded-xl">
                                                {msg.text}
                                              </div>
                                          }
                                          
                                      </div>
                                      : <div>{msg.text}</div>
                                    }
                                    
                                    {
                                      !msg.text.includes("left") && !msg.text.includes("joined")
                                      &&  <div className="flex gap-2 items-center justify-end">
                                            <span className="text-[10px] flex justify-end text-gray-400">{FormatMessageTime(msg.createdAt)}</span>
                                            {
                                              msg.sender.id === user?.id && (
                                                msg.sending ? <Check size={10}/> : <CheckCheck size={10}/>
                                              )
                                            }
                                        </div>
                                    }
                                    
                                </div>

                                {/* scroll to last message */}
                                <div ref={bottomRef}></div>
                              </motion.div>
                            ))}
                        </>
                      }
                  </div>
                }
                
              </div>

              <span className="absolute bottom-24 left-6">
                {
                  typingIds.length > 0 && <TypingDots/>
                }
              </span>

              {/* Leave Conversation */}
              {
                active 
                && <div className="absolute flex justify-center items-center h-full w-full backdrop-blur-sm">
                      <div className="bg-gray-950 rounded-2xl p-4 border-b w-[350px]">
                        <div className="text-xl font-semibold">Exit : {selectedChat.name}</div>
                        <div className="text-sm text-gray-300">Are you sure to leave conversation?</div>
                        <div className="mt-8 flex items-center justify-between">
                          <Button
                            type="button"
                            text="Cancle"
                            design="outline"
                            onClick={()=>setActive(false)}
                            className="px-4 py-2 flex items-center gap-2"
                            icon={<X size={20}/>}
                            iconFirst={true}
                          />
                          <Button
                            type="button"
                            design="redbtn"
                            text={`${loading ? "Leaving..." : "Leave and delete"}`}
                            className="py-2 px-4 flex items-center gap-2"
                            onClick={leaveConversatioHandler}
                            icon={loading && <Loader2 size={18} className="animate-spin"/>}
                            iconFirst={true}
                          />
                        </div>
                      </div>
                </div>
              }

              {/* Input */}
              <div className="p-4 bg-[#111B21] border-t border-white/10 flex items-center gap-4 bottom-0 w-full">
                <button className="text-2xl text-gray-400">+</button>

                <input
                  ref={inputMessageRef}
                  onChange={userTypingInput}
                  onKeyDown={(e)=>{
                    if(e.key === "Enter"){
                      sendMessage()
                    }
                  }}
                  placeholder="Type a message"
                  className="flex-1 bg-[#202C33] rounded-full px-5 py-3 outline-none text-sm"
                />

                <button 
                  onClick={sendMessage}
                  className="w-12 h-12 rounded-full bg-indigo-600 hover:bg-indigo-500 transition flex items-center justify-center text-lg">
                  ➤
                </button>
              </div>

            </div>
          )
        }
      </main>
    )
}