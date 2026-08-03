import { useRouter } from "next/navigation";
import { useChatStore } from "../../Storage/useChatStore"
import { SidebarConversations } from "./SidebarConversations";






export const NotificationUI = ({openNotification}:{
    openNotification : boolean,
})=>{
    const unreadMessage = useChatStore((state)=>state.unreadMessage);
    const conversationOrderIds = useChatStore((state)=>state.sideConversationOrder);
    const sidebarDefaultConversation = useChatStore((state)=>state.sidebarDefaultConversation)
    const router = useRouter();



    return(
        <>
            {
                openNotification 
                &&  <div className="absolute bg-black/100 border border-blue-700 top-[4em] right-[6%] w-[20rem] p-4 rounded-xl z-10 h-[373px] overflow-y-auto">
                        <div className="">
                            {
                                conversationOrderIds.map((ids)=>{
                                    const count = unreadMessage[ids];
                                    console.log("count: ", count);
                                    if(!count) return;
                                    const chat = sidebarDefaultConversation[ids];
                                    return(
                                        <div key={chat?.conversationId} className="bg-gray-800 hover:bg-gray-700 transition-all duration-300" onClick={()=>router.push("/dashboard/chat-room")}>
                                            <SidebarConversations chat={chat} unreads={[]} setUnreads={()=>{}}/>
                                        </div>
                                    )
                                })
                            }
                        </div>
                    </div>
            }
            
        </>
    )
}