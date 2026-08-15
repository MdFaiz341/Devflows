import { motion } from "framer-motion"
import { useChatStore } from "../../Storage/useChatStore";
import { useStore } from "../../Storage/useStore";
import { useRef, useState } from "react";
import { FormatMessageTime } from "../../formatter/FormatTime";
import api from "../../API/Interceptor";
import { useSocket } from "../../providers/SocketProvider";
import { socketManager } from "../../lib/socket/SocketManager";
import { chatManager } from "../../lib/socket/ChatManager";







export const SidebarConversations = ({chat, unreads, setUnreads}:{
    chat : any,
    setUnreads : (e: number[])=>void
    unreads : number[]
})=>{
    // const socket = useSocket();
    const user = useStore((state)=>state.user);
    const setSelectedConversation = useChatStore((state)=>state.setSelectedConversation);
    const conversationId = useChatStore((state)=>state.selectedConversation);
    const setConversationId = useChatStore((state)=>state.setSelectedConversation);
    const unreadMessage = useChatStore((state)=>state.unreadMessage);
    const messageByConversation = useChatStore((state)=>state.messageByConversation);
    const clearCount = useChatStore((state)=>state.clearCount);
    // const conversationIdRef = useRef<number | null>(conversationId)
    // const [prevId, setPrevId] = useState<number | null>(null);

    async function socketStartHandler(chat:any){
        // console.log("socket:", socket);
        // if(!socket || socket.readyState !== WebSocket.OPEN) return;

        // leave previous room before joining new room
        // console.log("conversationIdRef---", conversationIdRef.current);
        // console.log("PrevId---", prevId);
        // if(prevId){
        //     const payload = {
        //         type : "leave_conversation",
        //         conversationId : prevId
        //     };
        //     console.log("Leave conversation hit hua--", prevId);
        //     chatManager.sendMessage(payload);
        // }


        // leave conversation hata diya jisse server ke Map me socket / user present hai and broad cast
        // karta jayega sabhi ko whoever is just open WebSocket

        // bar bar join karane se and leave conversation bhi hata diya hai to map me may be double entry 
        // ban sakti hai socket/user ka, so when user click on chat-room on dashboard hit "join_conversation" for all
        // and friend send message it will appear on both the side


        console.log("Handler Chat--- ", chat);

        setSelectedConversation(chat.conversationId);

        const cached = messageByConversation[chat.conversationId];
        if(!cached){
        const payload = {
            type : "history",
            conversationId : chat.conversationId
        }
        chatManager.sendMessage(payload);
        // chatHistory(socket, payload)
        }

        // // new join coversation
        const payload = {    
        type : "joinLiveUser",                     // uper laga diya jaise conversation update hoga waise hi all room active(dms, group)
        conversationId : chat.conversationId,    
        }
        chatManager.sendMessage(payload);
        // joinUser(socket, payload)
        // socket.send(JSON.stringify({
        //     type : "joinLiveUser",
        //     ...payload
        // }))
        
        // conversationIdRef.current = chat.conversationId;
        // setPrevId(chat.conversationId);
        // console.log("SetP PrevId---");
        clearCount(chat.conversationId);

        // setSelectedChat(chat);
        setConversationId(chat.conversationId);

        const removeUnreadCount = unreads.filter((id)=> id !== chat.conversationId);
        setUnreads(removeUnreadCount);
        
        // hit backend if unreadMessage not zero
        try{
            await api.put("/clearCount", {conversationId : chat.conversationId})
            console.log("count remove");
        }
        catch(e){
            console.log("error:", e);
        }
    }



    return(
        <motion.div
            // when user send message conversation goes to top but not show details like image , name
            onClick={()=>socketStartHandler(chat)}
            className={`flex items-center gap-4 px-4 py-4 cursor-pointer border-b border-white/5 hover:bg-white/15 transition-all duration-200 ${
            conversationId === chat?.conversationId ? "bg-white/15" : ""
            }`}
        >
            <div>
                {
                chat?.type === "DM"
                    ? <div>
                        <img src={chat.member[0]?.user.image} className="rounded-full w-10 h-10 font-semibold"/>
                    </div>
                    : <div><img src={chat?.image} className="rounded-full w-10 h-10 font-semibold"/></div>
                }
            </div>

            <div className="flex-1 min-w-0">
                <div className="flex justify-between items-center">
                    {
                        chat?.type === "DM"
                        ? <div>
                            <p className="font-medium truncate">{chat.member[0].user.firstname}</p>
                        </div>
                        : <p className="font-medium truncate">{chat?.name}</p>
                    } 
                    <span className="text-xs text-gray-400">{FormatMessageTime(chat?.updatedAt!)}</span>
                </div>
                
                <div className="flex justify-between items-center">
                    {/* ADD Last message */}
                    <p className="text-sm text-gray-400 truncate w-[70%]">
                    {chat?.lastMessage}
                    </p>
                    {
                        unreadMessage[chat?.conversationId] > 0 
                        && <span className="w-5 h-5 bg-orange-600 text-white text-xs rounded-full flex items-center justify-center">{unreadMessage[chat?.conversationId]}</span>
                    }
                </div>
            </div>
        </motion.div>
    )
}