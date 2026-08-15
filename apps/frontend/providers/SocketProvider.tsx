"use client"

import { createContext, useContext, useEffect, useMemo, useRef, useState } from "react";
import { socketManager } from "../lib/socket/SocketManager";
import { useStore } from "../Storage/useStore";
import api from "../API/Interceptor";
import { useChatStore } from "../Storage/useChatStore";
import { chatHistory, joinUser } from "../lib/socket/socket-emit";
// import { socketEventListner } from "../lib/socket/socket-events";


interface SocketContextType{
    // socket : WebSocket | null;
    connect: () => void;
    disconnect: () => void;
    send: (payload: any) => void;
}

export const SocketContext = createContext<SocketContextType | null>(socketManager);


export const SocketProvider = ({children}:{children:React.ReactNode})=>{
    const user = useStore((state)=>state.user);

    const [socket, setSocket] = useState<WebSocket | null>(null);
    const socketRef = useRef<WebSocket | null>(null);

    const [conversation, setConversation] = useState([])
    const setBackendConversation = useChatStore((state)=>state.setBackendConversation);
    const setSideConversationOrder = useChatStore((state)=>state.setSideConversationOrder);
    const setSidebarDefaultConversation = useChatStore((state)=>state.setSidebarDefaultConversation);
    const setUnreadMessage = useChatStore((state)=>state.setUnreadMessage);

    // const value = useMemo(()=>({socket}), [socket]);

    const joinUserRef = useRef(new Set<number>());

    const fetchConversation = useRef(true);

    // useEffect(()=>{
    //     if(!socket || socket.readyState !== WebSocket.OPEN) return;

    //     conversation.forEach((v:any)=>{
    //         if(joinUserRef.current.has(v.id)){
    //             return
    //         }
            
    //         const payload = {
    //             conversationId : v.id,    
    //         }
    //         chatHistory(socket, payload)
    //         console.log("hit")
    //         joinUserRef.current.add(v.id);
    //     });

    // }, [conversation]);


    // we can also fetch in dashboard provider
    // bcz here may be there is a chance that connect estabilished but
    // fetch taking time or http-server slow to response so fetch in authProvider then 
    // zustand stores all ids then socket connect it automatically hit joinroom() and 
    // all ids join and In ws-server send back history on joining to phir dobara iterate
    //  karke history nahi fetch karna hoga on chat-page pe on mounting
     
    
    // useEffect(()=>{
    //     if(socketRef.current) return;

    //     async function fetchDmsAnsGroupChat() {
    //         try{
    //             // setLoading(true);
    //             const response = await api.get("/conversations");
    //             console.log("allchatsWithRoom: ", response.data.conversation);
    //             setConversation(response.data.conversation);
    //             const val = response.data.conversation;
    //             setBackendConversation(response.data.conversation)
    //             // setAllChat(response.data.conversation);
    //         }
    //         catch(e:any){
    //             console.log(e);
    //             // toast.error(e.response.data.message);
    //         } finally{
    //             // setLoading(false);
    //         }
    //     }

    //     fetchDmsAnsGroupChat();
        
    // }, []) 

    // useEffect(()=>{
    //     async function fetchDmsAnsGroupChat() {
    //         try{
    //             const response = await api.get("/conversations");
    //             console.log("allchatsWithRoom: ", response.data.conversation);
    //             // setConversation(response.data.conversation);
    //             setBackendConversation(response.data.conversation)

    //             const val = response.data.conversation.map((v:any)=> v.id)
    //             setSideConversationOrder(val);

    //             // socketManager.connect();
    //             // setSocket(socketManager.getSocket());

    //             response.data.conversation.forEach((v:any)=> {
    //                 const friendDetails = v.members.filter((users:any) => users.userId !== user?.id);
    //                 const data = {
    //                     conversationId : v.id,
    //                     createdAt : v.createdAt,
    //                     image : v.image || null,
    //                     // member : {
    //                     //     senderId : friendDetails[0].userId,
    //                     //     firstname : friendDetails[0].user.firstname,
    //                     //     image : friendDetails[0].user.image,
    //                     // },
    //                     member : friendDetails,
    //                     lastMessage : v.messages.length > 0 ? v.messages[0].text.includes("joined") ? "" : v.messages[0].text : "",
    //                     type : v.type,
    //                     name : v.name || null,
    //                     updatedAt : v.updatedAt,
    //                 } 
    //                 setSidebarDefaultConversation(v.id, data);

    //                 //set default unread Messages:
    //                 const currUser = v.members.find((admin:any)=>admin.userId === user?.id)
    //                 // console.log("msg-members", v.members.find((val:any)=>val.userId === user?.id))
    //                 if(currUser.unreadCount > 0){
    //                     setUnreadMessage(currUser.conversationId, currUser.unreadCount);
    //                 }
    //             })

    //             // setConversation(response.data.conversation);
    //         }
    //         catch(e:any){
    //             console.log(e);
    //         }
    //     }

    //     fetchDmsAnsGroupChat()
    // }, [])

    // const [isSocketActive, setIsSocketActive] = useState<WebSocket | null>(null);
    useEffect(()=>{
        if(!user) return;
        console.log("Uper ayya---");
        socketManager.connect();
        // const socket = socketManager.getSocket();
        // console.log("Result---", socket);
        // if(socket){
        //     setIsSocketActive(socket);
        // }
        
        // if(fetchConversation.current || !socket){
        //     fetchDmsAnsGroupChat();
        //     fetchConversation.current = false;
        // }

        return ()=>{
            socketManager.disconnect();
            // setIsSocketActive(null)
        }

        // test karke dekhlo sab thik chal raha hi ya nahi bcz all thing set in SocketManager

    }, [user])

    // useEffect(()=>{
    //     if(!user) return;
        
    //     if(socketRef.current) return;

    //     const ws = createSocket();
    //     console.log("ws Provider: ", ws);
    //     if(!ws) return;

    //     ws.onopen = async()=>{
    //         console.log("User connected")  

    //         socketRef.current = ws;
    //         setSocket(ws);
    //     }

    //     ws.onerror = (err)=>{
    //         console.log("WS Error", err);
    //     }

    //     ws.onclose = (event) => {
    //         console.log(
    //             "🔌 Socket Closed",
    //             event.code,
    //             event.reason
    //         );
    //         if (socketRef.current === ws) {
    //             socketRef.current = null;
    //             setSocket(null);
    //         }
    //     };

    //     return () => {
    //         console.log(
    //             "Cleaning up socket..."
    //         );
    //         ws.close();
    //         socketRef.current = null;
    //         setSocket(null);
    //     };

    // }, [user]);
    // console.log("isSocketActive---", isSocketActive);
    // if(!isSocketActive){
    //     return(
    //         <div className="absolute inset-0 z-10 w-screen h-screen flex flex-col justify-center items-center backdrop-blur-xs">
    //             <div className="connection w-20"></div>
    //             <span className="mt-4 ml-2 text-white text-xl">Trying to connect with socket</span>
    //         </div>
    //     )
    // }

    return(
        <SocketContext.Provider value={socketManager}>
            {children}
        </SocketContext.Provider>
    )
}


export function useSocket() {

  const context = useContext(SocketContext);

  if (!context) {
    throw new Error(
      "useSocket must be used inside SocketProvider"
    );
  }

  return context;
}

