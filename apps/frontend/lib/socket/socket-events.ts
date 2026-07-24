import { useChatStore } from "../../Storage/useChatStore";
import { useStore } from "../../Storage/useStore";


export const eventHandler = (event : MessageEvent)=>{
    const data = JSON.parse(event.data);
    const user = useStore.getState().user;

    console.log("SOCKET DATA", data);

    const store = useChatStore.getState();

    switch (data.type) {
        case "new_message":

            console.log("received: ", data.message.conversationId, data.clientID);

            const current = store.messageByConversation[data.message.conversationId] || []
                                // map nahi hoga

            console.log("current:", current);

            console.log(
                current.map(m => ({
                    id: m.id,
                    clientID: m.clientID
                }))
            );
            
            const exists = current?.some((msg)=> (msg.clientID === data.clientID))
            console.log("exist:---------", exists);
            if(exists){
                console.log("replace---")
                store.replaceInstantMessage(data.message.conversationId, data.message, data.clientID)
            }
            else{
                const cached = store.messageByConversation[data.message.conversationId];
                if(cached){
                    console.log("add into new---")
                    store.addMessage(data.message.conversationId, data.message)
                }
            }

            store.updateCurrentChatToTop(data.message.conversationId)
            store.updateConversationPreview(data.message.conversationId, data.message.text, data.message.createdAt);

            const conversationId = store.selectedConversation || 0;

            console.log("event-ConversId", conversationId);
            console.log("data-ConversId", data.message.conversationId);

            if(data.message.conversationId !== conversationId){
                store.incrementCount(data.message.conversationId);
            }

            break;

        case "history":
            store.setMessages(data.conversationId, data.message)
            break;

        case "totalUser":
            store.setJoinedUser(data.message.conversationId, data.message);
            break;
        
        case "typing":
            store.setTyping(data.message.conversationId, data.message.userId, data.message.isTyping)
            break;

        case "stop_typing":
            store.setTyping(data.message.conversationId, data.message.userId, data.message.isTyping)
            break;

        case "delete_chat":
            console.log("delete_chat Event---)")
            console.log("delete_chat Event---)*******")
            console.log("delete_chat Event---))))))))")
            store.addMessage(data.message.conversationId, data.message);
            console.log("User---id:) ", data.message.sender.id);
            const defaultData = store.sidebarDefaultConversation[data.message.conversationId];
            console.log("defULTdATA: ", defaultData);
            const filterFriends = defaultData?.member.filter((ids)=> ids.user.id !== data.message.sender.id);
            console.log("FliteredFriends: ", filterFriends);
            if(!filterFriends) return;
            const updatedFriends = {
                ...defaultData,
                member : filterFriends,
            }
            console.log("UpdatedFriends: ", updatedFriends);
            store.setSidebarDefaultConversation(data.message.conversationId, updatedFriends as any);
            break;

        case "chatCreation":
            const updateVal = {
                ...data.message.data,
                member : data.message.data.member.filter((ids:any)=> ids.userId !== user?.id) 
            }
            console.log("UpdateDAta: ", updateVal);
            store.setSidebarDefaultConversation(data.conversationId, updateVal)
            store.setSideConversationOrder([data.conversationId, ...store.sideConversationOrder])
            console.log("group-create-Event---");
            break;

        default:
            break;
    }
};

// export const socketEventListner = (
//     socket : WebSocket,
// )=>{

//     console.log("ATTACHING SOCKET LISTENER");
//     socket.addEventListener("message", eventHandler);

//     return ()=>{
//         console.log("socket Listner Remove")
//         socket.removeEventListener("message", eventHandler);
//     }
// }