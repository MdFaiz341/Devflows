import { Cross, CrossIcon, PlusCircle, X } from "lucide-react";
import { useChatStore } from "../../Storage/useChatStore"
import { useStore } from "../../Storage/useStore";
import { useHook } from "../../hook/useHook";
import { useState } from "react";



export const GroupMembers = ({selectedChat, open, setOpen}:{
    selectedChat : any,
    open : boolean,
    setOpen : (e:boolean)=>void
})=>{

    const onlineUsers = useChatStore((state)=> state.joinedUser[selectedChat.conversationId]);
    const user = useStore((state)=>state.user);
    const sidebarDefaultConversation = useChatStore((state)=>state.sidebarDefaultConversation[selectedChat.conversationId]);
    const [show, setShow] = useState<number>();

    return(
        open &&
        <div className="absolute right-5 top-16 w-[260px] max-h-[235px] rounded-2xl p-3 bg-gray-950 overflow-y-auto z-50">
            <div className="flex flex-col gap-2 mt-2">
                <div><X size={20} className="bg-gray-800 rounded-full p-1" onClick={()=>setOpen(false)}/></div>
                <div className="flex justify-between p-2 items-center rounded-2xl hover:bg-gray-700 transition-all duration-200 cursor-pointer">
                    <div className="flex items-center gap-2">
                        <img src={user?.image} className="rounded-full w-5 h-5"></img>
                        <div className="text-xs">{user?.firstname}</div>
                    </div>
                    <div className="text-xs text-green-400">You</div>
                </div>
                {
                    sidebarDefaultConversation?.member.map((v:any)=>{
                        console.log("FilteredFriendsMemebrs: ", v);
                        return(
                            <div
                                key={v.id} 
                                className="flex justify-between p-2 items-center rounded-2xl hover:bg-gray-700 transition-all duration-200 cursor-pointer">
                                    
                                    <div className="flex gap-2 items-center w-[80%]">
                                        <img src={v.user.image} className="rounded-full w-5 h-5"></img>
                                        <div className="flex flex-col justify-between">
                                            <div className="font-medium text-xs">{v.user.firstname}</div>
                                            <span className="text-xs text-green-700">{v.user.email}</span>
                                        </div>
                                    </div>
                                    <div>
                                        {
                                            onlineUsers?.totalUserIDs.some((userId:any) => userId === v.user.id)
                                            ? <span className="text-xs text-green-400">● online</span>
                                            : <span className="text-xs text-green-400">offline</span>
                                        }
                                    </div>
                            </div>
                        )
                    })
                }
            </div>
        </div>
    )
}